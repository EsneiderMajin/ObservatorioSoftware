export interface listaConclusiones {
  area: string;
  puntaje: number;
  recomendacion: string;
}

export interface listaAnios{
  anio: number;
}

export interface EncuestaResponse {
  idEncuesta: number;
  idUsuario: number;
  fechaCreacion: string;
}

export interface PreguntaResponse {
  avaliable: boolean;
  category: string;
  questions: question[];
}

export interface question{
  question: string;
  reponse: string;
  type: 'single' | 'multiple' | 'matrix';
  idPregunta: number;
  metrica: MetricaResponse; // Opcional, para incluir métricas
  matrix: any;
  selectedOptions: any;
}

export interface matrix{
  value: string;
  key: number;
}

export interface selectedOptions {
  value:string;
}

export interface MetricaResponse {
  noImplementada: number;
  implementacionInicial: number;
  implementacionParcial: number;
  implementacionAvanzada: number;
  implementacionOptimizad: number;
  tamanioMatrix: number;
  totalImplementacion: number;
  totalImplementacionIndividual?: number;
}

export interface MetricaEsfuerzo {
  menor5: number;
  entre510: number;
  entre1015: number;
  entre1520: number;
  mayor20: number;
}

export interface MetricaDesafios {
  recursos_limitados: number;
  dificultad_adaptar_estandares: number;
  falta_conocimiento: number;
  falta_personal_capacitado: number;
  resistencia_cambio: number;
  dificultad_metodologias: number;
  
}

