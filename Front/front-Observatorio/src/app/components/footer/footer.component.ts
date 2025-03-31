import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  public proyecto: any = {anio: '2025', universidad: 'Universidad del Cauca, todos los derechos reservados'};
  public autor: string = 'Esneider Majin Palechor - Sebastian Osorio';
}
