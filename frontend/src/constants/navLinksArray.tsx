import type { NavLinkType } from '../types/navLink';

export const menu: NavLinkType[] = [
  {
    name: 'Dashboard',
    iconSrc: '/icons/dashboard.svg',
    alt: 'dashboard',
    path: '/',
  },
  {
    name: 'DCF',
    iconSrc: '/icons/circle-dollar-to-slot-solid-full.svg',
    alt: 'dcf',
    path: '/dcf',
  },
  {
    name: 'Favorites',
    iconSrc: '/icons/heart-regular-full.svg',
    alt: 'favorites',
    path: '/favorites',
  },
];
