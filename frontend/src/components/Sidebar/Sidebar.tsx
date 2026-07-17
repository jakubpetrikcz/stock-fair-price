import { useState } from 'react';
import { NavMenu } from '../NavMenu/NavMenu';
import classNames from 'classnames';
import { LogoContainer } from '../LogoContainer/LogoContainer';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={classNames(
        'w-full max-w-fit min-h-svh px-4 py-8 z-10 shadow-2xl bg-white',
        {
          'min-w-62.5 px-8': isOpen,
        },
      )}
    >
      <LogoContainer isOpen={isOpen} setIsOpen={setIsOpen} />
      <NavMenu isOpen={isOpen} />
    </div>
  );
};
