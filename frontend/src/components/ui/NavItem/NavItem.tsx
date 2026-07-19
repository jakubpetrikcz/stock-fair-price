import { Link, useLocation } from 'react-router';
import type { NavLinkType } from '../../../types/navLink';
import classNames from 'classnames';

type NavItemProps = NavLinkType & {
  isOpen: boolean;
};

export const NavItem = ({ name, iconSrc, alt, path, isOpen }: NavItemProps) => {
  const { pathname } = useLocation();
  const isActive = pathname === path;

  return (
    <Link
      to={path}
      className={classNames(
        'flex items-center gap-2.5 p-2.5 text-gray-500 hover:bg-purple-100 hover:rounded-2xl',
        {
          'text-purple-400 bg-purple-100 rounded-2xl': isActive,
        },
      )}
    >
      <img src={iconSrc} alt={alt} className='w-6 h-6' />
      {isOpen && <p>{name}</p>}
    </Link>
  );
};
