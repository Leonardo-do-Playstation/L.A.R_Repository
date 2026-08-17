import { Component } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterOutlet,
  RouterLink,
} from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  showNavbar = true;

  constructor(private router: Router) {
    this.updateNavbar(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.updateNavbar((event as NavigationEnd).urlAfterRedirects);
      });
  }

  private updateNavbar(url: string): void {
    this.showNavbar = !['/', '/cadastro', '/cadastro-ong', '/login'].includes(
      url,
    );
  }
}
