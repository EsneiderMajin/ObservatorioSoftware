import { Injectable } from '@angular/core';
import {
  Answer,
  MatrixAnswer,
  MetricaMatrix,
} from '../../models/requestQuestions.models';
import { MetricaResponse } from '../../models/responseQuestions.models';
import { listaMensajes } from '../../models/results.model';

@Injectable({
  providedIn: 'root',
})
export class LogicaService {
  constructor() {}

  calcularMetricaGraficaIndividual(metrica: MetricaResponse): MetricaResponse {
    metrica.noImplementada = metrica.noImplementada / 1;
    metrica.implementacionInicial = metrica.implementacionInicial / 2;
    metrica.implementacionParcial = metrica.implementacionParcial / 3;
    metrica.implementacionAvanzada = metrica.implementacionAvanzada / 4;
    metrica.implementacionOptimizad = metrica.implementacionOptimizad / 5;
    return metrica;
  }

  procesarInterpretacion(poblacionEncuestada: number, suEmpresa: number, area: string
  ): listaMensajes[] {
    const interpretaciones: string[] = [];
  
    // Interpretación general
    if (suEmpresa > poblacionEncuestada) {
      interpretaciones.push(
        `Su empresa tiene un nivel de implementación superior al promedio de la población en ${area}. Esto indica que su organización está más avanzada en esta área.`
      );
    } else if (suEmpresa < poblacionEncuestada) {
      interpretaciones.push(
        `Su empresa tiene un nivel de implementación inferior al promedio de la población en ${area}. Esto sugiere que hay oportunidades de mejora en esta área.`
      );
    } else {
      interpretaciones.push(
        `El nivel de implementación de su empresa en ${area} es similar al promedio de la población. Esto indica que su organización está alineada con las prácticas estándar en esta área.`
      );
    }
  
    // Interpretación basada en rangos
    if (suEmpresa <= 2) {
      interpretaciones.push(
        `El nivel de implementación de ${area} en su empresa es bajo. Se recomienda revisar los procesos y establecer planes de mejora.`
      );
    } else if (suEmpresa <= 3) {
      interpretaciones.push(
        `El nivel de implementación de ${area} en su empresa es parcial. Se recomienda fortalecer los procesos existentes y expandir las prácticas exitosas.`
      );
    } else if (suEmpresa <= 4) {
      interpretaciones.push(
        `El nivel de implementación de ${area} en su empresa es aceptable. Se recomienda mantener los estándares actuales y explorar oportunidades de optimización.`
      );
    } else {
      interpretaciones.push(
        `El nivel de implementación de ${area} en su empresa es optimizado. Se recomienda continuar con las prácticas existentes y compartir los éxitos con otros departamentos.`
      );
    }
  
    // Interpretación comparativa detallada
    const diferencia = Math.abs(suEmpresa - poblacionEncuestada);
    if (diferencia >= 1) {
      if (suEmpresa > poblacionEncuestada) {
        interpretaciones.push(
          `La diferencia significativa en ${area} indica que su empresa está liderando en esta área. Se recomienda documentar y compartir estas prácticas con la industria.`
        );
      } else {
        interpretaciones.push(
          `La diferencia significativa en ${area} indica que su empresa tiene un rezago considerable. Se recomienda un plan de acción urgente para cerrar esta brecha.`
        );
      }
    } else if (diferencia >= 0.5) {
      if (suEmpresa > poblacionEncuestada) {
        interpretaciones.push(
          `La diferencia moderada en ${area} sugiere que su empresa está por encima del promedio, pero aún hay espacio para mejorar y consolidar su posición.`
        );
      } else {
        interpretaciones.push(
          `La diferencia moderada en ${area} sugiere que su empresa está por debajo del promedio. Se recomienda revisar los procesos y establecer metas claras para alcanzar el promedio.`
        );
      }
    } else {
      interpretaciones.push(
        `La diferencia mínima en ${area} indica que su empresa está cerca del promedio de la población. Se recomienda mantener el ritmo actual y buscar pequeñas mejoras incrementales.`
      );
    }
  
    return interpretaciones.map((mensaje) => ({ mensaje }));
  }
}
