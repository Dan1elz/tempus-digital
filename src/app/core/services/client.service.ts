import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/variable.environment';
import { UserService } from './user.service';
import {
  DashboardDataDto,
  RegisterClientDto,
} from '../interfaces/clients-dtos.interface';
import { map, Observable } from 'rxjs';
import { GetUsersDto } from '../interfaces/users-dtos.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private http = inject(HttpClient);
  private userService = inject(UserService);
  private urlApi = environment.urlApi;

  private token = this.userService.readonlyUserInfo;

  headers = new HttpHeaders({
    Authorization: `Bearer ${this.token()?.token.token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

  onCreate(response: RegisterClientDto): Observable<any> {
    return this.http.post(`${this.urlApi}/clients`, response, {
      headers: this.headers,
    });
  }

  onUpdate(response: RegisterClientDto): Observable<any> {
    if (response.id === undefined) {
      throw new Error('Client ID is required for update');
    }
    return this.http.put(`${this.urlApi}/clients/${response.id}`, response, {
      headers: this.headers,
    });
  }

  onDelete(id: string): Observable<any> {
    return this.http.delete(`${this.urlApi}/clients/${id}`, {
      headers: this.headers,
    });
  }

  onGetById(id: string): Observable<any> {
    return this.http.get(`${this.urlApi}/clients/${id}`, {
      headers: this.headers,
    });
  }

  onGetAll(response: GetUsersDto, currentPage: number): Observable<any> {
    const params = { ...response } as Record<string, string | number | boolean>;
    return this.http.get(`${this.urlApi}/clients?page=${currentPage}`, {
      headers: this.headers,
      params,
    });
  }

  onGetDashboard(
    period: 'today' | 'week' | 'month'
  ): Observable<DashboardDataDto> {
    const params = new HttpParams().set('period', period);
    return this.http
      .get<any>(`${this.urlApi}/dashboard`, {
        headers: this.headers,
        params,
      })
      .pipe(
        map((data: any) => {
          return {
            high_income_adults: data.data.high_income_adults,
            average_income: data.data.average_income,
            class_distribution: {
              A: data.data.class_distribution.A,
              B: data.data.class_distribution.B,
              C: data.data.class_distribution.C,
            },
          } as DashboardDataDto;
        })
      );
  }
}
