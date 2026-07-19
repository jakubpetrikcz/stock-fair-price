type MenuButtonProps = {
  iconSrc: string;
  alt: string;
  onClick: () => void;
};

export const MenuButton = ({ iconSrc, alt, onClick }: MenuButtonProps) => {
  return (
    <button onClick={onClick} className='cursor-pointer border-0 m-2.5'>
      <img src={iconSrc} alt={alt} className='w-6 h-6' />
    </button>
  );
};
