// Evaluación del nivel de implementación de prácticas de calidad (Likert de 1 a 5)
export enum conclusionesEvaluacionCalidad {
    baja = 'El grado general de implementación de sus prácticas de calidad es **No implementada**: Esto indica que las prácticas apenas se aplican o no se usan en su organización.',
    inicial = 'El grado general de implementación de sus prácticas de calidad es **En proceso de implementación**: Se empieza a aplicar, pero de forma limitada o esporádica.',
    parcial = 'El grado general de implementación de sus prácticas de calidad es **Implementada parcialmente**: Se han aplicado en algunas áreas, pero no en todo el proceso.',
    avanzada = 'El grado general de implementación de sus prácticas de calidad es **Implementada**: Se usan de forma regular en la mayoría de los casos, aunque aún puede mejorar.',
    total = 'El grado general de implementación de sus prácticas de calidad es **Totalmente implementada**: Se aplican de manera consistente y completa en todos los aspectos.'
}

// Evaluación del porcentaje de esfuerzo invertido en calidad
export enum conclusionesEvaluacionEsfuerzo {
    muyBajo = 'El porcentaje de esfuerzo que invierte su organización en prácticas de calidad es **muy bajo** (< 5%): Se dedica un esfuerzo mínimo o nulo a las actividades de calidad.',
    bajo = 'El porcentaje de esfuerzo que invierte su organización en prácticas de calidad es **bajo** (5% a 10%): Se aplica un esfuerzo limitado, con pocas acciones o recursos destinados a la calidad.',
    moderado = 'El porcentaje de esfuerzo que invierte su organización en prácticas de calidad es **moderado** (10% a 15%): Se invierte un esfuerzo equilibrado con acciones puntuales y recursos moderados.',
    alto = 'El porcentaje de esfuerzo que invierte su organización en prácticas de calidad es **alto** (15% a 20%): Se dedica un esfuerzo considerable, con recursos y acciones importantes.',
    muyAlto = 'El porcentaje de esfuerzo que invierte su organización en prácticas de calidad es **muy alto** (≥ 20%): Existe un compromiso total con la calidad, utilizando al máximo los recursos disponibles.'
}

// Conclusión general del informe
export enum conclusionesEvaluacion {
    conclusion = 'En base a los resultados obtenidos, se puede concluir que, aunque se evidencia un compromiso por parte de las PYMEs desarrolladoras de software del suroccidente colombiano en la adopción de prácticas de calidad, existen variaciones significativas en el grado de implementación entre las diferentes empresas. Mientras algunas han logrado integrar de manera efectiva metodologías y procedimientos que aseguran un control adecuado en sus procesos, otras aún presentan deficiencias que limitan su potencial para alcanzar estándares óptimos. Esto resalta la necesidad de promover estrategias de capacitación, inversión en herramientas tecnológicas y la estandarización de procesos, de manera que se fortalezca la competitividad y sostenibilidad de estas organizaciones en un entorno cada vez más exigente y dinámico.'
}


export enum recomendacionesGestion {
entre12= 'Rediseñar la estrategia de gestión. Establecer políticas y objetivos claros de calidad.',
entre23= 'Identificar procesos críticos y establecer métricas básicas de gestión.',
entre34= 'Mejorar procesos de planificación y monitoreo. Incluir herramientas de gestión de calidad.',
entre45= 'Mantener estrategias actuales. Enfocar esfuerzos en innovación y mejora continua.',
}

export enum recomendacionesControl {

    entre12= 'Implementar controles básicos. Establecer procesos de revisión y validación.',
    entre23= 'Definir criterios de aceptación. Automatizar pruebas y análisis.',
    entre34= 'Optimizar herramientas de testing. Fortalecer la trazabilidad de errores.',
    entre45= 'Mantener controles actuales. Analizar métricas para prevenir errores antes de que ocurran.'
}


export enum recomendacionesAseguramiento {
    entre12= 'Crear un plan de aseguramiento. Asignar responsables y definir estándares mínimos.',
    entre23= 'Establecer auditorías internas y mecanismos de seguimiento.',
    entre34= 'Integrar QA en todo el ciclo de vida del software. Ajustar procesos según resultados.',
    entre45= 'Mantener buenas prácticas. Avanzar hacia certificaciones de calidad (ISO, CMMI).'
}