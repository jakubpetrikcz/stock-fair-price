import classNames from 'classnames';
import { type Dispatch, type RefObject, type SetStateAction } from 'react';

type AutocompleteEndAdornmentProps = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  onClear: () => void;
  focused: boolean;
  setFocused: Dispatch<SetStateAction<boolean>>;
  inputRef: RefObject<HTMLInputElement | null>;
};

export const AutocompleteEndAdornment = ({
  value,
  setValue,
  onClear,
  focused,
  setFocused,
  inputRef,
}: AutocompleteEndAdornmentProps) => {
  return (
    <div className='bg-white absolute px-1 right-0 top-1/2 -translate-y-1/2 flex gap-1 items-center'>
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          setFocused(true);
          setValue('');
          onClear();
          inputRef?.current?.focus();
        }}
        className={classNames(
          'cursor-pointer hover:bg-gray-50 rounded-[50%] p-1',
          { block: value, hidden: !value },
        )}
      >
        <img
          src='/icons/xmark-solid-full.svg'
          alt='clear'
          className='w-5 h-5 opacity-50'
        />
      </button>
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          setFocused((prevState) => !prevState);
          inputRef?.current?.focus();
        }}
        className='cursor-pointer hover:bg-gray-50 rounded-[50%] p-1'
      >
        <img
          src={
            focused
              ? '/icons/caret-up-solid-full.svg'
              : '/icons/caret-down-solid-full.svg'
          }
          alt='open'
          className='w-5 h-5 opacity-50'
        />
      </button>
    </div>
  );
};
