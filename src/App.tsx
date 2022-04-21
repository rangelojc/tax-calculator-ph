import { styled, useStyletron } from "baseui";
import { Block } from "baseui/block";
import { Checkbox, LABEL_PLACEMENT, STYLE_TYPE } from "baseui/checkbox";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { StyledLink } from "baseui/link";
import { ALIGN, Radio, RadioGroup } from "baseui/radio";
import {
  LabelLarge,
  LabelSmall,
  LabelXSmall,
  ParagraphMedium,
  ParagraphSmall,
  ParagraphXSmall,
} from "baseui/typography";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./App.css";
import Contributions from "./components/contributions";
import IncomeForm from "./components/income-form";
import TaxSummary from "./components/tax-summary";
import { computeContributions } from "./lib/contributions";
import {
  computeAnnual,
  computeTaxableIncome,
  computeTaxDue,
} from "./lib/ra-10963";
import { useTheme } from "./providers/ThemeProvider";

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
      <StyledLink href={props.link} target={"_blank"} rel="noreferrer">
        {props.linkLabel}
      </StyledLink>
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
  const { t } = useTranslation();
  const [values, setValues] = useState<IIncomeForm>({
    monthly: "20000",
    deminimis: "",
    employerType: "pvt",
  });
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [period, setPeriod] = useState<ISummaryPeriod>("Annual");
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
    period: "Annual",
  });
  const [, theme] = useStyletron();

  const themeContext = useTheme();
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    themeContext.changeTheme(darkMode ? "dark" : "light");
  }, [darkMode, themeContext]);

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
      period,
    });
  }, [values, use2023, period]);

  return (
    <>
      <Block
        height={["100%"]}
        backgroundColor={theme.colors.background}
        overflow={"auto"}
      >
        <Block
          $style={{ boxSizing: "border-box" }}
          padding={"1rem"}
          maxWidth={["100%", "100%", "900px", "1140px"]}
          marginRight={"auto"}
          marginLeft={"auto"}
          display={"flex"}
          justifyContent={"end"}
        >
          <Checkbox
            checked={darkMode}
            checkmarkType={STYLE_TYPE.toggle}
            onChange={(e) => setDarkMode(e.currentTarget.checked)}
            labelPlacement={LABEL_PLACEMENT.right}
          >
            {t("dark")}
          </Checkbox>
        </Block>

        <Block
          marginTop={[0, 0, "5rem", "5rem"]}
          $style={{ boxSizing: "border-box" }}
          padding={"1rem"}
          maxWidth={["100%", "100%", "900px", "1140px"]}
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
                    <IncomeForm onChange={setValues} values={values} />
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
                  <LabelLarge marginBottom={theme.sizing.scale800}>
                    {t("summary.title")} - {period}
                  </LabelLarge>
                  <TaxSummary {...summary} period={period} />
                  <RadioGroup
                    value={period}
                    onChange={(e) => setPeriod(e.currentTarget.value as any)}
                    name="number"
                    align={ALIGN.horizontal}
                  >
                    <Radio value="Annual">{t("period.annual")}</Radio>
                    <Radio value="Monthly">{t("period.monthly")}</Radio>
                    <Radio value="Biweekly">{t("period.biweekly")}</Radio>
                  </RadioGroup>

                  <ParagraphXSmall>{t("period.warning")}</ParagraphXSmall>
                </Panel>

                <Panel
                  style={{
                    marginTop: theme.sizing.scale800,
                    backgroundColor: theme.colors.backgroundSecondary,
                    padding: theme.sizing.scale800,
                  }}
                >
                  <LabelLarge>{t("info.title")}</LabelLarge>
                  <InfoLink
                    link="https://ntrc.gov.ph/images/Publications/where-does-your-tax-money-go.pdf"
                    linkLabel={t("info.ntrc")}
                  >
                    {t("info.where")}
                  </InfoLink>

                  <InfoLink
                    link="https://www.officialgazette.gov.ph/downloads/2017/12dec/20171219-RA-10963-RRD.pdf"
                    linkLabel={t("info.ra10963")}
                  >
                    {t("info.incomeTax")}
                  </InfoLink>
                  <InfoLink
                    link="https://www.sss.gov.ph/sss/DownloadContent?fileName=ci2020-033.pdf&fbclid=IwAR2e4H0g-mV40qoMUWRpl5-VjfP2Czdlvt93F8Kw6FJvOp95IKrPkn8l8r8"
                    linkLabel={t("info.circ2020033")}
                  >
                    {t("info.sss")}
                  </InfoLink>
                  <InfoLink
                    link="https://www.gsis.gov.ph/about-us/gsis-laws/republic-act-no-8291/"
                    linkLabel={t("info.ra8291")}
                  >
                    {t("info.gsis")}
                  </InfoLink>
                  <InfoLink
                    link="https://www.pagibigfund.gov.ph/document/pdf/governance/43.1_on_institutional_matters/IRR%20of%20RA%20No.%209679.pdf"
                    linkLabel={t("info.ra9679")}
                  >
                    {t("info.pagibig")}
                  </InfoLink>
                  <InfoLink
                    link="https://www.philhealth.gov.ph/partners/employers/ContributionTable.pdf"
                    linkLabel={t("info.philHealthContrib")}
                  >
                    {t("info.philHealth")}
                  </InfoLink>

                  <ParagraphSmall>
                    {t("info.good")}{" "}
                    <StyledLink href="https://www.taxumo.com/blog/withholding-tax-101-or-why-is-my-pay-less-than-what-my-client-said-it-would-be/">
                      {t("info.article")}
                    </StyledLink>{" "}
                    {t("info.about")}
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
                    <LabelLarge>{t("2023.title")}</LabelLarge>
                    <ParagraphSmall>
                      {t("2023.on")} <b>{t("2023.lower")}</b>{" "}
                      {t("2023.according")}{" "}
                      <StyledLink href="https://www.officialgazette.gov.ph/downloads/2017/12dec/20171219-RA-10963-RRD.pdf">
                        {t("2023.ra10963")}
                      </StyledLink>
                      {t("2023.toggle")}
                    </ParagraphSmall>

                    <Checkbox
                      checked={use2023}
                      checkmarkType={STYLE_TYPE.toggle}
                      onChange={(e) => setUse2023(e.currentTarget.checked)}
                      labelPlacement={LABEL_PLACEMENT.right}
                    >
                      {t("2023.use")}
                    </Checkbox>

                    <ParagraphSmall>{t("2023.lowerTax")}</ParagraphSmall>
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
                    {t(showAdvanced ? "advanced.hide" : "advanced.show")}
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
          <ParagraphMedium>This is a fork of <a href="https://github.com/darylenterprises/ui.tax-calculator" style={{ color: "#276ef1" }}>darylenterprises/ui.tax-calculator</a></ParagraphMedium>
          {/* <p style={{ textAlign: "right", marginRight: "10px", letterSpacing: "1px" }}>rangelo.dev</p> */}
          <ParagraphSmall><span style={{ letterSpacing: "2px", cursor: "pointer" }} onClick={() => window.location.href = "https://rangelo.dev"}>rangelo.dev</span></ParagraphSmall>
        </Block>
      </Block>
    </>
  );
}

export default App;
