// // Definición de la interfaz para representar el objeto principal
// interface PreguntaResponse {
//     category: string;
//     questions: Question[];
//     avaliable: boolean;
//   }
  
//   // Definición de la interfaz para representar una pregunta
//   interface Question {
//     idPregunta: number;
//     question: string;
//     type: string;
//     matrix?: Matrix; // Opcional, solo si el tipo es 'matrix'
//     metrica?: Metrica; // Opcional, para incluir métricas
//     response?: string; // Opcional, para respuestas de tipo 'single'
//     selectedOptions?: string[]; // Opcional, para respuestas de tipo 'multiple'
//   }
  
//   // Definición de la interfaz para representar la matriz de respuestas
//   interface Matrix {
//     [key: string]: number; // Clave arbitraria con valor numérico
//   }
  
//   // Definición de la interfaz para representar las métricas
//   interface Metrica {
//     noImplementada: number;
//     implementacionInicial: number;
//     implementacionParcial: number;
//     implementacionAvanzada: number;
//     implementacionOptimizad: number;
//     tamanioMatrix: number;
//     totalImplementacion: number;
//   }


export interface listaPracticas {
    nivel: number;
    practica: string;
    interpretacion: string; 
    nivel_nombre: string;
}
 




