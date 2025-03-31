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
  question: string;
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
    question: ' Los datos recopilados en este estudio serán utilizados exclusivamente con fines educativos y de investigación. No se compartirán con terceros ni se expondrán de manera que permitan identificar a los participantes. Toda la información será tratada de forma anónima y confidencial, garantizando el respeto a la privacidad y seguridad de los datos.¿Desea Continuar?',
    type: 'single',
    options: [
      { label: 'Sí', value: 'si' },
      { label: 'No', value: 'no' }
    ]
  };
  
  export const PreguntasGenerales: Questions[] = [
    {
      question: '¿Cuál es el tamaño aproximado de su organización? (Seleccione una sola opción)',
      type: 'single',
      options: [
        { label: 'Microempresa (1 - 10 empleados)', value: 'microempresa' },
        { label: 'Pequeña empresa (11 - 50 empleados)', value: 'pequena_empresa' },
        { label: 'Mediana empresa (51 - 200 empleados)', value: 'mediana_empresa' }
      ]
    },
    {
      question: '¿Cuál es el principal enfoque de su organización? (Seleccione una o varias opciones)',
      type: 'multiple',
      options: [
        { label: 'Desarrollo de software personalizado', value: 'desarrollo_software' },
        { label: 'Venta de productos de software', value: 'venta_productos' },
        { label: 'Servicios de consultoría en software', value: 'consultoria_software' },
        { label: 'Otro', value: 'otro_enfoque' }
      ]
    },
    {
      question: '¿Su empresa sigue algún estándar o modelo de calidad? (Seleccione una o varias opciones)',
      type: 'multiple',
      options: [
        { label: 'CMMI', value: 'cmmi' },
        { label: 'ISO 9001', value: 'iso_9001' },
        { label: 'ISO 2500', value: 'iso_2500' },
        { label: 'ISO/IEC 12207', value: 'iso_iec_12207' },
        { label: 'ISO/IEC 29110', value: 'iso_iec_29110' },
        { label: 'No sigue un estándar formal', value: 'sin_estandar' },
        { label: 'Otro', value: 'otro_estandar' }
      ]
    },
    {
      question: '¿Cuál es su rol dentro de la empresa?',
      type: 'single',
      options: [
        { label: 'Ingeniero de QA', value: 'ingeniero_qa' },
        { label: 'Desarrollador', value: 'desarrollador' },
        { label: 'Líder técnico', value: 'lider_tecnico' },
        { label: 'Gerente de proyectos', value: 'gerente_proyectos' },
        { label: 'Otro', value: 'otro_rol' }
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
        { label: 'Establecer una política de calidad', value: 'politica_calidad' },
        { label: 'Definir un plan de calidad del software', value: 'plan_calidad' },
        { label: 'Asignar responsabilidades y roles', value: 'asignar_roles' },
        { label: 'Asegurar la implementación de procesos de calidad', value: 'procesos_calidad' },
        { label: 'Implementar iniciativas de mejora continua', value: 'mejora_continua' },
        { label: 'Realizar revisiones periódicas de la estrategia de calidad', value: 'revisiones_calidad' },
        { label: 'Analizar datos y tendencias de calidad', value: 'analisis_calidad' },
        { label: 'Capacitar al personal en estándares y mejores prácticas de calidad', value: 'capacitacion' },
        { label: 'Garantizar el uso de herramientas y metodologías adecuadas', value: 'herramientas_metodologias' }
      ],
      columns: PreguntasCalidad
    },
    {
      question: '¿Con qué frecuencia se aplican las siguientes prácticas de control de calidad en sus proyectos?',
      type: 'matrix',
      rows: [
        { label: 'Definición de una estrategia de pruebas', value: 'estrategia_pruebas' },
        { label: 'Definir un plan de pruebas', value: 'plan_pruebas' },
        { label: 'Realizar pruebas unitarias', value: 'pruebas_unitarias' },
        { label: 'Realizar pruebas de integración', value: 'pruebas_integracion' },
        { label: 'Realizar pruebas funcionales y de sistema', value: 'pruebas_funcionales' },
        { label: 'Implementar herramientas de automatización', value: 'automatizacion' },
        { label: 'Registrar y gestionar defectos', value: 'gestion_defectos' },
        { label: 'Realizar pruebas de rendimiento, seguridad y usabilidad', value: 'pruebas_rendimiento' }
      ],
      columns: PreguntasCalidad
    },
    {
      question: '¿Con qué frecuencia se aplican las siguientes prácticas de aseguramiento de calidad en sus proyectos?',
      type: 'matrix',
      rows: [
        { label: 'Establecer y documentar procedimientos de calidad', value: 'procedimientos_calidad' },
        { label: 'Auditorías internas', value: 'auditorias_internas' },
        { label: 'Revisión de artefactos', value: 'revision_artefactos' },
        { label: 'Evaluar métricas de calidad', value: 'metricas_calidad' },
        { label: 'Implementar acciones preventivas y correctivas', value: 'acciones_preventivas' },
        { label: 'Identificar y analizar riesgos de calidad', value: 'analisis_riesgos' },
        { label: 'Definir planes de mitigación', value: 'planes_mitigacion' }
      ],
      columns: PreguntasCalidad
    }
  ];
  
  export const PreguntasEsfuerzo: Questions[] = [
    {
      question: '¿En qué medida su organización invierte esfuerzo en las prácticas de gestión de calidad?',
      type: 'single',
      options: [
        { label: '1 (Muy bajo esfuerzo)', value: '1' },
        { label: '2 (Bajo esfuerzo)', value: '2' },
        { label: '3 (Esfuerzo moderado)', value: '3' },
        { label: '4 (Alto esfuerzo)', value: '4' },
        { label: '5 (Muy alto esfuerzo)', value: '5' }
      ]
    },
    {
      question: '¿En qué medida su organización invierte esfuerzo en las prácticas de control de calidad?',
      type: 'single',
      options: [
        { label: '1 (Muy bajo esfuerzo)', value: '1' },
        { label: '2 (Bajo esfuerzo)', value: '2' },
        { label: '3 (Esfuerzo moderado)', value: '3' },
        { label: '4 (Alto esfuerzo)', value: '4' },
        { label: '5 (Muy alto esfuerzo)', value: '5' }
      ]
    },
    {
      question: '¿En qué medida su organización invierte esfuerzo en las prácticas de aseguramiento de calidad?',
      type: 'single',
      options: [
        { label: '1 (Muy bajo esfuerzo)', value: '1' },
        { label: '2 (Bajo esfuerzo)', value: '2' },
        { label: '3 (Esfuerzo moderado)', value: '3' },
        { label: '4 (Alto esfuerzo)', value: '4' },
        { label: '5 (Muy alto esfuerzo)', value: '5' }
      ]
    }
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
