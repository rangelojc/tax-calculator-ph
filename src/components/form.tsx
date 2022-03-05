import React, { useState } from "react";

type IFormErrors<TValues> = { [key in keyof TValues]: string | undefined };

interface FormProps<TValues> {
  values: TValues;
  errors: IFormErrors<TValues>;
  handleChange: (prop: keyof TValues) => (value: any) => void;
  dirty: boolean;
}

interface IFormProps<TValues> {
  initialValues: TValues;
  valueSetter: (values: any) => void;
  validate: (values: TValues) => IFormErrors<TValues>;
  children: (props: FormProps<TValues>) => React.ReactNode;
}

const Form = <TValues,>(props: IFormProps<TValues>) => {
  const [values, setValues] = useState<TValues>(props.initialValues);
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<IFormErrors<TValues>>(
    Object.keys(props.initialValues).reduce(
      (p: any, key) => ({ ...p, [key]: undefined }),
      {}
    )
  );
  const handleChange = (prop: keyof TValues) => (ev: any) => {
    const value = ev.currentTarget.value;
    setDirty(true);
    const errors = props.validate({ ...values, [prop]: value });
    setErrors(errors);
    setValues((val) => ({ ...val, [prop]: value }));
    props.valueSetter({ ...values, [prop]: value });
  };

  return <>{props.children({ values, errors, dirty, handleChange })}</>;
};

export default Form;
