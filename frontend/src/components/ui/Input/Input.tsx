import { type HTMLProps } from 'react';

type InputProps = HTMLProps<HTMLInputElement>;

export const Input = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  ref,
}: InputProps) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className='border p-2 w-full mb-3'
      value={value}
      onChange={onChange}
      ref={ref}
    />
  );
};
