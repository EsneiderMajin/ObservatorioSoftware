import { Injectable } from '@angular/core';
import {
  ListQuestions,
  MatrixColumn,
  Questions,
} from '../../models/observatorio.model';
import {
  PreguntaAutorizacion,
  PreguntasGenerales,
  matrixQuestions,
  PreguntasEsfuerzo,
  PreguntasDesafios,
} from '../../models/observatorio.model';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private supabaseService: SupabaseService) {}

  // Método genérico para obtener preguntas por categoría
  async getPreguntas(categoria: string): Promise<ListQuestions> {
    const supabase = this.supabaseService.getClient();

    // Obtén el ID de la categoría por su nombre
    const categoryId = await this.getCategoryId(categoria);

    // Consulta para obtener preguntas y sus relaciones
    const { data, error } = await supabase
      .from('questions')
      .select(
        `id, question, type, clase, 
         options(id, label, value, has_input, input_placeholder), 
         matrix_rows(label, value), 
         matrix_columns(label, value), 
         question_categories(category, avaliable)`
      )
      .eq('category_id', categoryId);

    if (error) {
      console.error(`Error fetching questions for category ${categoria}:`, error);
      throw error;
    }

    // Transformación de los datos obtenidos
    return {
      questions: data.map(item => ({
        id: item.id,
        question: item.question,
        type: item.type,
        clase: item.clase,
        rows: item.matrix_rows,
        columns: item.matrix_columns,
        options: item.options.map(option => ({
          id: option.id,
          label: option.label,
          value: option.value,
          hasInput: option.has_input,
          inputPlaceholder: option.input_placeholder
        }))
      })),
      category: data[0]?.question_categories?.[0]?.category || categoria,
      avaliable: data[0]?.question_categories?.[0]?.avaliable || false
    };
  }

  // Método auxiliar para obtener el ID de una categoría
  private async getCategoryId(categoria: string): Promise<string> {
    const { data, error } = await this.supabaseService.getClient()
      .from('question_categories')
      .select('id')
      .eq('category', categoria)
      .single();

    if (error) {
      console.error(`Error fetching category ID for ${categoria}:`, error);
      throw error;
    }

    return data.id;
  }

  async postGuardarRespuestas(encuestaObjet: any): Promise<{ success: boolean; error?: any }> {
    const supabase = this.supabaseService.getClient();
    try {
      // Insertar registro en la tabla Encuesta
      const { data: encuestaData, error: encuestaError } = await supabase
        .from('Encuesta')
        .insert({
          fechaCreacion: encuestaObjet.fechacreacion,
          idUsuario: encuestaObjet.idUsuario,
          anio: encuestaObjet.anio,
        })
        .select();

      if (encuestaError) {
        console.error('Error al insertar encuesta:', encuestaError);
        return { success: false, error: encuestaError };
      }

      const idEncuesta = encuestaData[0].idEncuesta;

      let preguntasBatch = [];
      let respuestasBatch: {
        single: { response: any; idPregunta: any }[];
        multiple: { optionSelected: any; idPregunta: any }[];
        matrix: { matrixKey: string; value: any; idPregunta: any }[];
      } = { single: [], multiple: [], matrix: [] };

      // Nuevo arreglo para insertar la métrica en metricaMatrix
      let metricaMatrixBatch: any[] = [];

      // Recorrer cada grupo de preguntas para armar el batch de preguntas
      for (const grupo of encuestaObjet.questions) {
        const category = grupo.category;
        for (const pregunta of grupo.answers) {
          preguntasBatch.push({
            question: pregunta.question,
            type: pregunta.type,
            idEncuesta: idEncuesta,
            category: category,
            clase: pregunta.clase,
          });
        }
      }

      // Insertar todas las preguntas en un solo lote para obtener sus IDs
      const { data: preguntasData, error: preguntasError } = await supabase
        .from('PreguntaRespuesta')
        .insert(preguntasBatch)
        .select();

      if (preguntasError) {
        console.error('Error al insertar preguntas:', preguntasError);
        return { success: false, error: preguntasError };
      }

      // Asignar respuestas a preguntas ya insertadas
      let index = 0;
      for (const grupo of encuestaObjet.questions) {
        for (const pregunta of grupo.answers) {
          const idPregunta = preguntasData[index++].idPregunta;
          if (pregunta.type === 'single') {
            respuestasBatch.single.push({
              response: pregunta.response,
              idPregunta: idPregunta,
            });
          } else if (pregunta.type === 'multiple') {
            pregunta.selectedOptions.forEach((opcion: any) => {
              respuestasBatch.multiple.push({
                optionSelected: opcion,
                idPregunta: idPregunta,
              });
            });
          } else if (pregunta.type === 'matrix') {
            // Insertar las respuestas de la matriz en respuestaMatrix
            Object.entries(pregunta.matrix).forEach(([key, value]) => {
              respuestasBatch.matrix.push({
                matrixKey: key,
                value: value,
                idPregunta: idPregunta,
              });
            });
            // Insertar la métrica en metricaMatrix
            if (pregunta.metrica) {
              metricaMatrixBatch.push({
                noImplementada: pregunta.metrica.grados?.noImplementada || 0,
                implementacionInicial:
                  pregunta.metrica.grados?.implementacionInicial || 0,
                implementacionParcial:
                  pregunta.metrica.grados?.implementacionParcial || 0,
                implementacionAvanzada:
                  pregunta.metrica.grados?.implementacionAvanzada || 0,
                implementacionOptimizad:
                  pregunta.metrica.grados?.implementacionOptimizad || 0,
                tamanioMatrix: pregunta.metrica.tamanioMatrix || 0,
                totalImplementacion: pregunta.metrica.totalImplementacion || 0,
                idPregunta: idPregunta,
              });
            }
          } else if (pregunta.type === 'percentage') {
            Object.entries(pregunta.percentage).forEach(([key, value]) => {
              respuestasBatch.matrix.push({
                matrixKey: key,
                value: value,
                idPregunta: idPregunta,
              });
            });
          } else if (pregunta.type === 'text') {
            respuestasBatch.single.push({
              response: pregunta.response,
              idPregunta: idPregunta,
            });
          }
        }
      }

      // Insertar respuestas en paralelo
      await Promise.all([
        respuestasBatch.single.length > 0 &&
          supabase.from('respuestaSimple').insert(respuestasBatch.single),
        respuestasBatch.multiple.length > 0 &&
          supabase.from('respuestaMultiple').insert(respuestasBatch.multiple),
        respuestasBatch.matrix.length > 0 &&
          supabase.from('respuestaMatrix').insert(respuestasBatch.matrix),
      ]);

      // Insertar las métricas en la tabla metricaMatrix si existen
      if (metricaMatrixBatch.length > 0) {
        const { error: metricaError } = await supabase
          .from('metricaMatrix')
          .insert(metricaMatrixBatch);
        if (metricaError) {
          console.error('Error al insertar metricaMatrix:', metricaError);
          return { success: false, error: metricaError };
        }
      }

      console.log('Datos guardados correctamente.');
      return { success: true };
    } catch (error) {
      console.error('Error guardando respuestas:', error);
      return { success: false, error };
    }
  }

  // // Método para obtener la pregunta de autorización
  // getPreguntaAutorizacion(): ListQuestions {
  //   const preguntaAutorizacionData: ListQuestions = {
  //     questions: [PreguntaAutorizacion],
  //     category: 'preguntaAutorizacion',
  //     avaliable: true,
  //   };
  //   return preguntaAutorizacionData;
  // }

  // // Método para obtener todas las preguntas
  // getPreguntasGenerales(): ListQuestions {
  //   const preguntasGeneralesData: ListQuestions = {
  //     questions: PreguntasGenerales,
  //     category: 'preguntasGenerales',
  //     avaliable: false,
  //   };
  //   return preguntasGeneralesData;
  // }

  // // Método para obtener las preguntas de matriz
  // getPreguntasCalidad(): ListQuestions {
  //   const matrixQuestionsData: ListQuestions = {
  //     questions: matrixQuestions,
  //     category: 'preguntasCalidad',
  //     avaliable: false,
  //   };
  //   return matrixQuestionsData;
  // }

  // // Método para obtener las preguntas de esfuerzo
  // getPreguntasEsfuerzo(): ListQuestions {
  //   const PreguntasEsfuerzoData: ListQuestions = {
  //     questions: PreguntasEsfuerzo,
  //     category: 'preguntasEsfuerzo',
  //     avaliable: false,
  //   };
  //   return PreguntasEsfuerzoData;
  // }

  // // Método para obtener las preguntas de desafíos
  // getPreguntasDesafios(): ListQuestions {
  //   const PreguntasDesafiosData: ListQuestions = {
  //     questions: PreguntasDesafios,
  //     category: 'preguntasDesafios',
  //     avaliable: false,
  //   };
  //   return PreguntasDesafiosData;
  // }

  async getPreguntasPorIdEncuesta(
    categoria: string,
    idEncuesta: number
  ): Promise<ListQuestions[]> {
    const supabase = this.supabaseService.getClient();

    // Usamos la sintaxis de Supabase para "expandir" las relaciones
    // Ahora incluimos metricaMatrix en la consulta
    const { data, error } = await supabase
      .from('PreguntaRespuesta')
      .select(
        `
        *,
        respuestaSimple(*),
        respuestaMultiple(*),
        respuestaMatrix(*),
        metricaMatrix(*) // Incluir metricaMatrix en la consulta
      `
      )
      .eq('category', categoria)
      .eq('idEncuesta', idEncuesta); // Añadimos el filtro por idEncuesta

    if (error) {
      console.error(
        'Error al obtener preguntas por categoría y encuesta ID:',
        error
      );
      return [];
    }

    const questionsTransformadas = data.map((pregunta: any) => {
      // Según el tipo de pregunta, estructuramos las respuestas
      if (pregunta.type === 'single') {
        const simpleResp = pregunta.respuestaSimple?.[0];
        return {
          idPregunta: pregunta.idPregunta,
          question: pregunta.question,
          type: pregunta.type,
          clase: pregunta.clase,
          response: simpleResp ? simpleResp.response : undefined,
          metrica: this.getMetrica(pregunta.metricaMatrix), // Incluir métrica
        };
      } else if (pregunta.type === 'multiple') {
        const multipleResp = pregunta.respuestaMultiple || [];
        return {
          idPregunta: pregunta.idPregunta,
          question: pregunta.question,
          type: pregunta.type,
          clase: pregunta.clase,
          selectedOptions: multipleResp.map((item: any) => item.optionSelected),
          metrica: this.getMetrica(pregunta.metricaMatrix), // Incluir métrica
        };
      } else if (pregunta.type === 'matrix') {
        const matrixResp = pregunta.respuestaMatrix || [];
        const matrix: { [key: string]: number } = {};
        matrixResp.forEach((item: any) => {
          matrix[item.matrixKey] = item.value;
        });
        return {
          idPregunta: pregunta.idPregunta,
          question: pregunta.question,
          type: pregunta.type,
          clase: pregunta.clase,
          matrix,
          metrica: this.getMetrica(pregunta.metricaMatrix), // Incluir métrica
        };
      } else if (pregunta.type === 'text') {
        const simpleResp = pregunta.respuestaSimple?.[0];
        return {
          idPregunta: pregunta.idPregunta,
          question: pregunta.question,
          type: pregunta.type,
          clase: pregunta.clase,
          response: simpleResp ? simpleResp.response : undefined,
          metrica: this.getMetrica(pregunta.metricaMatrix), // Incluir métrica
        };
      } else {
        return {
          idPregunta: pregunta.idPregunta,
          question: pregunta.question,
          type: pregunta.type,
          clase: pregunta.clase,
          metrica: this.getMetrica(pregunta.metricaMatrix), // Incluir métrica
        };
      }
    });

    return [
      {
        category: categoria,
        questions: questionsTransformadas,
        avaliable: true,
      },
    ];
  }

  //consultar preguntas por categoria
  async getPreguntasPorCategoria(categoria: string): Promise<ListQuestions[]> {
    const supabase = this.supabaseService.getClient();

    // Usamos la sintaxis de Supabase para "expandir" las relaciones
    // Ahora incluimos metricaMatrix en la consulta
    const { data, error } = await supabase
      .from('PreguntaRespuesta')
      .select(
        `
          *,
          respuestaSimple(*),
          respuestaMultiple(*),
          respuestaMatrix(*),
          metricaMatrix(*) // Incluir metricaMatrix en la consulta
        `
      )
      .eq('category', categoria);

    if (error) {
      console.error('Error al obtener preguntas por categoría:', error);
      return [];
    }

    const questionsTransformadas = data.map((pregunta: any) => {
      // Según el tipo de pregunta, estructuramos las respuestas
      if (pregunta.type === 'single') {
        const simpleResp = pregunta.respuestaSimple?.[0];
        return {
          idPregunta: pregunta.idPregunta,
          question: pregunta.question,
          type: pregunta.type,
          clase: pregunta.clase,
          response: simpleResp ? simpleResp.response : undefined,
          metrica: this.getMetrica(pregunta.metricaMatrix), // Incluir métrica
        };
      } else if (pregunta.type === 'multiple') {
        const multipleResp = pregunta.respuestaMultiple || [];
        return {
          idPregunta: pregunta.idPregunta,
          question: pregunta.question,
          type: pregunta.type,
          clase: pregunta.clase,
          selectedOptions: multipleResp.map((item: any) => item.optionSelected),
          metrica: this.getMetrica(pregunta.metricaMatrix), // Incluir métrica
        };
      } else if (pregunta.type === 'matrix') {
        const matrixResp = pregunta.respuestaMatrix || [];
        const matrix: { [key: string]: number } = {};
        matrixResp.forEach((item: any) => {
          matrix[item.matrixKey] = item.value;
        });
        return {
          idPregunta: pregunta.idPregunta,
          question: pregunta.question,
          type: pregunta.type,
          clase: pregunta.clase,
          matrix,
          metrica: this.getMetrica(pregunta.metricaMatrix), // Incluir métrica
        };
      } else if (pregunta.type === 'percentage') {
        const matrixResp = pregunta.respuestaMatrix || [];
        const matrix: { [key: string]: number } = {};
        matrixResp.forEach((item: any) => {
          matrix[item.matrixKey] = item.value;
        });
        return {
          idPregunta: pregunta.idPregunta,
          question: pregunta.question,
          type: pregunta.type,
          clase: pregunta.clase,
          matrix,
        };
      } else {
        return {
          idPregunta: pregunta.idPregunta,
          question: pregunta.question,
          type: pregunta.type,
          metrica: this.getMetrica(pregunta.metricaMatrix), // Incluir métrica
        };
      }
    });

    return [
      {
        category: categoria,
        questions: questionsTransformadas,
        avaliable: true,
      },
    ];
  }

  // Función auxiliar para obtener la métrica
  getMetrica(metricaMatrix: any[]): any {
    if (!metricaMatrix || metricaMatrix.length === 0) {
      return null; // O el objeto vacío, según lo que necesites
    }
    const metrica = metricaMatrix[0]; // Suponiendo que solo hay una métrica por pregunta
    return {
      noImplementada: metrica?.noImplementada || 0,
      implementacionInicial: metrica?.implementacionInicial || 0,
      implementacionParcial: metrica?.implementacionParcial || 0,
      implementacionAvanzada: metrica?.implementacionAvanzada || 0,
      implementacionOptimizad: metrica?.implementacionOptimizad || 0,
      tamanioMatrix: metrica?.tamanioMatrix || 0,
      totalImplementacion: metrica?.totalImplementacion || 0,
    };
  }

  //consultar preguntas por categoria
  async getPreguntasPorCategoriaanio(
    categoria: string,
    ano: number = 2025
  ): Promise<ListQuestions[]> {
    const supabase = this.supabaseService.getClient();

    // Usamos la sintaxis de Supabase para "expandir" las relaciones y unir con Encuesta
    const { data, error } = await supabase
      .from('PreguntaRespuesta')
      .select(
        `
      *,
      respuestaSimple(*),
      respuestaMultiple(*),
      respuestaMatrix(*),
      metricaMatrix(*),
      Encuesta:Encuesta(idEncuesta, fechaCreacion) // Unir con Encuesta y seleccionar fechaCreacion
    `
      )
      .eq('category', categoria)
      .gte('Encuesta.fechaCreacion', `${ano}-01-01`) // Filtro por fecha de inicio del año
      .lte('Encuesta.fechaCreacion', `${ano}-12-31`); // Filtro por fecha de fin del año

    if (error) {
      console.error('Error al obtener preguntas por categoría:', error);
      return [];
    }

    const questionsTransformadas = data.map((pregunta: any) => {
      // Según el tipo de pregunta, estructuramos las respuestas
      if (pregunta.type === 'single') {
        const simpleResp = pregunta.respuestaSimple?.[0];
        return {
          idPregunta: pregunta.idPregunta,
          question: pregunta.question,
          type: pregunta.type,
          clase: pregunta.clase,
          response: simpleResp ? simpleResp.response : undefined,
          metrica: this.getMetrica(pregunta.metricaMatrix), // Incluir métrica
        };
      } else if (pregunta.type === 'multiple') {
        const multipleResp = pregunta.respuestaMultiple || [];
        return {
          idPregunta: pregunta.idPregunta,
          question: pregunta.question,
          type: pregunta.type,
          clase: pregunta.clase,
          selectedOptions: multipleResp.map((item: any) => item.optionSelected),
          metrica: this.getMetrica(pregunta.metricaMatrix), // Incluir métrica
        };
      } else if (pregunta.type === 'matrix') {
        const matrixResp = pregunta.respuestaMatrix || [];
        const matrix: { [key: string]: number } = {};
        matrixResp.forEach((item: any) => {
          matrix[item.matrixKey] = item.value;
        });
        return {
          idPregunta: pregunta.idPregunta,
          question: pregunta.question,
          type: pregunta.type,
          clase: pregunta.clase,
          matrix,
          metrica: this.getMetrica(pregunta.metricaMatrix), // Incluir métrica
        };
      } else if (pregunta.type === 'percentage') {
        const matrixResp = pregunta.respuestaMatrix || [];
        const matrix: { [key: string]: number } = {};
        matrixResp.forEach((item: any) => {
          matrix[item.matrixKey] = item.value;
        });
        return {
          idPregunta: pregunta.idPregunta,
          question: pregunta.question,
          type: pregunta.type,
          clase: pregunta.clase,
          matrix,
        };
      } else {
        return {
          idPregunta: pregunta.idPregunta,
          question: pregunta.question,
          type: pregunta.type,
          clase: pregunta.clase,
          metrica: this.getMetrica(pregunta.metricaMatrix), // Incluir métrica
        };
      }
    });

    return [
      {
        category: categoria,
        questions: questionsTransformadas,
        avaliable: true,
      },
    ];
  }

  //consultar encuesta por idencuesta
  async getEncuestaPorIdEncuesta(idEncuesta: string): Promise<any> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('Encuesta')
      .select('*')
      .eq('idEncuesta', idEncuesta)
      .single(); // Usamos single para obtener un solo registro

    if (error) {
      console.error('Error al obtener encuesta por idEncuesta:', error);
      return null;
    }

    return data;
  }

  //consultar si usuario tiene encuesta
  async getEncuestasPorUsuario(idUsuario: string): Promise<any[]> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('Encuesta')
      .select('*')
      .eq('idUsuario', idUsuario);

    if (error) {
      console.error('Error al obtener encuestas por usuario:', error);
      return [];
    }

    return data || [];
  }

  // Método para contar el número de encuestas realizadas
  async contarEncuestas(): Promise<number> {
    const supabase = this.supabaseService.getClient();

    const { data, error, count } = await supabase
      .from('Encuesta')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error al contar encuestas:', error);
      return 0;
    }

    return count || 0;
  }

  async getAllSurveyYears(): Promise<number[]> {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('Encuesta')
      .select('anio');
  
    if (error) {
      console.error('Error al obtener años de encuestas:', error);
      return [];
    }
  
    return data?.map(item => item.anio) || [];
  }


}
