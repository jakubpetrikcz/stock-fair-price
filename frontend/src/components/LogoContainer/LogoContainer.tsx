import { Link } from 'react-router';
import type { Dispatch, SetStateAction } from 'react';
import { MenuButton } from '../MenuButton/MenuButton';

type LogoContainerProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const LogoContainer = ({ isOpen, setIsOpen }: LogoContainerProps) => {
  const toggleSidebar = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <div className='flex items-center justify-between mb-5'>
      {isOpen && <Link to='/'>LOGO</Link>}
      <MenuButton
        iconSrc={
          isOpen
            ? '/icons/sidebar-collapse-fill.svg'
            : '/icons/sidebar-expand-fill.svg'
        }
        alt={isOpen ? 'collapse icon' : 'expand icon'}
        onClick={toggleSidebar}
      />
    </div>
  );
};
