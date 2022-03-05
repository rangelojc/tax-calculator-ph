import { useStyletron } from "baseui";
import { Block } from "baseui/block";
import { ChevronRight } from "baseui/icon";
import { ListItem, ListItemLabel } from "baseui/list";
import { LabelLarge, LabelSmall } from "baseui/typography";
import React, { useEffect, useState } from "react";
import { peso } from "../lib/util";
import UnpaddedList from "./unpadded-list";

const TaxSummary: React.FC<ITaxSummary> = (props) => {
  const [summary, setSummary] = useState(props);
  const [, theme] = useStyletron();

  const getDivisor = (period: ISummaryPeriod) => {
    switch (period) {
      case "Monthly":
        return 12;
      case "Biweekly":
        return 24;
      default:
      case "Annual":
        return 1;
    }
  };

  useEffect(() => {
    const divisor = getDivisor(props.period);
    const sum = Object.keys(props)
      .filter((q) => q !== "children")
      .map((q) => q as keyof ITaxSummary)
      .reduce((val, key) => {
        if (typeof props[key] == "object") {
          val = {
            ...val,
            [key]: Object.keys(props[key]).reduce(
              (v: any, k: string) => ({ ...v, [k]: v[k] / divisor }),
              props[key]
            ),
          };
        } else if (typeof props[key] == "string") {
          val = { ...val, [key]: props[key] };
        } else {
          val = { ...val, [key]: (props[key] as number) / divisor };
        }
        return val;
      }, props);
    setSummary(sum);
  }, [props]);

  return (
    <>
      <UnpaddedList>
        <ListItem endEnhancer={() => peso.format(summary.gross)}>
          <ListItemLabel description>Gross Income</ListItemLabel>
        </ListItem>
        <ListItem endEnhancer={() => peso.format(summary.deminimis)}>
          <ListItemLabel>Non Taxable Income</ListItemLabel>
        </ListItem>
        <ListItem
          sublist
          artwork={ChevronRight}
          endEnhancer={() => peso.format(summary.deminimis)}
        >
          <ListItemLabel sublist>De Minimis</ListItemLabel>
        </ListItem>

        <ListItem endEnhancer={() => peso.format(summary.totalContribution)}>
          <ListItemLabel>Contributions</ListItemLabel>
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
          <LabelLarge color={theme.colors.buttonPrimaryText}>
            {peso.format(summary.taxDue)}
          </LabelLarge>
          <LabelSmall color={theme.colors.buttonPrimaryText}>
            Tax Due
          </LabelSmall>
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
          <LabelLarge color={theme.colors.buttonPrimaryText}>
            {peso.format(
              summary.gross - summary.totalContribution - summary.taxDue
            )}
          </LabelLarge>
          <LabelSmall color={theme.colors.buttonPrimaryText}>
            Take home pay
          </LabelSmall>
        </Block>
      </UnpaddedList>
    </>
  );
};

export default TaxSummary;
