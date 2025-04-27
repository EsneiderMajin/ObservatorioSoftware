// Definición de interfaces para las preguntas y opciones

import { number } from "echarts";

export interface Encuesta {
  fechacreacion: string;
  idUsuario: number;
  questions: Questions[];
}


export interface ListQuestions{
  questions: Questions[];
  category: string;
  avaliable?: boolean; 
}

export interface RespuestaComponent {
  answers: any;
  category: string;
}

export interface Questions {
  question?: string;
  questionText?: string;
  mensaje?: string; 
  type: 'single' | 'multiple' | 'matrix' | 'percentage' | 'text'; 
  clase?: string;
  options?: Option[];
  rows?: MatrixRow[];
  columns?: MatrixColumn[];
  
}

export interface Option {
    label: string;
    value: string;
    hasInput?: boolean; 
    inputPlaceholder?: string;
  }
  

  export interface MatrixColumn {
    label: string;
    value: number;
  }
  
  export interface MatrixRow {
    label: string;
    value: string;
  }
  
