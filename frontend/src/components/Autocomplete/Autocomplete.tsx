import {
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { AutocompleteEndAdornment } from './AutocompleteEndAdornment';

type AutocompleteProps = {
  name: string;
  renderOptions: (
    setValue: Dispatch<SetStateAction<string>>,
    value: string,
    setFocused: Dispatch<SetStateAction<boolean>>,
  ) => ReactNode;
  onClear: () => void;
  selectedValue: string;
};

export const Autocomplete = ({
  name,
  renderOptions,
  onClear,
  selectedValue,
}: AutocompleteProps) => {
  const [value, setValue] = useState(selectedValue || '');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className='max-w-50 w-full relative'>
      <div className='relative'>
        <input
          ref={inputRef}
          type='text'
          name={name}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setFocused(true);
          }}
          className='w-full border-b px-0.5 py-1 focus:outline-0'
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete='off'
        />
        <AutocompleteEndAdornment
          value={value}
          setValue={setValue}
          focused={focused}
          setFocused={setFocused}
          onClear={onClear}
          inputRef={inputRef}
        />
      </div>
      {focused && (
        <div className='rounded-b-2xl shadow py-1 absolute top-full bg-white w-full overflow-y-auto max-h-96'>
          {renderOptions(setValue, value, setFocused)}
        </div>
      )}
    </div>
  );
};
