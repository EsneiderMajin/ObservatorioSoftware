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

    this.questionService.getAllSurveyYears().then((response) => {
      // Eliminar duplicados usando un Set
      const uniqueYears = Array.from(new Set(response));
      // Asignar los años únicos a listadoAnios
      this.listadoAnios = uniqueYears.map((anio: number) => ({ anio }));
    }).catch((error) => {
      console.error('Error al cargar los años:', error);
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


  
}
