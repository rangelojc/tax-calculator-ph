import React from "react";
import { ListItem, ListItemLabel } from "baseui/list";
import { peso } from "../lib/util";
import UnpaddedList from "./unpadded-list";

interface IBenefitsProp {
  monthly: number;
}

const Benefits: React.FC<IBenefitsProp> = (props) => {
  return (
    <UnpaddedList>
      <ListItem endEnhancer={() => peso.format(props.monthly)}>
        <ListItemLabel>13th Month</ListItemLabel>
      </ListItem>
    </UnpaddedList>
  );
};

export default Benefits;
