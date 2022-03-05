import { styled, useStyletron } from "baseui";
import { Block } from "baseui/block";
import { Checkbox, LABEL_PLACEMENT, STYLE_TYPE } from "baseui/checkbox";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { ALIGN, Radio, RadioGroup } from "baseui/radio";
import {
  LabelLarge,
  LabelSmall,
  LabelXSmall,
  ParagraphMedium,
  ParagraphSmall,
} from "baseui/typography";
import React, { useEffect, useState } from "react";
import "./App.css";
import Contributions from "./components/contributions";
import Form from "./components/form";
import TaxSummary from "./components/tax-summary";
import { computeContributions } from "./lib/contributions";
import {
  computeAnnual,
  computeTaxableIncome,
  computeTaxDue,
} from "./lib/ra-10963";

const Panel = styled("div", (props) => ({
  // border: `${props.$theme.borders.border600.borderStyle} ${props.$theme.borders.border600.borderWidth} ${props.$theme.borders.border600.borderColor}`,
  // borderRadius: props.$theme.borders.radius300,
  // padding: props.$theme.sizing.scale600
}));

const InfoLink: React.FC<{ link: string; linkLabel: string }> = (props) => {
  return (
    <ParagraphSmall>
      <span>{props.children}:</span>
      <br />
      <a href={props.link} target={"_blank"} rel="noreferrer">
        {props.linkLabel}
      </a>
    </ParagraphSmall>
  );
};

const initialContributions = {
  sss: 0,
  sssMpf: 0,
  gsis: 0,
  pagibig: 0,
  philHealth: 0,
};

