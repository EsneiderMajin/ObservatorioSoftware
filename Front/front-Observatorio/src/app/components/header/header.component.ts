import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


  private subscription: any;
  logueado: boolean = false;

  constructor(
    private router: Router

  ) {
  }

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
    if (url === '/mainview' || url === '/cuestionario' || url === '/resultados/:id') {
      this.logueado = true;
      
      // Cambia el color de fondo del header
      //document.querySelector('header')?.classList.add('header-mainview');
      
    }
  }

  logout() {
    localStorage.removeItem('token'); // Elimina el token del almacenamiento local
    this.router.navigate(['/login']); // Redirige a la página de inicio de sesión
    this.logueado = false; // Cambia el estado de logueado a falso
  }

}
