import { ListItem, ListItemLabel } from "baseui/list";
import React from "react";
import { peso } from "../lib/util";

interface IContributionProps {
  contributions: IMandatoryContributions;
  employerType: IEmployerType;
}

const Contributions: React.FC<IContributionProps> = (props) => {
  const { contributions: c } = props;
  const total = Object.keys(c)
    .map((q) => q as keyof typeof c)
    .filter((key) => !isNaN(c[key]))
    .reduce((t, k) => (t += c[k]), 0);
  return (
    <>
      <ul style={{ padding: 0 }}>
        {props.employerType === "pvt" && (
          <ListItem endEnhancer={() => peso.format(c.sss)}>
            <ListItemLabel>SSS</ListItemLabel>
          </ListItem>
        )}
        {props.employerType === "govt" && (
          <ListItem endEnhancer={() => peso.format(c.gsis)}>
            <ListItemLabel>GSIS</ListItemLabel>
          </ListItem>
        )}
        <ListItem endEnhancer={() => peso.format(c.philHealth)}>
          <ListItemLabel>Philhealth</ListItemLabel>
        </ListItem>
        <ListItem endEnhancer={() => peso.format(c.pagibig)}>
          <ListItemLabel>Pag-ibig</ListItemLabel>
        </ListItem>
        <ListItem endEnhancer={() => peso.format(total)}>
          <ListItemLabel>Total</ListItemLabel>
        </ListItem>
      </ul>
    </>
  );
};

export default Contributions;
