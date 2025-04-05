import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { QuestionService } from 'src/app/core/services/question/question.service';
import { Encuesta, ListQuestions, Questions, RespuestaComponent } from 'src/app/core/models/observatorio.model';
import { AuthService } from 'src/app/core/services/login/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationData } from 'src/app/core/models/generics.model';
import { Answer, cuestionarioRequest as CuestionarioRequest, MatrixAnswer, MetricaMatrix, QuestionCategory } from 'src/app/core/models/requestQuestions.models';

@Component({
  selector: 'app-cuestionario',
  templateUrl: './cuestionario.component.html',
  styleUrls: ['./cuestionario.component.css']
})
export class CuestionarioComponent implements OnInit {

  formGroup!: FormGroup;
  loading = false;

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

  cuestionario: CuestionarioRequest = {} as CuestionarioRequest;
  
  visibleAlert= false
  mostrarResultados = false;

  notificationData: NotificationData = {
    title: "",
    description: "",
    isError: false
  };

  constructor(
    private readonly questionService: QuestionService,
    private readonly formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) { 
    this.formGroup = this.formBuilder.group({});
  }

  async ngOnInit(){
    await this.cargarPreguntas();
    await this.consultarUsuarioPorToken();
    
  }

  async consultarUsuarioPorToken() {
    this.authService.consultarUsuarioPorToken().subscribe({
      next: (response) => {
        this.cuestionario.idUsuario = response.id;
      },
      error: (error) => {
        console.error('Error al consultar usuario por token:', error);
      }
    });
  }


  async cargarPreguntas() {
    // Cargar pregunta de autorización
    this.preguntaAutorizacion = this.questionService.getPreguntaAutorizacion();
    // Cargar preguntas generales
    this.preguntasGenerales = await this.questionService.getPreguntasGenerales();
    // Cargar preguntas de calidad
    this.preguntasCalidad = await this.questionService.getPreguntasCalidad();
    // Cargar preguntas de esfuerzo
    this.preguntasEsfuerzo = await this.questionService.getPreguntasEsfuerzo();

    // Cargar preguntas de desafio
    this.preguntasDesafio = await this.questionService.getPreguntasDesafios();
  }

  async answeredQuestion(respuesta: RespuestaComponent) {

    switch (respuesta.category) {
      case "preguntaAutorizacion":
        if(respuesta.answers[0].response === "si") {
          this.preguntasGenerales.avaliable = true;
          this.preguntaAutorizacion.avaliable = false;
          this.listaRespuestas.push(respuesta);
        }
        break;
      case "preguntasGenerales":
        this.preguntasGenerales.avaliable = false;
        this.preguntasCalidad.avaliable = true;
        this.listaRespuestas.push(respuesta);
        break;
      case "preguntasCalidad":
        this.preguntasCalidad.avaliable = false;
        this.preguntasEsfuerzo.avaliable = true;
        this.listaRespuestas.push(respuesta);
        break;
      case "preguntasEsfuerzo":
        this.preguntasEsfuerzo.avaliable = false;
        this.preguntasDesafio.avaliable = true;
        this.listaRespuestas.push(respuesta);
        break;
      case "preguntasDesafios":
        this.preguntasDesafio.avaliable = false;
        this.listaRespuestas.push(respuesta);
        this.cuestionario.questions = this.listaRespuestas;
        this.cuestionario.fechacreacion = new Date().toISOString();
        this.loading = true
        this.postGuardarRespuestas();
        this.mostrarResultados = true;
        
        break;
      default:
        break;
    }

  }

  async postGuardarRespuestas() {

    for (let i = 0; i < this.cuestionario.questions.length; i++) {
      for (let j = 0; j < this.cuestionario.questions[i].answers.length; j++) {
        if(this.cuestionario.questions[i].category === "preguntasCalidad") {
          let metrica: MetricaMatrix = {} as MetricaMatrix;

          this.cuestionario.questions[i].answers[j].metrica = this.calcularMetricas(this.cuestionario.questions[i].answers[j], metrica);
  
        }
      }
      
    }

    await this.questionService.postGuardarRespuestas(this.cuestionario).then((respuesta) => {

      this.loading = false
      this.notificationData.title = "Guardado Exitoso"
      this.visibleAlert = true
      this.mostrarResultados = true;
      
    }
    ).catch((error) => {
      this.loading = false
      this.notificationData.title = "Error al guardar"
      this.notificationData.description = error.message
      this.notificationData.isError = true
      this.visibleAlert = true
    }
    );

  }

  calcularMetricas(answer: Answer, metrica: MetricaMatrix): MetricaMatrix {

    let tamanioMatrix = 0;

    // Reiniciar contadores para cada métrica
    metrica.grados = {
        noImplementada: 0,
        implementacionInicial: 0,
        implementacionParcial: 0,
        implementacionAvanzada: 0,
        implementacionOptimizad: 0
    };

    // Solo procesar respuestas de tipo matriz
    if (answer.type === 'matrix') {
        const matrixAnswer = answer as MatrixAnswer;
        tamanioMatrix = Object.keys(matrixAnswer.matrix).length;
        metrica.tamanioMatrix = tamanioMatrix;

        // Contar cada valor en la matriz
        Object.values(matrixAnswer.matrix).forEach((valor: number) => {
            switch (valor) {
                case 1:
                    metrica.grados.noImplementada = metrica.grados.noImplementada +  1;
                    
                    break;
                case 2:
                    metrica.grados.implementacionInicial = metrica.grados.implementacionInicial + 2;
                    break;
                case 3:
                    metrica.grados.implementacionParcial = metrica.grados.implementacionParcial + 3;
                    break;
                case 4:
                    metrica.grados.implementacionAvanzada = metrica.grados.implementacionAvanzada + 4;
                    break;
                case 5:
                    metrica.grados.implementacionOptimizad = metrica.grados.implementacionOptimizad + 5;
                    break;
                default:
                    console.warn(`Valor no reconocido: ${valor} en pregunta: ${answer.question}`);
                    break;
            }
        });
    }


    metrica.totalImplementacion = metrica.grados.noImplementada + metrica.grados.implementacionInicial + metrica.grados.implementacionParcial + metrica.grados.implementacionAvanzada + metrica.grados.implementacionOptimizad;
    metrica.totalImplementacion = metrica.totalImplementacion / tamanioMatrix;
    return metrica;
}

  buttonOption(response: any): void {
    if(response === "aceptar") {
      this.router.navigate(['mainview']); 
      this.visibleAlert = false;
    }
    if (response) {
      this.visibleAlert = false; 
    }

  }

  



}
