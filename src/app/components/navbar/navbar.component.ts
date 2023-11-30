import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLogIn = false;
  cursor = 'pointer';

  constructor(
    public authService: AuthService,
    private router: Router,
    private tokenServ: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.isLogIn = !!this.tokenServ.getToken() === true ? true : false;
  }

  logOut() {
    this.tokenServ.signOut();
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/']);
  }
}
