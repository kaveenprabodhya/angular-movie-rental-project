import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Genre } from 'src/app/models/Genre';
import { Movie } from 'src/app/models/Movie';
import { AlertService } from 'src/app/services/alert.service';
import { GenreService } from 'src/app/services/genre.service';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movies-form',
  templateUrl: './movies-form.component.html',
  styleUrls: ['./movies-form.component.css'],
})
export class MoviesFormComponent implements OnInit {
  form!: FormGroup;
  isAddMode!: boolean;
  id!: string;
  loading = false;
  submitted = false;
  genres: Genre[] = [];
  movies: Movie[] = [];

  constructor(
    private route: ActivatedRoute,
    private genreService: GenreService,
    private mvService: MovieService,
    private router: Router,
    private fb: FormBuilder,
    private alrtServ: AlertService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      genre: [null, [Validators.required]],
      numberInStock: ['', [Validators.required]],
      dailyRentalRate: ['', [Validators.required]],
    });

    this.id = this.route.snapshot.params['id'];
    if (this.id === 'new') this.isAddMode = true;
    else this.isAddMode = false;

    this.genreService.getAll().subscribe((data: any) => {
      this.genres = data;
      // console.log(this.genres);
    });

    if (!this.isAddMode) {
      this.mvService
        .getById(this.id)
        .pipe(first())
        .subscribe((data: any) => {
          // console.log(data);
          // console.log(data.genre._id);

          let findGenre = this.genres.find((x) => x._id === data.genre._id);
          // console.log(findGenre);

          let movie = {
            title: data.title,
            genre: findGenre,
            numberInStock: data.numberInStock,
            dailyRentalRate: data.dailyRentalRate,
          };
          this.form.setValue(movie);
        });
    }
  }

  get mv() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;

    let { genre, ...rest } = this.form.value;
    rest.genreId = genre._id;

    if (this.isAddMode == false) {
      this.mvService
        .update(this.id, rest)
        .subscribe(() => {
          this.alrtServ.success('User updated', { keepAfterRouteChange: true });
          this.router.navigate(['../'], { relativeTo: this.route });
        })
        .add(() => {
          this.loading = false;
          this.submitted = false;
        });
      return;
    }
    this.mvService
      .create(rest)
      .subscribe(() => {
        this.alrtServ.success('Movie Created!', { keepAfterRouteChange: true });
        this.router.navigate(['../'], { relativeTo: this.route });
      })
      .add(() => {
        this.loading = false;
        this.submitted = false;
      });
  }
}
