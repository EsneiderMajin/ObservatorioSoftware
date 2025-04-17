export interface cuestionarioRequest {
    idUsuario: string;
    questions: QuestionCategory[];
    fechacreacion: string;
    anio: number;
  }
  
  export interface QuestionCategory {
    category: string;
    answers: Answer[];
  }
  
  export type Answer = | SingleAnswer | MultipleAnswer | MatrixAnswer | PercentageAnswer;
  
  interface BaseAnswer {
    question: string;
    type: string;
    metrica?: MetricaMatrix;
  }


  export interface MetricaMatrix {
    totalImplementacion: number;
    grados: gradoImplementacion;
    tamanioMatrix: number;
  }
  
  export interface gradoImplementacion {
  
    noImplementada: number;
    implementacionInicial: number;
    implementacionParcial: number;
    implementacionAvanzada: number;
    implementacionOptimizad: number;
  
  }
  
  export interface SingleAnswer extends BaseAnswer {
    type: 'single';
    response: string;
  }
  
  export interface MultipleAnswer extends BaseAnswer {
    type: 'multiple';
    selectedOptions: string[];
  }
  
  export interface MatrixAnswer extends BaseAnswer {
    type: 'matrix';
    matrix: Record<string, number>;
  }
  
  export interface PercentageAnswer extends BaseAnswer {
    type: 'percentage';
    percentage: Record<string, number>;
  }