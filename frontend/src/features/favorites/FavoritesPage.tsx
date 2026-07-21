import { useGetFavoritesQuery } from './api/favoritesApi';
import { Favorites } from './components/Favorites';

export const FavoritesPage = () => {
  const { data: favoriteStocks, isLoading, isError } = useGetFavoritesQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!favoriteStocks || isError) {
    return <div>Error...</div>;
  }

  return (
    <div className='p-9'>
      <h1 className='text-3xl mb-8'>Favorites</h1>
      <Favorites favoriteStocks={favoriteStocks} />
    </div>
  );
};
