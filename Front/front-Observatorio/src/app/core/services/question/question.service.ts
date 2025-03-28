import { Injectable } from '@angular/core';
import { ListQuestions, MatrixColumn, Question } from '../../models/observatorio.model';
import { PreguntaAutorizacion, PreguntasGenerales, matrixQuestions, PreguntasEsfuerzo, PreguntasDesafios } from '../../models/observatorio.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  

  constructor() { }

  postGuardarRespuestas(encuestaObjet: any): void {
    console.log('Respuestas guardadas:', encuestaObjet);
    //llamar a la bd para guardar los datos

  }


  // Método para obtener la pregunta de autorización
  getPreguntaAutorizacion(): ListQuestions {
    const preguntaAutorizacionData: ListQuestions = {
      questions: [PreguntaAutorizacion],
      category: 'preguntaAutorizacion',
      avaliable: true
    };
    return preguntaAutorizacionData;
  }


  // Método para obtener todas las preguntas
  getPreguntasGenerales(): ListQuestions {
      const preguntasGeneralesData: ListQuestions = {
        questions: PreguntasGenerales,
        category: 'preguntasGenerales',
        avaliable: false
      };
      return preguntasGeneralesData;
    }

  // Método para obtener las preguntas de matriz
  getPreguntasCalidad(): ListQuestions {
    const matrixQuestionsData: ListQuestions = {
      questions: matrixQuestions,
      category: 'preguntasCalidad',
      avaliable: false
    };
    return matrixQuestionsData;
  }

  // Método para obtener las preguntas de esfuerzo
  getPreguntasEsfuerzo(): ListQuestions {
    const PreguntasEsfuerzoData: ListQuestions = {
      questions: PreguntasEsfuerzo,
      category: 'preguntasEsfuerzo',
      avaliable: false
    };
    return PreguntasEsfuerzoData;
  }

  // Método para obtener las preguntas de desafíos
  getPreguntasDesafios(): ListQuestions {
    const PreguntasDesafiosData: ListQuestions = {
      questions: PreguntasDesafios,
      category: 'preguntasDesafios',
      avaliable: false
    };
    return PreguntasDesafiosData;
  }




}