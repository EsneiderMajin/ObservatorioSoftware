import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  private subscription: any;
  logueado: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.subscription = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.onUrlChange(event.url);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onUrlChange(url: string) {
    if (
      url === '/mainview' ||
      url === '/cuestionario' ||
      url.startsWith('/resultados/') && /^\d+$/.test(url.split('/').pop()!)
    ) {
      this.logueado = true;
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    this.logueado = false;
  }
}
