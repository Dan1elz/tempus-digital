export interface RegisterClientDto {
  id?: string;
  nome: string;
  cpf: string;
  data_nascimento: string;
  renda_familiar?: string;
}

export interface GetClientsDto {
  search?: string;
  per_page?: number;
}

export interface ClientDto {
  id: string;
  nome: string;
  cpf: string;
  data_nascimento: string;
  renda_familiar?: string;
  created_at: string;
  updated_at: string;
}
export interface ListClientDto {
  current_page: number;
  data: ClientDto[];
  next_page_url: string;
  total: number;
}

export interface DashboardDataDto {
  high_income_adults: number;
  average_income: string;
  class_distribution: {
    A: number;
    B: number;
    C: number;
  };
}
