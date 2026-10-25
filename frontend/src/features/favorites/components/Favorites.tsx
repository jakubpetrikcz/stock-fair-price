import type { FavoriteStock } from '../types';
import { FavoriteCard } from './FavoriteCard';

type FavoritesProps = {
  favoriteStocks: FavoriteStock[];
};

export const Favorites = ({ favoriteStocks }: FavoritesProps) => {
  return (
    <div className='flex items-center gap-2 flex-wrap'>
      {favoriteStocks.map((stock) => (
        <FavoriteCard key={stock.id} {...stock} />
      ))}
    </div>
  );
};