function App() {
  const [values, setValues] = useState<IIncomeForm>({
    monthly: "20000",
    deminimis: "",
    employerType: "pvt",
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [use2023, setUse2023] = useState(false);
  const [contributions, setContributions] =
    useState<IMandatoryContributions>(initialContributions);
  const [summary, setSummary] = useState<ITaxSummary>({
    gross: 0,
    taxable: 0,
    nonTaxable: 0,
    taxDue: 0,
    takeHome: 0,
    totalContribution: 0,
    deminimis: 0,
  });
  const [, theme] = useStyletron();

  const validator = (val: IIncomeForm) => {
    const errors: any = {};
    if (!val.monthly) errors.monthly = "Required";
    else if (!/^[0-9.]*$/.test(val.monthly))
      errors.monthly = "Must only contain digits [0-9] and a decimal [.]";

    if (!/^[0-9.]*$/.test(val.deminimis))
      errors.deminimis = "Must only contain digits [0-9] and a decimal [.]";

    return errors;
  };

  useEffect(() => {
    let _monthly = isNaN(parseFloat(values.monthly))
      ? 0
      : parseFloat(values.monthly);
    let _deminimis = isNaN(parseFloat(values.deminimis))
      ? 0
      : parseFloat(values.deminimis);
    const annual = computeAnnual(_monthly);
    const contributions = computeContributions(values.employerType, _monthly);
    const taxable = computeTaxableIncome(annual, contributions, _deminimis);
    setContributions(contributions);
    const taxDue = computeTaxDue(taxable.taxable, use2023 ? "2023" : "2018");
    setSummary({
      ...taxable,
      taxDue,
      takeHome: taxable.gross - taxDue - taxable.totalContribution,
    });
  }, [values, use2023]);

  return (
    <>
      <Block
        marginTop={[0, 0, "5rem", "5rem"]}
        $style={{ boxSizing: "border-box" }}
        padding={"1rem"}
        width={["100%", "100%", "960px", "1140px"]}
        height={["100%"]}
        marginRight={"auto"}
        marginLeft={"auto"}
        display={"flex"}
      >
        <Block flex={1}>
          <FlexGrid
            flexGridColumnCount={[1, 1, 2, 2]}
            flexGridColumnGap="scale800"
            flexGridRowGap="scale800"
          >
            <FlexGridItem>
              <Panel>
                <LabelLarge>Income</LabelLarge>
                <LabelXSmall>Monthly</LabelXSmall>
                <Block marginTop={theme.sizing.scale800}>
                  <Form
                    initialValues={values}
                    validate={validator}
                    valueSetter={setValues}
                  >
                    {({ values, dirty, errors, handleChange }) => (
                      <>
                        <FormControl
                          label={() => "Base salary"}
                          caption={() => "Monthly salary"}
                          error={errors.monthly}
                        >
                          <Input
                            value={values.monthly}
                            type={"number"}
                            onChange={handleChange("monthly")}
                            positive={!errors.monthly && dirty}
                          />
                        </FormControl>
                        <FormControl label={() => "Employer Type"}>
                          <RadioGroup
                            value={values.employerType}
                            onChange={handleChange("employerType")}
                            name="number"
                            align={ALIGN.vertical}
                          >
                            <Radio
                              value="pvt"
                              description="Employed by a non-government institution"
                            >
                              Private
                            </Radio>
                            <Radio
                              value="govt"
                              description="Employed by a government institution"
                            >
                              Government
                            </Radio>
                          </RadioGroup>
                        </FormControl>
                        <FormControl
                          label={() => "De Minimis Allowance"}
                          caption={() =>
                            "Monthly non-taxable allowance. i.e. (rice, meal, clothing, etc.)"
                          }
                          error={errors.deminimis}
                        >
                          <Input
                            value={values.deminimis}
                            type={"number"}
                            onChange={handleChange("deminimis")}
                            positive={!errors.deminimis && dirty}
                          />
                        </FormControl>
                      </>
                    )}
                  </Form>
                </Block>
              </Panel>

              <Panel style={{ marginTop: theme.sizing.scale800 }}>
                <LabelLarge>Contributions</LabelLarge>
                <LabelXSmall>Monthly</LabelXSmall>
                <Contributions
                  employerType={values.employerType}
                  contributions={contributions}
                />
              </Panel>
            </FlexGridItem>
            <Block as={FlexGridItem}>
              <Panel
                style={{
                  backgroundColor: theme.colors.backgroundSecondary,
                  padding: theme.sizing.scale800,
                }}
              >
                <LabelLarge>Summary</LabelLarge>
                <TaxSummary {...summary} />
              </Panel>

              <Panel
                style={{
                  marginTop: theme.sizing.scale800,
                  backgroundColor: theme.colors.backgroundSecondary,
                  padding: theme.sizing.scale800,
                }}
              >
                <LabelLarge>Useful Information</LabelLarge>
                <InfoLink
                  link="https://ntrc.gov.ph/images/Publications/where-does-your-tax-money-go.pdf"
                  linkLabel="National Tax Research Center"
                >
                  Where does your tax go?
                </InfoLink>

                <InfoLink
                  link="https://www.officialgazette.gov.ph/downloads/2017/12dec/20171219-RA-10963-RRD.pdf"
                  linkLabel="RA 10963 - Section 5"
                >
                  Income tax reference
                </InfoLink>
                <InfoLink
                  link="https://www.sss.gov.ph/sss/DownloadContent?fileName=ci2020-033.pdf&fbclid=IwAR2e4H0g-mV40qoMUWRpl5-VjfP2Czdlvt93F8Kw6FJvOp95IKrPkn8l8r8"
                  linkLabel="Circular 2020-033"
                >
                  SSS contribution
                </InfoLink>
                <InfoLink
                  link="https://www.gsis.gov.ph/about-us/gsis-laws/republic-act-no-8291/"
                  linkLabel="RA 8291 - Section 11"
                >
                  GSIS contribution
                </InfoLink>
                <InfoLink
                  link="https://www.pagibigfund.gov.ph/document/pdf/governance/43.1_on_institutional_matters/IRR%20of%20RA%20No.%209679.pdf"
                  linkLabel="RA 9679 - Rule VI - Section 1"
                >
                  Pagibig contribution
                </InfoLink>
                <InfoLink
                  link="https://www.philhealth.gov.ph/partners/employers/ContributionTable.pdf"
                  linkLabel="PhilHealth contribution table"
                >
                  PhilHealth contribution
                </InfoLink>

                <ParagraphSmall>
                  Good{" "}
                  <a href="https://www.taxumo.com/blog/withholding-tax-101-or-why-is-my-pay-less-than-what-my-client-said-it-would-be/">
                    article
                  </a>{" "}
                  about Withholding tax vs Income tax.
                </ParagraphSmall>
              </Panel>
              {showAdvanced && (
                <Panel
                  style={{
                    marginTop: theme.sizing.scale800,
                    backgroundColor: theme.colors.backgroundSecondary,
                    padding: theme.sizing.scale800,
                  }}
                >
                  <LabelLarge>Tax rate option</LabelLarge>
                  <ParagraphSmall>
                    On January 1, 2023 the tax rates will change to something{" "}
                    <b>lower</b> according to{" "}
                    <a href="https://www.officialgazette.gov.ph/downloads/2017/12dec/20171219-RA-10963-RRD.pdf">
                      RA 10963
                    </a>
                    , toggle the switch below to preview your tax rates then.
                  </ParagraphSmall>

                  <Checkbox
                    checked={use2023}
                    checkmarkType={STYLE_TYPE.toggle}
                    onChange={(e) => setUse2023(e.currentTarget.checked)}
                    labelPlacement={LABEL_PLACEMENT.right}
                  >
                    Use 2023 Tax rates
                  </Checkbox>

                  <ParagraphSmall>
                    🤑 🤑 🤑&nbsp;&nbsp;Lower taxes!
                  </ParagraphSmall>
                </Panel>
              )}

              <Block
                display={"flex"}
                flexDirection={"row-reverse"}
                marginTop={theme.sizing.scale200}
              >
                <LabelSmall
                  onClick={() => {
                    setShowAdvanced((q) => !q);
                  }}
                  $style={{
                    cursor: "pointer",
                    color: theme.colors.accent,
                  }}
                >
                  {showAdvanced ? "Hide" : "Show"} Advanced options
                </LabelSmall>
              </Block>
            </Block>
          </FlexGrid>
        </Block>
      </Block>

      <Block
        marginTop={theme.sizing.scale2400}
        marginBottom={theme.sizing.scale800}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        display={"flex"}
      >
        <ParagraphMedium>Found this useful?</ParagraphMedium>
        <a href="https://www.buymeacoffee.com/exkpSj2">
          <img
            alt="Buy me coffee"
            src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=exkpSj2&button_colour=FFDD00&font_colour=000000&font_family=Bree&outline_colour=000000&coffee_colour=ffffff"
          />
        </a>
      </Block>
    </>
  );
}

export default App;
