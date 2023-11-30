import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/app/models/Movie';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { MovieService } from 'src/app/services/movie.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css'],
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  loading = false;
  isLogIn = false;
  user: any;
  currentTutorial: Movie = {
    _id: '',
    title: '',
    genre: undefined,
    numberInStock: 0,
    dailyRentalRate: 0,
  };

  page = 1;
  count = 0;
  title = '';
  pageSize = 3;
  pageSizes = [3, 6, 9];

  constructor(
    private mvService: MovieService,
    private alrtServ: AlertService,
    private tokenServ: TokenStorageService,
    private authServ: AuthService
  ) {}

  ngOnInit(): void {
    // this.isLogIn = !!this.tokenServ.getToken() === true ? true : false;
    this.isLogIn = this.authServ.isLogIn() ? true : false;
    this.user = this.tokenServ.getUser();
    // console.log(this.user);

    this.retrieveMovies();
  }

  getRequestParams(page: number, pageSize: number, title?: string) {
    let params: any = {};
    if (title) {
      params[`title`] = title;
    }

    if (page) {
      params[`page`] = page;
    }

    if (pageSize) {
      params[`size`] = pageSize;
    }

    return params;
  }

  retrieveMovies() {
    this.loading = true;
    const params = this.getRequestParams(this.page, this.pageSize, this.title);
    this.mvService
      .getAll(params)
      .subscribe((response: any) => {
        // this.movies = data;
        const { tutorials, totalItems } = response;
        if (tutorials.length === 0) {
          this.alrtServ.warn('Movie Not Found!');
          this.title = '';
          this.retrieveMovies();
        }

        this.movies = tutorials;
        this.count = totalItems;
      })
      .add(() => {
        this.loading = false;
      });
  }

  handlePageChange(event: number) {
    this.page = event;
    this.retrieveMovies();
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveMovies();
  }

  searchTitle(event?: any): void {
    this.page = 1;
    this.retrieveMovies();
  }

  deleteMovie(movie: Movie) {
    // let index = this.movies.indexOf(movie);
    // this.movies.splice(index, 1);
    this.mvService.delete(movie._id).subscribe(
      () => {
        this.movies = this.movies.filter((m) => m._id !== movie._id);
        this.alrtServ.success('Movie Deleted!', { keepAfterRouteChange: true });
      },
      (error) => {
        // this.movies.splice(index, 0, movie);
      }
    );
  }
}
