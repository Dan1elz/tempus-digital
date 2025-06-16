export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterUserDto {
  id?: string;
  name: string;
  email: string;
}

export interface UpdatePasswordDto {
  id: string;
  password: string;
}
export interface UserInfoDto {
  token: {
    user: {
      id: string;
      name: string;
      email: string;
    };
    token: string;
  };
}
export interface UserDto {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}
export interface ListUserDto {
  current_page: number;
  data: UserDto[];
  next_page_url: string;
  total: number;
}

export interface GetUsersDto {
  search?: string;
  per_page?: number;
}
