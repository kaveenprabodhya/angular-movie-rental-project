import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { RegisterService } from 'src/app/services/register.service';
import { PasswordValidators } from './password-validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  regForm!: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private regServ: RegisterService,
    private alrtServ: AlertService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.regForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, PasswordValidators.patternValidator],
        ],
        cpassword: ['', [Validators.required]],
      },
      { validators: PasswordValidators.checkPasswords }
    );
  }

  get rg() {
    return this.regForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    if (this.regForm.invalid) return;
    const { cpassword, ...rest } = this.regForm.value;
    let user: any = rest;
    console.log(user);

    this.regServ.create(user).subscribe(
      (data) => {
        this.alrtServ.success('User Created!', {
          keepAfterRouteChange: true,
        });
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      (error) => {
        this.alrtServ.warn('Something went Wrong!');
        console.log(error);
      }
    );
    this.onReset();
  }

  onReset(): void {
    this.submitted = false;
    this.loading = false;
    this.regForm.reset();
  }
}
