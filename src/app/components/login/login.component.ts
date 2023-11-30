import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  logForm!: FormGroup;
  submitted = false;
  // isLogin = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authServ: AuthService,
    private tokenServ: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.logForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get lg() {
    return this.logForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.logForm.invalid) return;

    this.authServ.login(this.logForm.value).subscribe((response) => {
      if (response) {
        // this.router.navigate(['../'], { relativeTo: this.route });
        let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        // console.log(returnUrl);

        this.router.navigate([returnUrl || '/']);
      }
    });
    this.submitted = false;
  }
}
