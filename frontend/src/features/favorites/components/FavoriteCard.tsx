import { HeartSolidFullIcon } from '../../../components/ui/icons/components/HeartSolidFullIcon';
import { useDeleteFavoriteMutation } from '../api/favoritesApi';

type FavoriteCardProps = {
  id: string;
  ticker: string;
  name: string;
  dcf_fair_value: string;
};

export const FavoriteCard = ({
  id,
  ticker,
  name,
  dcf_fair_value,
}: FavoriteCardProps) => {
  const [deleteFavorite] = useDeleteFavoriteMutation();

  return (
    <div className='p-3 rounded-2xl shadow-[0_0px_3px_rgba(0,0,0,0.25)] flex flex-col gap-1 w-full max-w-2xs'>
      <div className='flex justify-between'>
        <div>
          <strong className='text-xl'>{ticker}</strong>{' '}
          <span className='opacity-50 text-sm'>{name}</span>
        </div>
        <button
          className='cursor-pointer'
          onClick={() => deleteFavorite({ favoriteId: id })}
        >
          <HeartSolidFullIcon color='red' width={20} height={20} />
        </button>
      </div>
      <div>
        <span className='opacity-50'>DCF:</span>{' '}
        <strong className='text-purple-400'>${dcf_fair_value || 0}</strong>
      </div>
    </div>
  );
};
