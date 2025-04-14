// Definición de interfaces para las preguntas y opciones

import { number } from "echarts";

export interface Encuesta {
  fechacreacion: string;
  idUsuario: number;
  questions: Questions[];
}


export interface ListQuestions{
  questions: Questions[];
  category: string; // Nueva propiedad para la categoría
  avaliable?: boolean; // Nueva propiedad para indicar si la pregunta está disponible
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
  
export const PreguntaAutorizacion: Questions = {
    mensaje: '¿Desea Continuar?',
    type: 'single',
    clase: 'autorizacion',
    options: [
      { label: 'Sí', value: 'si' },
      { label: 'No', value: 'no' }
    ]
  };
  
  export const PreguntasGenerales: Questions[] = [
    {
      question: 'Nombre de la organización:',
      type: 'text',
      clase: 'general',
      options: [
        {
          label: 'Escriba el nombre de su organización:',
          value: 'nombre_organizacion',
          inputPlaceholder: 'Nombre de la organización...'
        }
      ]
    },
    {
      question: 'Nombre de la persona que está realizando la encuesta:',
      type: 'text',
      clase: 'general',
      options: [
        {
          label: 'Escriba el nombre de la persona:',
          value: 'nombre_persona',
          inputPlaceholder: 'Nombre de la persona...'
        }
      ]
    },
    {
      question: '¿Cuál es su rol dentro de la organización',
      mensaje: '(Seleccione una sola opción)',
      type: 'single',
      clase: 'general',
      options: [
        { label: 'Gerente de proyectos', value: 'gerente_proyectos' },
        { label: 'Desarrollador', value: 'desarrollador' },
        { label: 'QA', value: 'ingeniero_qa' },
        { label: 'Ténico', value: 'lider_tecnico' },
      ]
    }, 
    {
      question: '¿Cuál el tamaño aproximado de la organización?',
      mensaje: '(Seleccione una sola opción)',
      type: 'single',
      clase: 'general',
      options: [
        { label: 'Microempresa (1 - 10 empleados)', value: 'microempresa' },
        { label: 'Pequeña empresa (11 - 50 empleados)', value: 'pequena_empresa' },
        { label: 'Mediana empresa (51 - 200 empleados)', value: 'mediana_empresa' }
      ]
    },
    {
      question: 'Seleccione el área de especialización de la organización',
      mensaje: '(Seleccione una o varias opciones)',
      type: 'multiple',
      clase: 'general',
      options: [
        { label: 'Desarrollo de software personalizado', value: 'desarrollo_software' },
        { label: 'Venta de productos de software', value: 'venta_productos' },
        { label: 'Servicios de consultoría en software', value: 'consultoria_software' },
      ]
    },
    {
      question: '¿Su organización tiene certificaciones de calidad?',
      mensaje: '(Seleccione una opcion)',
      type: 'single',
      clase: 'general',
      options: [
        { label: 'Sí', value: 'si' },
        { label: 'No', value: 'no' }
      ]
    }
  ];
  
  const PreguntasCalidad: MatrixColumn[] = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 }
  ];
  
  // Listado de preguntas de matriz
  export const matrixQuestions: Questions[] = [
    {
      question: '¿Cuál es el nivel de aplicación de las siguientes prácticas de gestión de calidad en sus proyectos? (1 = No Implementada y 5 = Totalmente implementada)',
      type: 'matrix',
      clase: 'gestion',
      rows: [
        { label: 'Definir una política de calidad', value: 'definicion_calidad_gestion' },
        { label: 'Planificar y establecer objetivos', value: 'planificacion_objetivos' },
        { label: 'Gestionar recursos', value: 'asignar_capacitacion' },
        { label: 'Capacitar al personal', value: 'capacitacion_personal' },
        { label: 'Definir y dar seguimiento a indicadores (KPIs)', value: 'definicion_kpis' },
        { label: 'Fomentar una cultura de mejora continua', value: 'fomento_continua' },
      ],
      columns: PreguntasCalidad
    },
    {
      question: '¿Cuál es el nivel de aplicación de las siguientes prácticas de control de calidad en sus proyectos? (1 = No Implementada y 5 = Totalmente implementada)',
      type: 'matrix',
      clase: 'control',
      rows: [
        { label: 'Revisar y validar requisitos', value: 'revision_requisitos' },
        { label: 'Realizar inspecciones y revisiones formales (código, diseño)', value: 'inspecciones_formales' },
        { label: 'Ejecutar pruebas(unitarias, integración, sistema y aceptación)', value: 'ejecucion_aceptacion' },
        { label: 'Usar métricas y seguimiento de incidencias', value: 'uso_metricas' },
        { label: 'Uso de herramientas automatizadas', value: 'herramientas-automatizacion' },
        { label: 'Gestión de defectos y seguimientos', value: 'gestion_defectos' },
      ],
      columns: PreguntasCalidad
    },
    {
      question: '¿Cuál es el nivel de aplicación de las siguientes prácticas de aseguramiento de calidad en sus proyectos? (1 = No Implementada y 5 = Totalmente implementada)',
      type: 'matrix',
      clase: 'aseguramiento',
      rows: [       
        { label: 'Establecer un sistema de calidad', value: 'documentacion_gestion' },
        { label: 'Realizar auditorías internas', value: 'auditorias_direccion' },
        { label: 'Capacitación', value: 'capacitacion_calidad' },
        { label: 'Implementar acciones preventivas y correctivas', value: 'acciones_preventivas' },
      ],
      columns: PreguntasCalidad
    }
  ];
  
  export const PreguntasEsfuerzo: Questions[] = [
    {
      question: 'En sus proyectos de software, ¿qué porcentaje del esfuerzo total (horas/persona) se dedica a cada una de las siguientes actividades dentro del ciclo de desarrollo? ',
      mensaje: '(Asegúrese de que la sumatoria sea igual al 100%)',
      type: 'percentage',
      clase: 'esfuerzo',
      options: [
        { label: 'Ingeniería', value: 'ingenieria' },
        { label: 'Calidad (Gestión, Control, Aseguramiento)', value: 'calidad' },
        { label: 'Soporte', value: 'soporte' },
        { label: 'Innovación', value: 'innovacion' }
      ]
    },   
  ];
  
  export const PreguntasDesafios: Questions[] = [
    {
      question: '¿Cuáles son los mayores desafíos que enfrenta su organización en la implementación de las prácticas de calidad de software? (Seleccione todas las opciones que considere relevantes para su organización)',
      type: 'multiple',
      clase: 'desafios',
      options: [
        { label: 'Recursos limitados', value: 'recursos_limitados' },
        { label: 'Dificultad para adaptar estándares de calidad internacionales', value: 'dificultad_adaptar_estandares' },
        { label: 'Falta de conocimiento', value: 'falta_conocimiento' },
        { label: 'Falta de personal capacitado o especializado', value: 'falta_personal_capacitado' },
        { label: 'Resistencia al cambio', value: 'resistencia_cambio' },
        { label: 'Dificultad para encontrar metodologías que se ajusten al tamaño y contexto de la empresa', value: 'dificultad_metodologias' }
      ]
    }
  ];
