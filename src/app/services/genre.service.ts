import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class GenreService extends DataService {
  constructor(http: HttpClient, tokenService: TokenStorageService) {
    super('http://localhost:3900/api/genres', http, tokenService);
  }
}
