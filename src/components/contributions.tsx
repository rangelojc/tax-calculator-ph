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
            <ListItemLabel
              description={
                <span>
                  SSS 2021{" "}
                  <a href="https://www.sss.gov.ph/sss/DownloadContent?fileName=ci2020-033.pdf&fbclid=IwAR2e4H0g-mV40qoMUWRpl5-VjfP2Czdlvt93F8Kw6FJvOp95IKrPkn8l8r8">
                    Contributions
                  </a>
                </span>
              }
            >
              SSS
            </ListItemLabel>
          </ListItem>
        )}
        {props.employerType === "govt" && (
          <ListItem endEnhancer={() => peso.format(c.gsis)}>
            <ListItemLabel
              description={"GSIS contribution is 9% of monthly income"}
            >
              GSIS
            </ListItemLabel>
          </ListItem>
        )}
        <ListItem endEnhancer={() => peso.format(c.philHealth)}>
          <ListItemLabel description="Premium rate of 3%, equally shared with employer">
            Philhealth
          </ListItemLabel>
        </ListItem>
        <ListItem endEnhancer={() => peso.format(c.pagibig)}>
          <ListItemLabel
            description={`2% of the maximum monthly compensation of ${peso.format(
              5000
            )}`}
          >
            Pag-ibig
          </ListItemLabel>
        </ListItem>
        <ListItem endEnhancer={() => peso.format(total)}>
          <ListItemLabel>Total</ListItemLabel>
        </ListItem>
      </ul>
    </>
  );
};

export default Contributions;
