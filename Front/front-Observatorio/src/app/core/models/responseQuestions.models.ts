export interface PreguntaResponse {
  avaliable: boolean;
  category: string;
  questions: questions[];
}

export interface questions{
  question: string;
  reponse: string;
  type: 'single' | 'multiple' | 'matrix';
  idPregunta: number;
  matrix: any;
  selectedOptions: selectedOptions[];
}

export interface matrix{
  value: string;
  key: number;
}

export interface selectedOptions {
  value:string;
}

