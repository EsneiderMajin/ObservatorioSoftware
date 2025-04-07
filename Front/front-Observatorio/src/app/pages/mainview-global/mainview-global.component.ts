import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { EncuestaResponse, listaAnios } from 'src/app/core/models/responseQuestions.models';
import { AuthService } from 'src/app/core/services/login/auth.service';
import { QuestionService } from 'src/app/core/services/question/question.service';

@Component({
  selector: 'app-mainview-global',
  templateUrl: './mainview-global.component.html',
  styleUrls: ['./mainview-global.component.css']
})
export class MainviewGlobalComponent implements OnInit {

  usuario: any;
  listadoAnios: listaAnios[] = [];

  constructor(
        private readonly questionService: QuestionService,
        private readonly formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService,
  ) { }

  async ngOnInit() {
    // await this.usuarioTieneEncuesta();

    await this.cargarDatos();


    // await this.consultarEncuestas();

    
  }

  async cargarDatos() {

    this.listadoAnios.push({
      anio: 2025
    });


    }

  async usuarioTieneEncuesta(){

    return new Promise((resolve) => {
      this.authService.consultarUsuarioPorToken().subscribe({
        next: (response) => {
          this.usuario = response;
          console.log('Usuario:', this.usuario);
          resolve(response);

        },
        error: (error) => {
          console.error('Error al consultar el usuario:', error);
          resolve(error);
        }
      });

    });
    
  }

  async consultarEncuestas() {
    await this.questionService.getEncuestasPorUsuario(this.usuario.id).then((response) => {
      this.listadoAnios = response;

    }).catch((error) => {
      console.error('Error al consultar la encuesta:', error);
    });
  }

  startSurvey() {
    console.log('Starting survey');
  }

  generarResultados(anio: number) {
    this.router.navigate(['/state', anio]);
  }

   // Método para formatear la fecha
   formatDate(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  
}
