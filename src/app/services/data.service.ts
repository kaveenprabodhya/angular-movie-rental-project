import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    @Inject(String) private apiEndPoint: string,
    private http: HttpClient,
    private tokenServ: TokenStorageService
  ) {}

  getAll(params?: any) {
    return this.http
      .get(this.apiEndPoint, {
        params: params,
        observe: 'body',
        responseType: 'json',
      })
      .pipe(delay(1000), catchError(this.handleError));
  }

  getById(id: string) {
    const url = `${this.apiEndPoint}/${id}`;
    return this.http.get(url).pipe(delay(1000), catchError(this.handleError));
  }

  create(resource: any) {
    return this.http
      .post(this.apiEndPoint, resource)
      .pipe(delay(3000), catchError(this.handleError));
  }

  update(id: string, resource: any) {
    const url = `${this.apiEndPoint}/${id}`;
    return this.http.put(url, resource).pipe(
      map((updatedMovie: any) => {
        return updatedMovie as any;
      }),
      delay(3000),
      catchError(this.handleError)
    );
  }

  delete(id: string) {
    const url = `${this.apiEndPoint}/${id}`;
    return this.http.delete(url).pipe(
      map((data) => {
        console.log(data);
        return data;
      }),
      delay(3000),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    // console.log(error);
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
