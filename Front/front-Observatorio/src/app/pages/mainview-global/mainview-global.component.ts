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
  loading = false;

  constructor(
        private readonly questionService: QuestionService,
        private readonly formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService,
  ) { }

  async ngOnInit() {
    this.loading = true;
    await this.cargarDatos();
    this.loading = false;
        
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
