import { useState } from "react";

type IFormErrors<TValues> = {
  [key in keyof Partial<TValues>]: string | undefined;
};

interface IFormProps<TValue> {
  values: TValue;
  errors: IFormErrors<TValue>;
  handleChange: (prop: keyof TValue) => (value: any) => void;
  dirty: boolean;
}

type IFormValidator<TValue> = (value: TValue) => IFormErrors<TValue>;

const useForm = <TValue>(
  initialValue: TValue,
  validator?: IFormValidator<TValue>
) => {
  const [values, setValues] = useState<TValue>(initialValue);
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<IFormErrors<TValue>>({} as any);

  const handleChange =
    (prop: keyof TValue) => (ev: React.FormEvent<HTMLInputElement>) => {
      const { value } = ev.currentTarget;
      validator && setErrors(validator({ ...values, [prop]: value }));
      setDirty(true);
      setValues((val) => ({ ...val, [prop]: value }));
    };
  const props: IFormProps<TValue> = { values, dirty, errors, handleChange };
  return props;
};

export default useForm;
