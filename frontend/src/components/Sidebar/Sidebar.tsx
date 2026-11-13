import { useState } from 'react';
import { NavMenu } from '../NavMenu/NavMenu';
import classNames from 'classnames';
import { LogoContainer } from '../LogoContainer/LogoContainer';
import {
  authApi,
  useGetProfileQuery,
  useLogoutUserMutation,
} from '../../stores/service/authApi';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../stores/store';
import { stocksApi } from '../../api/stocksApi';
import { favoritesApi } from '../../features/favorites/api/favoritesApi';

export const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: user } = useGetProfileQuery();
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    await logoutUser().unwrap();

    dispatch(stocksApi.util.resetApiState());
    dispatch(favoritesApi.util.resetApiState());
    dispatch(authApi.util.resetApiState());

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
