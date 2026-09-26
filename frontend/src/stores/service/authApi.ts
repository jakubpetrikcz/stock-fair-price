import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { AUTH } from '../../constants';
import type {
  LoginUserRequest,
  LoginUserResponse,
  LogoutResponse,
  RegisterUserRequest,
  RegisterUserResponse,
  User,
} from '../../types/auth';
import { API_URL } from '../../api';

export const authApi = createApi({
  reducerPath: 'authApi',
  tagTypes: [AUTH],
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getProfile: builder.query<User, void>({
      query: () => 'users/me',
      providesTags: [AUTH],
    }),
    loginUser: builder.mutation<LoginUserResponse, LoginUserRequest>({
      query: ({ email, password }) => ({
        url: 'users/login',
        method: 'POST',
        body: { email, password },
      }),
      invalidatesTags: [AUTH],
    }),
    registerUser: builder.mutation<RegisterUserResponse, RegisterUserRequest>({
      query: ({ name, email, password }) => ({
        url: 'users/register',
        method: 'POST',
        body: { name, email, password },
      }),
    }),
    logoutUser: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: 'users/logout',
        method: 'POST',
      }),
      invalidatesTags: [AUTH],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useLoginUserMutation,
  useRegisterUserMutation,
  useLogoutUserMutation,
} = authApi;
