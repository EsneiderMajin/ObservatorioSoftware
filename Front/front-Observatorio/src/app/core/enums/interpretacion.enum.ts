export enum TituloPracticasGestion {
    definicion_calidad_gestion = 'definicion_calidad_gestion',
    definicion_calidad_contenido = 'Definir una política de calidad',
    planificacion_objetivos = 'planificacion_objetivos',
    planificacion_objetivos_contenido = 'Planificar y establecer objetivos',
    asignar_capacitacion = 'asignar_capacitacion',
    asignar_capacitacion_contenido = 'Gestionar recursos',
    fomento_continua = 'fomento_continua',
    fomento_continua_contenido = 'Fomentar una cultura de mejora continua',
}

export enum TituloPracticasControl {
    revision_requisitos = 'revision_requisitos',
    revision_requisitos_contenido = 'Revisar y validar requisitos',
    inspecciones_formales = 'inspecciones_formales',
    inspecciones_formales_contenido = 'Realizar inspecciones y revisiones formales (código, diseño)',
    ejecucion_aceptacion = 'ejecucion_aceptacion',
    ejecucion_aceptacion_contenido = 'Ejecutar pruebas(unitarias, integración, sistema y aceptación)',
    uso_pruebas = 'uso_pruebas',
    uso_pruebas_contenido = 'Usar métricas y seguimiento de incidencias',
    automatizacion_continua = 'automatizacion_continua',
    automatizacion_continua_contenido = 'Automatización de pruebas'
}

export enum TituloPracticasAseguramiento {
    documentacion_gestion = 'documentacion_gestion',
    documentacion_gestion_contenido = 'Documentar y estandarizar procesos',
    auditorias_direccion = 'auditorias_direccion',
    auditorias_direccion_contenido = 'Realizar auditorías internas',
    definicion_kpis = 'definicion_kpis',
    definicion_kpis_contenido = 'Definiir y dar seguimiento a indicadores (KPIs)',
    capacitacion_calidad = 'capacitacion_calidad',
    capacitacion_calidad_contenido = 'Capacitación',
    acciones_preventivas = 'acciones_preventivas',
    acciones_preventivas_contenido = 'Implementar acciones preventivas y correctivas'
}               

export enum InterpretacionPracticasGestion {
    nivel_1 = '1',
    nivel_1_nombre = 'No implementada',
    nivel_1_contenido = 'Iniciar desde cero la práctica. Establecer lineamientos básicos y capacitar al equipo.',
    nivel_2 = '2',
    nivel_2_nombre = 'En proceso de implementación',
    nivel_2_contenido = 'Formalizar la práctica, definir procesos y responsabilidades claras.',
    nivel_3 = '3',
    nivel_3_nombre = 'Implementación parcial',
    nivel_3_contenido = 'Consolidar la práctica e integrar en los flujos de trabajo habituales.',
    nivel_4 = '4',
    nivel_4_nombre = 'Implementada',
    nivel_4_contenido = 'Optimizar la práctica usando herramientas y metodologías especializadas.',
    nivel_5 = '5',
    nivel_5_nombre = 'Totalmente implementada',
    nivel_5_contenido = 'Mantener la práctica como parte de la cultura organizacional y evaluarla para mejora continua.' 
}
    


export enum InterpretacionEsfuerzo{
    menor5= 'Esto indica que la mayoría de empresas dedica un esfuerzo mínimo a las prácticas de calidad. Podría reflejar falta de recursos o de prioridad',
    entre5y10= 'Esto sugiere que la mayoría invierte algo de esfuerzo en calidad, pero aún es relativamente bajo. Hay potencial de mejora.',
    entre10y15= 'Las empresas en este rango están invirtiendo un esfuerzo considerable en calidad, lo que sugiere una cultura de mejora más sólida.',
    entre15y20= 'Las empresas en este rango están invirtiendo un esfuerzo considerable en calidad, lo que sugiere una cultura de mejora más sólida.',
    mayor20='Las empresas destinan un alto porcentaje a la calidad, lo que refleja un fuerte compromiso y madurez en sus procesos.'

}