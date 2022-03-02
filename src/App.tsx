import React, { useEffect, useState } from 'react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider, useStyletron, styled } from 'baseui';
import './App.css';
import { computeAnnual, computeTaxableIncome, computeTaxDue } from './lib/ra-10963'
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Block } from "baseui/block";
import { RadioGroup, Radio, ALIGN } from "baseui/radio";
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import Contributions from './components/contributions';
import { computeContributions } from './lib/contributions';
import TaxSummary from './components/tax-summary';
import Benefits from './components/benefits';
import { LabelLarge } from 'baseui/typography'


const engine = new Styletron();

const Panel = styled('div', props => ({
  // border: `${props.$theme.borders.border600.borderStyle} ${props.$theme.borders.border600.borderWidth} ${props.$theme.borders.border600.borderColor}`,
  // borderRadius: props.$theme.borders.radius300,
  // padding: props.$theme.sizing.scale600
}))

function App() {
  const [monthly, setMonthly] = useState('20000');
  const [employerType, setEmployerType] = useState<IEmployerType>('pvt')
  const [contributions, setContributions] = useState<IMandatoryContributions>({
    sss: 0, gsis: 0, pagibig: 0, philHealth: 0
  });
  const [summary, setSummary] = useState<ITaxSummary>({
    gross: 0, taxable: 0, nonTaxable: 0, taxDue: 0, takeHome: 0
  })
  const [gross, setGross] = useState(0);
  const [nonTaxable, setNonTaxable] = useState(0)
  const [taxable, setTaxable] = useState(0)
  const [tax, setTax] = useState(0)
  const peso = Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2 });
  const [css, theme] = useStyletron();


  useEffect(() => {
    const annual = computeAnnual(parseFloat(monthly));
    const contributions = computeContributions(employerType, parseFloat(monthly));
    const taxable = computeTaxableIncome(annual, contributions, 0)
    setContributions(contributions)
    setSummary({ ...taxable, taxDue: computeTaxDue(taxable.taxable, '2018'), takeHome: 0 })
    setGross(taxable.gross)
    setNonTaxable(taxable.nonTaxable)
    setTaxable(taxable.taxable)
    setTax(
      computeTaxDue(taxable.taxable, '2023')
    )
  }, [monthly, employerType])

  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <Block padding={'1rem'} width={['100%', '100%', '960px', '1140px']} margin={'auto'} >
          <FlexGrid
            flexGridColumnCount={[1, 1, 2, 2]}
            flexGridColumnGap="scale800"
            flexGridRowGap="scale800"
          >
            <FlexGridItem>
              <Panel
              >
                <LabelLarge>Income</LabelLarge>
                <FormControl
                  label={() => "Monthly Income"}
                  caption={() => "Base monthly income with mandatory contributions"}
                >

                  <Input value={monthly} onChange={(e) => setMonthly((e.currentTarget.value))} />
                </FormControl>
                <FormControl
                  label={() => "Employer Type"}
                >
                  <RadioGroup
                    value={employerType}
                    onChange={e => setEmployerType(e.currentTarget.value as IEmployerType)}
                    name="number"
                    align={ALIGN.vertical}
                  >
                    <Radio value="pvt"
                      description='Employed by a non-government institution'
                    >
                      Private
                    </Radio>
                    <Radio
                      value="govt"
                      description='Employed by a government institution'
                    >
                      Government
                    </Radio>
                  </RadioGroup>
                </FormControl>
              </Panel>


              <Panel style={{ marginTop: theme.sizing.scale800 }}>
                <LabelLarge>Contributions</LabelLarge>
                <Contributions employerType={employerType} contributions={contributions} />
              </Panel>

            </FlexGridItem>
            <Block as={FlexGridItem}
            >


              <Panel>
                <LabelLarge>Summary</LabelLarge>
                <TaxSummary {...summary} />
              </Panel>

            </Block>
          </FlexGrid>

        </Block>

      </BaseProvider>
    </StyletronProvider>
  );
}

export default App;
