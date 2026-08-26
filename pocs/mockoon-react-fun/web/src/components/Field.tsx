import type { ChangeEvent } from 'react';

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  type?: 'text' | 'number' | 'url';
};

export const TextField = ({ label, value, onChange, placeholder, multiline, type = 'text' }: TextFieldProps) => {
  const handle = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value);
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {multiline ? (
        <textarea className="control" value={value} onChange={handle} placeholder={placeholder} />
      ) : (
        <input className="control" type={type} value={value} onChange={handle} placeholder={placeholder} />
      )}
    </label>
  );
};
