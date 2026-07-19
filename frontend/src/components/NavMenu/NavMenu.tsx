import { menu } from '../../constants/navLinksArray';
import { NavItem } from '../ui/NavItem/NavItem';

type NavMenuProps = {
  isOpen: boolean;
};

export const NavMenu = ({ isOpen }: NavMenuProps) => {
  return (
    <nav>
      <ul className='flex flex-col gap-2'>
        {menu.map((link) => (
          <li key={link.name}>
            <NavItem key={link.name} {...link} isOpen={isOpen} />
          </li>
        ))}
      </ul>
    </nav>
  );
};
