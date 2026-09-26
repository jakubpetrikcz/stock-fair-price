export type User = {
  id: string;
  name: string;
  email: string;
};

export type LoginUserRequest = {
  email: string;
  password: string;
};

export type LoginUserResponse = {
  user: User;
};

export type RegisterUserRequest = {
  name: string;
  email: string;
  password: string;
};

export type RegisterUserResponse = {
  user: User;
};

export type LogoutResponse = {
  message: string;
};
