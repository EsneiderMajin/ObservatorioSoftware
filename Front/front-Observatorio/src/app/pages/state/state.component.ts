import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PreguntaResponse } from 'src/app/core/models/responseQuestions.models';
import { AuthService } from 'src/app/core/services/login/auth.service';
import { QuestionService } from 'src/app/core/services/question/question.service';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit{

    formGroup!: FormGroup;
    listaPreguntasEsfuerzo: PreguntaResponse[] = [];
    listaPreguntasCalidad: PreguntaResponse[] = [];
    listaPreguntasGenerales: PreguntaResponse[] = [];
    listaPreguntasDesafio: PreguntaResponse[] = [];
    conclusionesEvaluacion: string[] = [];
    encuestaId = 0;

  constructor(
    private readonly activeRoute: ActivatedRoute,
    private readonly questionService: QuestionService,
    private readonly formBuilder: FormBuilder,
    private authService: AuthService,
  ) { 
    this.formGroup = this.formBuilder.group({});
  }
  async ngOnInit() {
    await this.cargarDatos();
  }

  async cargarDatos() {

    //Preguntas Calidad
    await this.questionService.getPreguntasPorCategoria('preguntasCalidad').then((res) => {
      this.listaPreguntasCalidad = res as PreguntaResponse[];
    });

    console.log(this.listaPreguntasCalidad);

    //Preguntas Esfuerzo
    await this.questionService.getPreguntasPorCategoria('preguntasEsfuerzo').then((res) => {
      this.listaPreguntasEsfuerzo = res as PreguntaResponse[];
    });

    console.log(this.listaPreguntasEsfuerzo);

    //Preguntas Generales

    await this.questionService.getPreguntasPorCategoria('preguntasGenerales').then((res) => {
      this.listaPreguntasGenerales = res as PreguntaResponse[];
    });

    console.log(this.listaPreguntasGenerales);

    //Preguntas de desafio

    await this.questionService.getPreguntasPorCategoria('preguntasDesafios').then((res) => {
      this.listaPreguntasDesafio = res as PreguntaResponse[];
    });

    console.log(this.listaPreguntasDesafio);

  }

  calcularMetricasEsfuerzo() {
    
  }



}
