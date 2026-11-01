import { HeartRegularFullIcon } from '../../components/ui/icons/components/HeartRegularFullIcon';
import { HeartSolidFullIcon } from '../../components/ui/icons/components/HeartSolidFullIcon';
import {
  useAddFavoriteMutation,
  useDeleteFavoriteMutation,
  useGetFavoriteQuery,
} from '../favorites/api/favoritesApi';

type DcfTitleProps = {
  stockId: string;
};

export const DcfTitle = ({ stockId }: DcfTitleProps) => {
  const { data: favoriteStock } = useGetFavoriteQuery(stockId, {
    refetchOnMountOrArgChange: true,
  });
  const [addFavorite] = useAddFavoriteMutation();
  const [deleteFavorite] = useDeleteFavoriteMutation();

  return (
    <div className='flex items-center gap-2'>
      <h1 className='text-4xl font-bold mb-2'>
        Discounted Cash Flow Analysis Model (DCF)
      </h1>
      <button
        className='cursor-pointer'
        onClick={() =>
          favoriteStock
            ? deleteFavorite({ favoriteId: favoriteStock.id })
            : addFavorite({ companyId: stockId })
        }
      >
        {favoriteStock ? (
          <HeartSolidFullIcon color='red' width={25} height={25} />
        ) : (
          <HeartRegularFullIcon color='red' width={25} height={25} />
        )}
      </button>
    </div>
  );
};
