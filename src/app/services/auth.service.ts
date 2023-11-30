import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiEndPoint = 'http://localhost:3900/api/auth';
  constructor(
    private http: HttpClient,
    private tokenServ: TokenStorageService
  ) {}

  login(resource: any) {
    return this.http.post(this.apiEndPoint, resource).pipe(
      map((data: any) => {
        if (data && data.token) {
          // let token = localStorage.setItem('token', JSON.stringify(data.token));
          this.tokenServ.saveToken(data.token);
        }
        return true;
      }),
      catchError(this.handleError)
    );
  }

  isLogIn() {
    const jwtHelper = new JwtHelperService();
    const token = this.tokenServ.getToken();
    if (!token) return false;
    const expiaryDate = jwtHelper.getTokenExpirationDate(token);
    const isExpired = jwtHelper.isTokenExpired(token);
    // console.log('expiary date ', expiaryDate);
    // console.log('expired ', isExpired);

    return !isExpired;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.message
      );

      if (error.status === 404) return throwError(error);
      if (error.status === 401) return throwError(error);
    }
    return throwError(error);
  }
}
