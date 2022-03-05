import React, { useEffect } from "react";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { RadioGroup, ALIGN, Radio } from "baseui/radio";
import useForm from "../hooks/use-form";
import { useTranslation } from "react-i18next";

interface IIncomeFormProps {
  values: IIncomeForm;
  onChange: (val: IIncomeForm) => void;
}

const IncomeForm: React.FC<IIncomeFormProps> = (props: IIncomeFormProps) => {
  const { t } = useTranslation();
  const validator = (val: IIncomeForm) => {
    const errors: any = {};
    if (!val.monthly) errors.monthly = t("errors.required");
    else if (!/^[0-9.]*$/.test(val.monthly))
      errors.monthly = t("errors.numbersOnly");

    if (!/^[0-9.]*$/.test(val.deminimis))
      errors.deminimis = t("errors.numbersOnly");

    return errors;
  };
  const { values, dirty, errors, handleChange } = useForm<IIncomeForm>(
    props.values,
    validator
  );
  useEffect(() => {
    props.onChange && props.onChange(values);
  }, [values, props]);
  return (
    <>
      <FormControl
        label={() => t("income.base.label")}
        caption={() => t("income.base.desc")}
        error={errors.monthly}
      >
        <Input
          value={values.monthly}
          type={"number"}
          onChange={handleChange("monthly")}
          positive={!errors.monthly && dirty}
        />
      </FormControl>
      <FormControl label={() => t("income.employerType.label")}>
        <RadioGroup
          value={values.employerType}
          onChange={handleChange("employerType")}
          name="number"
          align={ALIGN.vertical}
        >
          <Radio value="pvt" description={t("income.employerType.pvt.desc")}>
            {t("income.employerType.pvt.label")}
          </Radio>
          <Radio value="govt" description={t("income.employerType.govt.desc")}>
            {t("income.employerType.govt.label")}
          </Radio>
        </RadioGroup>
      </FormControl>
      <FormControl
        label={() => t("income.deminimis.label")}
        caption={() => t("income.deminimis.label")}
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
  );
};

export default IncomeForm;
