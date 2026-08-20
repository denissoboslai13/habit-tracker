import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './landing.html',
  styles: ``,
})
export class Landing {
  private router = inject(Router);

  navClick(route: string) {
    this.router.navigate([`/${route}`])
  }
}
