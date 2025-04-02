// Definición de interfaces para las preguntas y opciones

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
  type: 'single' | 'multiple' | 'matrix';
  options?: Option[];
  rows?: MatrixRow[];
  columns?: MatrixColumn[];
  
}

export interface Option {
    label: string;
    value: string;
    hasInput?: boolean; 
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
    questionText: 'Los datos recopilados en este estudio serán utilizados exclusivamente con fines educativos y de investigación. No se compartirán con terceros ni se expondrán de manera que permitan identificar a los participantes. Toda la información será tratada de forma anónima y confidencial, garantizando el respeto a la privacidad y seguridad de los datos.',
    mensaje: '¿Desea Continuar?',
    type: 'single',
    options: [
      { label: 'Sí', value: 'si' },
      { label: 'No', value: 'no' }
    ]
  };
  
  export const PreguntasGenerales: Questions[] = [
    {
      question: '¿Cuál es el tamaño aproximado de su organización?',
      mensaje: '(Seleccione una sola opción)',
      type: 'single',
      options: [
        { label: 'Microempresa (1 - 10 empleados)', value: 'microempresa' },
        { label: 'Pequeña empresa (11 - 50 empleados)', value: 'pequena_empresa' },
        { label: 'Mediana empresa (51 - 200 empleados)', value: 'mediana_empresa' }
      ]
    },
    {
      question: '¿Cuál es el principal enfoque de su organización?',
      mensaje: '(Seleccione una o varias opciones)',
      type: 'multiple',
      options: [
        { label: 'Desarrollo de software personalizado', value: 'desarrollo_software' },
        { label: 'Venta de productos de software', value: 'venta_productos' },
        { label: 'Servicios de consultoría en software', value: 'consultoria_software' },
      ]
    },
    {
      question: '¿Su empresa sigue algún estándar o modelo de calidad?',
      mensaje: '(Seleccione una o varias opciones)',
      type: 'multiple',
      options: [
        { label: 'CMMI', value: 'cmmi' },
        { label: 'ISO 9001', value: 'iso_9001' },
        { label: 'ISO 25010', value: 'iso_25010' },
        { label: '15504', value: 'iso_15504' },
        { label: 'ISO/IEC 29110', value: 'iso_iec_29110' },
        { label: 'No sigue un estándar formal', value: 'sin_estandar' },
      ]
    },
    {
      question: '¿Cuál es su rol dentro de la empresa?',
      mensaje: '(Seleccione una sola opción)',
      type: 'single',
      options: [
        { label: 'Ingeniero de QA', value: 'ingeniero_qa' },
        { label: 'Desarrollador', value: 'desarrollador' },
        { label: 'Líder técnico', value: 'lider_tecnico' },
        { label: 'Gerente de proyectos', value: 'gerente_proyectos' },
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
      question: '¿Con qué frecuencia se aplican las siguientes prácticas de gestión de calidad en sus proyectos?',
      type: 'matrix',
      rows: [
        { label: 'Definición y Comunicación de la Política de Calidad', value: 'definicion_calidad' },
        { label: 'Planificación de la Calidad y Establecimiento de Objetivos Medibles', value: 'planificacion_medibles' },
        { label: 'Asignar Gestión de Recursos y Capacitación', value: 'asignar_capacitacion' },
        { label: 'Documentación y Estandarización de Procesos', value: 'documentacion_procesos' },
        { label: 'Auditorías Internas y Revisiones por la Dirección', value: 'auditorias_direccion' },
        { label: 'Fomento de una Cultura de Mejora Continua', value: 'fomento_continua' },
      ],
      columns: PreguntasCalidad
    },
    {
      question: '¿Con qué frecuencia se aplican las siguientes prácticas de control de calidad en sus proyectos?',
      type: 'matrix',
      rows: [
        { label: 'Revisión y Validación de Requisitos', value: 'revision_requisitos' },
        { label: 'Inspecciones y Revisiones Formales (código, diseño)', value: 'inspecciones_formales' },
        { label: 'Ejecución de Pruebas Sistemáticas (unitarias, integración, sistema y aceptación)', value: 'ejecucion_aceptacion' },
        { label: 'Uso de Métricas y Seguimiento de Incidencias (densidad de defectos, cobertura de pruebas)', value: 'uso_pruebas' },
        { label: 'Automatización de Pruebas (para ejecución repetitiva y continua)', value: 'automatizacion_continua' },
      ],
      columns: PreguntasCalidad
    },
    {
      question: '¿Con qué frecuencia se aplican las siguientes prácticas de aseguramiento de calidad en sus proyectos?',
      type: 'matrix',
      rows: [
        { label: 'Documentación y Estandarización de Procesos', value: 'documentacion_procesos' },
        { label: 'Auditorías y Evaluaciones de Procesos (para verificar conformidad y detectar desviaciones)', value: 'auditorias_desviaciones' },
        { label: 'Definición y Seguimiento de Indicadores de Procesos (KPIs)', value: 'definicion_kpis' },
        { label: 'Capacitación y Sensibilización en Aseguramiento de Calidad', value: 'capacitacion_calidad' },
        { label: 'Implementar acciones preventivas y correctivas', value: 'acciones_preventivas' },
        { label: 'Identificar y analizar riesgos de calidad', value: 'analisis_riesgos' },
        { label: 'Definir planes de mitigación', value: 'planes_mitigacion' }
      ],
      columns: PreguntasCalidad
    }
  ];
  
  export const PreguntasEsfuerzo: Questions[] = [
    {
      question: 'En sus proyectos de software, ¿qué porcentaje del esfuerzo total (o horas/persona) se dedica a cada una de las siguientes actividades dentro del ciclo de desarrollo? ',
      type: 'single',
      options: [
        { label: 'Ingeniería', value: '1' },
        { label: 'Calidad (Gestión, Control, Aseguramiento)', value: '2' },
        { label: 'Soporte', value: '3' },
        { label: 'Innovación', value: '4' }
      ]
    },   
  ];
  
  export const PreguntasDesafios: Questions[] = [
    {
      question: '¿Cuáles son los mayores desafíos que enfrenta su organización en la implementación de las prácticas de calidad de software? (Seleccione todas las opciones que considere relevantes para su organización)',
      type: 'multiple',
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
