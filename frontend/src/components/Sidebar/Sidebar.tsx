import { useState } from 'react';
import { NavMenu } from '../NavMenu/NavMenu';
import classNames from 'classnames';
import { LogoContainer } from '../LogoContainer/LogoContainer';
import {
  useGetProfileQuery,
  useLogoutUserMutation,
} from '../../stores/service/authApi';
import { useNavigate } from 'react-router';

export const Sidebar = () => {
  const { data: user } = useGetProfileQuery();
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    await logoutUser().unwrap();

    navigate('/');
  };

  return (
    <div
      className={classNames(
        'w-full max-w-fit min-h-svh px-4 py-8 z-10 shadow-2xl bg-white flex flex-col justify-between',
        {
          'min-w-62.5 px-8': isOpen,
        },
      )}
    >
      <div>
        <LogoContainer isOpen={isOpen} setIsOpen={setIsOpen} />
        <NavMenu isOpen={isOpen} />
      </div>
      <div className='flex flex-col justify-center items-center gap-2'>
        {user && <p>{user.name}</p>}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};
