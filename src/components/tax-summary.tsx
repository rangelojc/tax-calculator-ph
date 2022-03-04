import { useStyletron } from "baseui";
import { Block } from "baseui/block";
import { ListItem, ListItemLabel } from "baseui/list";
import { ALIGN, Radio, RadioGroup } from "baseui/radio";
import { DisplayXSmall, LabelMedium } from "baseui/typography";
import React, { useEffect, useState } from "react";
import { peso } from "../lib/util";

const TaxSummary: React.FC<ITaxSummary> = (props) => {
  const [divisor, setDivisor] = useState(1);
  const [summary, setSummary] = useState(props);
  const [, theme] = useStyletron();

  useEffect(() => {
    const sum = Object.keys(props)
      .filter((q) => q !== "children")
      .map((q) => q as keyof ITaxSummary)
      .reduce((val, key) => {
        return { ...val, [key]: props[key] / divisor };
      }, props);
    setSummary(sum);
  }, [divisor, props]);

  return (
    <>
      <ul style={{ padding: 0 }}>
        <ListItem endEnhancer={() => peso.format(summary.gross)}>
          <ListItemLabel description>Gross Income</ListItemLabel>
        </ListItem>
        <ListItem endEnhancer={() => peso.format(summary.totalContribution)}>
          <ListItemLabel>Non Taxable Income</ListItemLabel>
        </ListItem>
        <ListItem endEnhancer={() => peso.format(summary.taxable)}>
          <ListItemLabel>Taxable Income</ListItemLabel>
        </ListItem>
        <Block
          backgroundColor={theme.colors.accent}
          color={"white"}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          padding={"1rem"}
          margin={"2rem"}
        >
          <DisplayXSmall color={theme.colors.buttonPrimaryText}>
            {peso.format(summary.taxDue)}
          </DisplayXSmall>
          <LabelMedium color={theme.colors.buttonPrimaryText}>
            Tax Due
          </LabelMedium>
        </Block>
        <Block
          backgroundColor={theme.colors.backgroundInv}
          color={"white"}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          padding={"1rem"}
          margin={"2rem"}
        >
          <DisplayXSmall color={theme.colors.buttonPrimaryText}>
            {peso.format(
              summary.gross - summary.totalContribution - summary.taxDue
            )}
          </DisplayXSmall>
          <LabelMedium color={theme.colors.buttonPrimaryText}>
            Take home pay
          </LabelMedium>
        </Block>
      </ul>
      <RadioGroup
        value={divisor.toString()}
        onChange={(e) => setDivisor(parseInt(e.currentTarget.value))}
        name="number"
        align={ALIGN.horizontal}
      >
        <Radio value="1">Annual</Radio>
        <Radio value="12">Monthly</Radio>
        <Radio value="24">Biweekly</Radio>
      </RadioGroup>
    </>
  );
};

export default TaxSummary;
