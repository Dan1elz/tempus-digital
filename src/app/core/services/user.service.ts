import { effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/variable.environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  GetUsersDto,
  LoginDto,
  RegisterUserDto,
  UpdatePasswordDto,
  UserInfoDto,
} from '../interfaces/users-dtos.interface';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private urlApi = environment.urlApi;
  private userInfo = signal<UserInfoDto | undefined>(undefined);

  readonlyUserInfo = this.userInfo.asReadonly();

  constructor() {
    effect(() => this.onSyncUserInfo());
  }

  private getHeaders(): HttpHeaders {
    const token = this.userInfo()?.token.token;
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
  }
  onCreate(response: RegisterUserDto): Observable<any> {
    return this.http.post(`${this.urlApi}/users`, response, {
      headers: this.getHeaders(),
    });
  }

  onUpdate(response: RegisterUserDto): Observable<any> {
    if (response.id === undefined) {
      throw new Error('User ID is required for update');
    }
    return this.http.put(`${this.urlApi}/users/${response.id}`, response, {
      headers: this.getHeaders(),
    });
  }

  onUpdatePassword(response: UpdatePasswordDto): Observable<any> {
    return this.http.patch(
      `${this.urlApi}/users/${this.userInfo()?.token.user.id}/password`,
      response,
      { headers: this.getHeaders() }
    );
  }

  onDelete(id: string): Observable<any> {
    return this.http.delete(`${this.urlApi}/users/${id}`, {
      headers: this.getHeaders(),
    });
  }

  onGetById(id: string): Observable<any> {
    return this.http.get(`${this.urlApi}/users/${id}`, {
      headers: this.getHeaders(),
    });
  }

  onGetAll(response: GetUsersDto, currentPage: number): Observable<any> {
    const params = { ...response } as Record<string, string | number | boolean>;
    return this.http.get(`${this.urlApi}/users?page=${currentPage}`, {
      headers: this.getHeaders(),
      params,
    });
  }

  onLogin(response: LoginDto): Observable<any> {
    return this.http
      .post(`${this.urlApi}/users/login`, response, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((data: any) => {
          if (!data) return;
          const userInfo: UserInfoDto = {
            token: {
              user: {
                id: data.token.user.id,
                name: data.token.user.name,
                email: data.token.user.email,
              },
              token: data.token.token,
            },
          };
          this.onSetUserInfo(userInfo);
          this.router.navigate(['/auth']);
        })
      );
  }
  onLogout(): Observable<any> {
    return this.http
      .post(`${this.urlApi}/users/logout`, {}, { headers: this.getHeaders() })
      .pipe(
        tap(() => {
          localStorage.removeItem('UserData');
          this.router.navigate(['/login']);
        })
      );
  }

  onSetUserInfo(userInfo: UserInfoDto) {
    this.userInfo.set(userInfo);
  }

  onSyncUserInfo() {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('UserData', JSON.stringify(this.userInfo()));
    }
  }

  isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  isUserLogged(): boolean {
    return !!this.userInfo();
  }

  onTrySyncUserInfo() {
    if (this.isLocalStorageAvailable()) {
      const userInfo = localStorage.getItem('UserData');
      if (!userInfo) return;
      this.onSetUserInfo(JSON.parse(userInfo));
    }
  }
}
