import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../../api';
import type { FavoriteStock } from '../types';
import { FAVORITE } from '../constants';

export const favoritesApi = createApi({
  reducerPath: 'favoritesApi',
  tagTypes: [FAVORITE],
  baseQuery: fetchBaseQuery({ baseUrl: API_URL, credentials: 'include' }),
  endpoints: (builder) => ({
    getFavorites: builder.query<FavoriteStock[], void>({
      query: () => '/favorites',
      providesTags: [FAVORITE],
    }),
    getFavorite: builder.query<FavoriteStock, string>({
      query: (favoriteId) => `/favorites/${favoriteId}`,
      providesTags: [FAVORITE],
    }),
    addFavorite: builder.mutation<
      unknown,
      { companyId: string; userId: string }
    >({
      query: ({ companyId, userId }) => ({
        url: '/favorites',
        method: 'POST',
        body: { companyId, userId },
      }),
      invalidatesTags: [FAVORITE],
    }),
    deleteFavorite: builder.mutation<void, { favoriteId: string }>({
      query: ({ favoriteId }) => ({
        url: `/favorites/${favoriteId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [FAVORITE],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useGetFavoriteQuery,
  useAddFavoriteMutation,
  useDeleteFavoriteMutation,
} = favoritesApi;
