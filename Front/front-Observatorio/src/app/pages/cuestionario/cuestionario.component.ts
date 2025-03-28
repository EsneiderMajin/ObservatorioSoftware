import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { QuestionService } from 'src/app/core/services/question/question.service';
import { Encuesta, ListQuestions, Question, RespuestaComponent } from 'src/app/core/models/observatorio.model';

@Component({
  selector: 'app-cuestionario',
  templateUrl: './cuestionario.component.html',
  styleUrls: ['./cuestionario.component.css']
})
export class CuestionarioComponent implements OnInit {

  formGroup!: FormGroup;

  // Pregunta de autorización
  preguntaAutorizacion: ListQuestions = {} as ListQuestions; 
  // Preguntas generales
  preguntasGenerales:ListQuestions = {} as ListQuestions; 
  // Preguntas de calidad
  preguntasCalidad: ListQuestions = {} as ListQuestions;
  // Preguntas de esfuerzo
  preguntasEsfuerzo: ListQuestions = {} as ListQuestions;
  // Preguntas de desafio
  preguntasDesafio: ListQuestions = {} as ListQuestions;

  // Lista de respuestas
  listaRespuestas: any[] = [];

  encuesta: Encuesta = {} as Encuesta;

  mostrarResultados = false;

  constructor(
    private readonly questionService: QuestionService,
    private readonly formBuilder: FormBuilder,
  ) { 
    this.formGroup = this.formBuilder.group({});
  }

  async ngOnInit(){
    await this.cargarPreguntas();
  }

  async cargarPreguntas() {
    // Cargar pregunta de autorización
    this.preguntaAutorizacion = this.questionService.getPreguntaAutorizacion();
    console.log('Pregunta de autorización cargada:', this.preguntaAutorizacion);
    // Cargar preguntas generales
    this.preguntasGenerales = await this.questionService.getPreguntasGenerales();
    console.log('Preguntas generales cargadas:', this.preguntasGenerales);
    // Cargar preguntas de calidad
    this.preguntasCalidad = await this.questionService.getPreguntasCalidad();
    console.log('Preguntas de calidad cargadas:', this.preguntasCalidad);
    // Cargar preguntas de esfuerzo
    this.preguntasEsfuerzo = await this.questionService.getPreguntasEsfuerzo();
    console.log('Preguntas de esfuerzo cargadas:', this.preguntasEsfuerzo);
    // Cargar preguntas de desafio
    this.preguntasDesafio = await this.questionService.getPreguntasDesafios();
    console.log('Preguntas de desafio cargadas:', this.preguntasDesafio);
  }

  async answeredQuestion(respuesta: RespuestaComponent) {
    console.log('Respuestas recibidas:', respuesta);
    console.log("respuestas guardadas", this.listaRespuestas);
    switch (respuesta.category) {
      case "preguntaAutorizacion":
        if(respuesta.answers[0].response === "si") {
          this.preguntasGenerales.avaliable = true;
          this.preguntaAutorizacion.avaliable = false;
          this.listaRespuestas.push(respuesta.answers);
        }
        break;
      case "preguntasGenerales":
        this.preguntasGenerales.avaliable = false;
        this.preguntasCalidad.avaliable = true;
        this.listaRespuestas.push(respuesta.answers);
        break;
      case "preguntasCalidad":
        this.preguntasCalidad.avaliable = false;
        this.preguntasEsfuerzo.avaliable = true;
        this.listaRespuestas.push(respuesta.answers);
        break;
      case "preguntasEsfuerzo":
        this.preguntasEsfuerzo.avaliable = false;
        this.preguntasDesafio.avaliable = true;
        this.listaRespuestas.push(respuesta.answers);
        break;
      case "preguntasDesafios":
        this.preguntasDesafio.avaliable = false;
        this.listaRespuestas.push(respuesta.answers);
        this.postGuardarRespuestas();
        this.mostrarResultados = true;
        
        console.log('Respuestas finales:', this.listaRespuestas);
        break;
      default:
        break;
    }

  }

  postGuardarRespuestas() {

    this.encuesta.questions = this.listaRespuestas;
    this.encuesta.fechacreacion = new Date().toISOString();
    this.encuesta.idUsuario = 1; 
    this.questionService.postGuardarRespuestas(this.encuesta);

  }



}
