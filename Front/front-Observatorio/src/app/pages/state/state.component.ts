

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Chart, CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend } from 'chart.js';
import { InterpretacionEsfuerzo, InterpretacionPracticasGestion, TituloPracticasAseguramiento, TituloPracticasControl, TituloPracticasGestion } from 'src/app/core/enums/interpretacion.enum';
import { recomendacionesAseguramiento, recomendacionesControl, recomendacionesGestion } from 'src/app/core/enums/recomendacion.enum';
import { Answer, MatrixAnswer, MetricaMatrix } from 'src/app/core/models/requestQuestions.models';
import { PreguntaResponse, question, MetricaResponse, MetricaEsfuerzo, MetricaDesafios, listaConclusiones } from 'src/app/core/models/responseQuestions.models';
import { listaMensajes, listaPracticas } from 'src/app/core/models/results.model';
import { AuthService } from 'src/app/core/services/login/auth.service';
import { QuestionService } from 'src/app/core/services/question/question.service';

  // Registrar los componentes de Chart.js que se usarán
  Chart.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit{

  formGroup!: FormGroup;
  listaPreguntasEsfuerzo: PreguntaResponse[] = [];
  listaPreguntasCalidadGlobal: PreguntaResponse[] = [];
  listaPreguntasDesafios: PreguntaResponse[] = [];
  anioId = 0;
  mostrarGrafica = false;
  averagedMetricsGlobal: { [question: string]: { [variable: string]: number } } = {};
  metricaGlobal: any[] = [];
  listaConclusiones: listaConclusiones[] = [];

  //listas Interpretacion
  listaPracticasTotal: any[] = [];
  listaPracticasGestion: listaPracticas[] = [];
  listaPracticasControl: listaPracticas[] = [];
  listaPracticasAseguramiento: listaPracticas[] = [];
  listaEsfuerzo: listaMensajes[] = [];
  listaDesafios: listaMensajes[] = [];

  //Calidad
  calidadChart1!: Chart;
  calidadChart2!: Chart;
  calidadChart3!: Chart;
  @ViewChild('calidadChartCanvas1') calidadChartCanvas1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('calidadChartCanvas2') calidadChartCanvas2!: ElementRef<HTMLCanvasElement>;
  @ViewChild('calidadChartCanvas3') calidadChartCanvas3!: ElementRef<HTMLCanvasElement>;

  //Esfuerzo
  calidadEsfuerzo!: Chart;
  @ViewChild('calidadChartEsfuerzo') calidadChartEsfuerzo!: ElementRef<HTMLCanvasElement>;

  //Desafios
  calidadChartDesafios!: Chart;
  @ViewChild('calidadChartDesafiosCanvas') calidadChartDesafiosCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private readonly activeRoute: ActivatedRoute,
    private readonly questionService: QuestionService,
    private readonly formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
    this.formGroup = this.formBuilder.group({});
  }

  async ngOnInit() {
    
    this.activeRoute.params.subscribe(params => {
      this.anioId = params?.['id'] ?? 0;
    });

    await this.cargarDatos();
  }

  async cargarDatos() {

    await this.questionService.getPreguntasPorCategoriaanio('preguntasCalidad',this.anioId).then((res) => {
      this.listaPreguntasCalidadGlobal = res as PreguntaResponse[];
    });

    await this.questionService.getPreguntasPorCategoriaanio('preguntasEsfuerzo',this.anioId).then((res) => {
      this.listaPreguntasEsfuerzo = res as PreguntaResponse[];
    });

    await this.questionService.getPreguntasPorCategoriaanio('preguntasDesafios',this.anioId).then((res) => {
      this.listaPreguntasDesafios = res as PreguntaResponse[];
    });

    this.calcularCalidadGlobal();

    this.calcularEsfuerzoGlobal();

    this.calcularDesafiosGlobal();

    this.recomendacionesEvaluacionCalidad();

    // Calcular los promedios
    const promedios = this.calcularPromedioPracticas();

    // Organizar los promedios en un listado de 3 objetos
    this.listaPracticasTotal = this.organizarEnListado(promedios);

    this.tablaInterpretaciones();

  }

    recomendacionesEvaluacionCalidad() {

      this.metricaGlobal.forEach((metrica, index) => {
        let recomendacion = '';
        let area = '';
        if (index === 0) {
          area = 'Gestión de calidad';
          if ((metrica.totalImplementacion ?? 0) <= 2) {
            recomendacion = recomendacionesGestion.entre12;
          } else if ((metrica.totalImplementacion ?? 0) <= 3) {
            recomendacion = recomendacionesGestion.entre23;
          } else if ((metrica.totalImplementacion ?? 0) <= 4) {
            recomendacion = recomendacionesGestion.entre34;
          } else if ((metrica.totalImplementacion ?? 0) <= 5) {
            recomendacion = recomendacionesGestion.entre45;
          }
  
        } else if (index === 1) {
          area = 'Control de calidad';
          if ((metrica.totalImplementacion ?? 0) <= 2) {
            recomendacion = recomendacionesControl.entre12;
          } else if ((metrica.totalImplementacion ?? 0) <= 3) {
            recomendacion = recomendacionesControl.entre23;
          } else if ((metrica.totalImplementacion ?? 0) <= 4) {
            recomendacion = recomendacionesControl.entre34;
          }
          else if ((metrica.totalImplementacion ?? 0) <= 5) {
            recomendacion = recomendacionesControl.entre45;
          }        
        } else if (index === 2) {
          area = 'Aseguramiento de calidad';
          if ((metrica.totalImplementacion ?? 0) <= 2) {
            recomendacion = recomendacionesAseguramiento.entre12;
          } else if ((metrica.totalImplementacion ?? 0) <= 3) {
            recomendacion = recomendacionesAseguramiento.entre23;
          } else if ((metrica.totalImplementacion ?? 0) <= 4) {
            recomendacion = recomendacionesAseguramiento.entre34;
          } else if ((metrica.totalImplementacion ?? 0) <= 5) {
            recomendacion = recomendacionesAseguramiento.entre45;
          }
        }
  
  
        this.listaConclusiones.push({
          area: area,
          puntaje: Math.floor(metrica.totalImplementacion * 100) / 100,
          recomendacion: recomendacion
        });
      });      
  
    }



    calcularPromedioPracticas() {
      const valoresAcumulados: Record<string, number> = {}; // Para almacenar la suma de valores de cada práctica
      const contador: Record<string, number> = {}; // Para contar cuántas veces aparece cada práctica
    
      // Recorrer cada objeto en la lista
      for (const objeto of this.listaPracticasTotal) {
        // Recorrer cada clave-valor en el objeto
        for (const clave in objeto) {
          if (objeto.hasOwnProperty(clave)) {
            const valor = objeto[clave];
    
            // Inicializar el acumulador y contador si es la primera vez que se ve la práctica
            if (!valoresAcumulados[clave]) {
              valoresAcumulados[clave] = 0;
              contador[clave] = 0;
            }
    
            // Sumar el valor y actualizar el contador
            valoresAcumulados[clave] += valor;
            contador[clave]++;
          }
        }
      }
    
      // Calcular el promedio para cada práctica
      const promedios: Record<string, number> = {};
      for (const clave in valoresAcumulados) {
        promedios[clave] = valoresAcumulados[clave] / contador[clave];
      }
    
      return promedios;
    }
    
    organizarEnListado(promedios: any) {
      // Definir los 3 objetos de destino
      const listado = [
        {
          "definicion_calidad_gestion": 0,
          "planificacion_objetivos": 0,
          "asignar_capacitacion": 0,
          "fomento_continua": 0
        },
        {
          "revision_requisitos": 0,
          "inspecciones_formales": 0,
          "ejecucion_aceptacion": 0,
          "uso_pruebas": 0,
          "automatizacion_continua": 0
        },
        {
          "definicion_calidad_aseguramiento": 0,
          "documentacion_gestion": 0,
          "auditorias_direccion": 0,
          "definicion_kpis": 0,
          "capacitacion_calidad": 0,
          "acciones_preventivas": 0
        }
      ];
    
      // Llenar los objetos con los promedios calculados
      for (const clave in promedios) {
        if (listado[0].hasOwnProperty(clave)) {
          listado[0][clave as keyof typeof listado[0]] = promedios[clave];
        } else if (listado[1].hasOwnProperty(clave)) {
          listado[1][clave as keyof typeof listado[1]] = promedios[clave];
        } else if (listado[2].hasOwnProperty(clave)) {
          listado[2][clave as keyof typeof listado[2]] = promedios[clave];
        }
      }
    
      return listado;
    }


    tablaInterpretaciones() {

      console.log(this.listaPracticasTotal);

      // Definir un mapeo entre los niveles y sus valores
      const interpretacionNiveles = {
        1: {
          contenido: InterpretacionPracticasGestion.nivel_1_contenido,
          nombre: InterpretacionPracticasGestion.nivel_1_nombre
        },
        2: {
          contenido: InterpretacionPracticasGestion.nivel_2_contenido,
          nombre: InterpretacionPracticasGestion.nivel_2_nombre
        },
        3: {
          contenido: InterpretacionPracticasGestion.nivel_3_contenido,
          nombre: InterpretacionPracticasGestion.nivel_3_nombre
        },
        4: {
          contenido: InterpretacionPracticasGestion.nivel_4_contenido,
          nombre: InterpretacionPracticasGestion.nivel_4_nombre
        },
        5: {
          contenido: InterpretacionPracticasGestion.nivel_5_contenido,
          nombre: InterpretacionPracticasGestion.nivel_5_nombre
        }
      };
    
      // Definir un mapeo para cada categoría de prácticas
      const categorias = {
        gestion: {
          array: this.listaPracticasGestion,
          tituloPracticas: {
            [TituloPracticasGestion.definicion_calidad_gestion]: TituloPracticasGestion.definicion_calidad_contenido,
            [TituloPracticasGestion.asignar_capacitacion]: TituloPracticasGestion.asignar_capacitacion_contenido,
            [TituloPracticasGestion.fomento_continua]: TituloPracticasGestion.fomento_continua_contenido,
            [TituloPracticasGestion.planificacion_objetivos]: TituloPracticasGestion.planificacion_objetivos_contenido
          }
        },
        control: {
          array: this.listaPracticasControl,
          tituloPracticas: {
            [TituloPracticasControl.revision_requisitos]: TituloPracticasControl.revision_requisitos_contenido,
            [TituloPracticasControl.inspecciones_formales]: TituloPracticasControl.inspecciones_formales_contenido,
            [TituloPracticasControl.ejecucion_aceptacion]: TituloPracticasControl.ejecucion_aceptacion_contenido,
            [TituloPracticasControl.uso_pruebas]: TituloPracticasControl.uso_pruebas_contenido,
            [TituloPracticasControl.automatizacion_continua]: TituloPracticasControl.automatizacion_continua_contenido
          }
        },
        aseguramiento: {
          array: this.listaPracticasAseguramiento,
          tituloPracticas: {
            [TituloPracticasAseguramiento.documentacion_gestion]: TituloPracticasAseguramiento.documentacion_gestion_contenido,
            [TituloPracticasAseguramiento.auditorias_direccion]: TituloPracticasAseguramiento.auditorias_direccion_contenido,
            [TituloPracticasAseguramiento.definicion_kpis]: TituloPracticasAseguramiento.definicion_kpis_contenido,
            [TituloPracticasAseguramiento.capacitacion_calidad]: TituloPracticasAseguramiento.capacitacion_calidad_contenido,
            [TituloPracticasAseguramiento.acciones_preventivas]: TituloPracticasAseguramiento.acciones_preventivas_contenido
            
          }
        }
      };
    
      // Definir las prácticas a verificar para cada categoría
      const practicasAVerificar = {
        gestion: [
          TituloPracticasGestion.definicion_calidad_gestion,
          TituloPracticasGestion.asignar_capacitacion,
          TituloPracticasGestion.fomento_continua,
          TituloPracticasGestion.planificacion_objetivos
        ],
        control: [
          TituloPracticasControl.revision_requisitos,
          TituloPracticasControl.inspecciones_formales,
          TituloPracticasControl.ejecucion_aceptacion,
          TituloPracticasControl.uso_pruebas,
          TituloPracticasControl.automatizacion_continua
        ],
        aseguramiento: [
          TituloPracticasAseguramiento.documentacion_gestion,
          TituloPracticasAseguramiento.auditorias_direccion,
          TituloPracticasAseguramiento.definicion_kpis,
          TituloPracticasAseguramiento.capacitacion_calidad,
          TituloPracticasAseguramiento.acciones_preventivas
  
        ]
      };
    
      // Procesar cada categoría
      for (const categoria in categorias) {
        const { array, tituloPracticas } = categorias[categoria as keyof typeof categorias];
        const practicas = practicasAVerificar[categoria as keyof typeof practicasAVerificar];
    
        for (const practica of practicas) {
          for (const item of this.listaPracticasTotal) {
            if (item.hasOwnProperty(practica))
              //tener en cuenta 
              {
              const nivelRaw = Math.round(item[practica] * 100) / 100;
              const nivel = Math.round(nivelRaw) as keyof typeof interpretacionNiveles;
              if (interpretacionNiveles[nivel]) {
                array.push({
                  practica: tituloPracticas[practica as keyof typeof tituloPracticas],
                  nivel: nivelRaw,
                  interpretacion: interpretacionNiveles[nivel].contenido,
                  nivel_nombre: interpretacionNiveles[nivel].nombre
                });
              }
            }
          }
        }
      }
    }


  calcularDesafiosGlobal() {

    let metricaDesafios: MetricaDesafios = {
      recursos_limitados: 0,
      dificultad_adaptar_estandares: 0,
      falta_conocimiento: 0,
      falta_personal_capacitado: 0,
      resistencia_cambio: 0,
      dificultad_metodologias: 0
    };

    
    this.listaPreguntasDesafios[0].questions.forEach((pregunta) => {
      pregunta.selectedOptions.forEach((respuesta: string) => {
        if (respuesta === 'recursos_limitados') {
          metricaDesafios.recursos_limitados++;
        } else if (respuesta === 'dificultad_adaptar_estandares') {
          metricaDesafios.dificultad_adaptar_estandares++;
        } else if (respuesta === 'falta_conocimiento') {
          metricaDesafios.falta_conocimiento++;
        } else if (respuesta === 'falta_personal_capacitado') {
          metricaDesafios.falta_personal_capacitado++;
        } else if (respuesta === 'resistencia_cambio') {
          metricaDesafios.resistencia_cambio++;
        } else if (respuesta === 'dificultad_metodologias') {
          metricaDesafios.dificultad_metodologias++;
        }
      });
    });

    this.interpretarDesafiosGlobal(metricaDesafios);

    //Graficar los desafios globales
    this.crearGraficoDesafiosGlobal(metricaDesafios);

  }

  interpretarDesafiosGlobal(metrica: MetricaDesafios) {
    // Sumar todos los desafíos para conocer el total
    const total =
      metrica.recursos_limitados +
      metrica.dificultad_adaptar_estandares +
      metrica.falta_conocimiento +
      metrica.falta_personal_capacitado +
      metrica.resistencia_cambio +
      metrica.dificultad_metodologias;
  
    // Caso sin datos
    if (total === 0) {
      this.listaDesafios.push({mensaje: "No se han identificado desafíos en la implementación de las prácticas de calidad."}); 
    }
  
    // Crear un arreglo para trabajar con los desafíos
    const desafiosArray = [
      { clave: "recursos_limitados", label: "Recursos limitados", valor: metrica.recursos_limitados },
      { clave: "dificultad_adaptar_estandares", label: "Dificultad para adaptar estándares", valor: metrica.dificultad_adaptar_estandares },
      { clave: "falta_conocimiento", label: "Falta de conocimiento", valor: metrica.falta_conocimiento },
      { clave: "falta_personal_capacitado", label: "Falta de personal capacitado", valor: metrica.falta_personal_capacitado },
      { clave: "resistencia_cambio", label: "Resistencia al cambio", valor: metrica.resistencia_cambio },
      { clave: "dificultad_metodologias", label: "Dificultad en metodologías", valor: metrica.dificultad_metodologias }
    ];
  
    // Ordenar de mayor a menor para identificar el desafío más citado
    desafiosArray.sort((a, b) => b.valor - a.valor);
    const maxDesafio = desafiosArray[0];
    const porcentajeMax = ((maxDesafio.valor / total) * 100).toFixed(1);
  
    // Construir mensaje base
    let mensaje = `Se han identificado un total de ${total} menciones de desafíos en la implementación de prácticas de calidad. El desafío más citado es "${maxDesafio.label}" con ${maxDesafio.valor} menciones (${porcentajeMax}% del total).`;
    
    this.listaDesafios.push({mensaje: mensaje});
  
    // Interpretación específica según el desafío predominante
    switch (maxDesafio.clave) {
      case "recursos_limitados":
        mensaje = "Esto indica que muchas empresas se enfrentan a restricciones en recursos, lo que puede limitar las inversiones en mejoras y capacitación.";
        this.listaDesafios.push({mensaje: mensaje});
        break;
      case "dificultad_adaptar_estandares":
        mensaje = "Esto sugiere que la adopción de estándares de calidad se percibe como complicada, requiriendo asesoría o metodologías específicas para facilitar su implementación.";
        this.listaDesafios.push({mensaje: mensaje});
        break;
      case "falta_conocimiento":
        mensaje = "Esto refleja una brecha importante en la formación y conocimiento sobre prácticas de calidad, lo que resalta la necesidad de capacitaciones especializadas.";
        this.listaDesafios.push({mensaje: mensaje});
        break;
      case "falta_personal_capacitado":
        mensaje = "Indica que la ausencia de personal especializado puede estar limitando la correcta implementación de las prácticas de calidad.";
        this.listaDesafios.push({mensaje: mensaje});
        break;
      case "resistencia_cambio":
        mensaje = "Se evidencia que la resistencia al cambio es un factor significativo, sugiriendo la necesidad de trabajar en la cultura organizacional y en estrategias de gestión del cambio.";
        this.listaDesafios.push({mensaje: mensaje});
        break;
      case "dificultad_metodologias":
        mensaje = "La baja mención de dificultades en metodologías sugiere que, en general, este aspecto no se percibe como el principal obstáculo, aunque puede ser relevante en contextos específicos.";
        this.listaDesafios.push({mensaje: mensaje});
        break;
      default:
        break;
    }
  
    // Agregar un resumen de la distribución completa
    mensaje = "\nDistribución completa de desafíos: ";
    mensaje += desafiosArray.map(desafio => `${desafio.label}: ${desafio.valor}`).join(", ") + ".";

    this.listaDesafios.push({mensaje: mensaje});
  }

  calcularEsfuerzoGlobal() {
    let metricaEsfuerzoGlobal: MetricaEsfuerzo = {
      menor5: 0,
      entre510: 0,
      entre1015: 0,
      entre1520: 0,
      mayor20: 0
    };

    this.listaPreguntasEsfuerzo[0].questions.forEach((pregunta) => {
      let valorCalidad = pregunta.matrix.calidad;

      if (valorCalidad<5) {
        metricaEsfuerzoGlobal.menor5++;
      }else if (valorCalidad>=5 && valorCalidad<10) {
        metricaEsfuerzoGlobal.entre510++;
      }
      else if (valorCalidad>=10 && valorCalidad<15) {
        metricaEsfuerzoGlobal.entre1015++;
      }
      else if (valorCalidad>=15 && valorCalidad<20) {
        metricaEsfuerzoGlobal.entre1520++;
      }
      else if (valorCalidad>=20) {
        metricaEsfuerzoGlobal.mayor20++;
      }
    });

    console.log("esfuerzo",metricaEsfuerzoGlobal);

    //Graficar el esfuerzo global
    this.crearGraficoEsfuerzoGlobal(metricaEsfuerzoGlobal);

    // Interpretar el esfuerzo

    this.interpretarEsfuerzoGlobal(metricaEsfuerzoGlobal);


  }  

  interpretarEsfuerzoGlobal(metrica: MetricaEsfuerzo) {
    const total = metrica.menor5 + metrica.entre510 + metrica.entre1015 +
                  metrica.entre1520 + metrica.mayor20;
  
    // Caso especial: no hay datos
    if (total === 0) {
      this.listaEsfuerzo.push({mensaje: "No se registran empresas en ninguno de los rangos, posiblemente no hay datos."}); 
    }
  
    // Crear un arreglo para identificar el rango dominante y/o distribución
    const rangos = [
      { rango: "<5%", valor: metrica.menor5 },
      { rango: "5-10%", valor: metrica.entre510 },
      { rango: "10-15%", valor: metrica.entre1015 },
      { rango: "15-20%", valor: metrica.entre1520 },
      { rango: ">20%", valor: metrica.mayor20 }
    ];
  
    // Ordenar de mayor a menor para detectar el más representativo
    rangos.sort((a, b) => b.valor - a.valor);
  
    // El rango con mayor valor
    const maxRango = rangos[0];
  
    // Calcular el porcentaje que representa el rango mayor
    const porcentajeMax = ((maxRango.valor / total) * 100).toFixed(1);
  
    // Mensaje base
    let mensaje = `Se han contabilizado ${total} empresas. `;

    this.listaEsfuerzo.push({mensaje: mensaje});
  
    // Si la mayoría (o el mayor porcentaje) está en un solo rango:
    if (maxRango.valor > 0) {
      mensaje = `La mayor concentración de empresas (${porcentajeMax}% del total) `;
      mensaje += `se ubica en el rango de esfuerzo en calidad de ${maxRango.rango}. `;
      this.listaEsfuerzo.push({mensaje: mensaje});
    }
  
    // Podemos agregar interpretaciones más específicas según el rango mayor:
    switch (maxRango.rango) {
      case "<5%":
          this.listaEsfuerzo.push({mensaje: InterpretacionEsfuerzo.menor5});
        break;
      case "5-10%":
          this.listaEsfuerzo.push({mensaje: InterpretacionEsfuerzo.entre5y10});
        break;
      case "10-15%":
          this.listaEsfuerzo.push({mensaje: InterpretacionEsfuerzo.entre10y15});
        break;
      case "15-20%":
          this.listaEsfuerzo.push({mensaje: InterpretacionEsfuerzo.entre15y20});
        break;
      case ">20%":
          this.listaEsfuerzo.push({mensaje: InterpretacionEsfuerzo.mayor20});
        break;
    }
  
  }


  calcularCalidadGlobal() {

    
    let listaPreguntasMetricas:question [] = this.listaPreguntasCalidadGlobal[0].questions;

    let cantidadEncuestas = listaPreguntasMetricas.length / 3;


    let metricaGlobalGestion: MetricaResponse = {
      noImplementada: 0,
      implementacionInicial: 0,
      implementacionParcial: 0,
      implementacionAvanzada: 0,
      implementacionOptimizad: 0,
      totalImplementacion: 0,
      tamanioMatrix: 0,
    };

    let metricaGlobalControl: MetricaResponse = {
      noImplementada: 0,
      implementacionInicial: 0,
      implementacionParcial: 0,
      implementacionAvanzada: 0,
      implementacionOptimizad: 0,
      totalImplementacion: 0,
      tamanioMatrix: 0,
    };

    let metricaGlobalAseguramiento: MetricaResponse = {
      noImplementada: 0,
      implementacionInicial: 0,
      implementacionParcial: 0,
      implementacionAvanzada: 0,
      implementacionOptimizad: 0,
      totalImplementacion: 0,
      tamanioMatrix: 0,
    };

    for (let i = 0; i < listaPreguntasMetricas.length; i++) {
      if (listaPreguntasMetricas[i].metrica) {
        if(listaPreguntasMetricas[i].question == "¿Cuál es el nivel de aplicación de las siguientes prácticas de gestión de calidad en sus proyectos?"){
          metricaGlobalGestion = this.calcularMetricas(listaPreguntasMetricas[i].metrica, metricaGlobalGestion);
          metricaGlobalGestion.tamanioMatrix = listaPreguntasMetricas[i].metrica.tamanioMatrix;
          this.listaPracticasTotal.push(listaPreguntasMetricas[i].matrix);
        }
        else if(listaPreguntasMetricas[i].question == "¿Cuál es el nivel de aplicación de las siguientes prácticas de control de calidad en sus proyectos?"){
          metricaGlobalControl = this.calcularMetricas(listaPreguntasMetricas[i].metrica, metricaGlobalControl);
          metricaGlobalControl.tamanioMatrix = listaPreguntasMetricas[i].metrica.tamanioMatrix;
          this.listaPracticasTotal.push(listaPreguntasMetricas[i].matrix);
        }
        else if(listaPreguntasMetricas[i].question == "¿Cuál es el nivel de aplicación de las siguientes prácticas de aseguramiento de calidad en sus proyectos?"){
          metricaGlobalAseguramiento = this.calcularMetricas(listaPreguntasMetricas[i].metrica, metricaGlobalAseguramiento);
          metricaGlobalAseguramiento.tamanioMatrix = listaPreguntasMetricas[i].metrica.tamanioMatrix;
          this.listaPracticasTotal.push(listaPreguntasMetricas[i].matrix);
        }

      }

    }

    metricaGlobalGestion = this.calcularTotalMetrica(metricaGlobalGestion);
    metricaGlobalControl = this.calcularTotalMetrica(metricaGlobalControl);
    metricaGlobalAseguramiento = this.calcularTotalMetrica(metricaGlobalAseguramiento);    

    metricaGlobalGestion.totalImplementacion = metricaGlobalGestion.noImplementada + metricaGlobalGestion.implementacionInicial + metricaGlobalGestion.implementacionParcial + metricaGlobalGestion.implementacionAvanzada + metricaGlobalGestion.implementacionOptimizad;
    metricaGlobalGestion.totalImplementacion = metricaGlobalGestion.totalImplementacion / cantidadEncuestas;
    metricaGlobalControl.totalImplementacion = metricaGlobalControl.noImplementada + metricaGlobalControl.implementacionInicial + metricaGlobalControl.implementacionParcial + metricaGlobalControl.implementacionAvanzada + metricaGlobalControl.implementacionOptimizad;
    metricaGlobalControl.totalImplementacion = metricaGlobalControl.totalImplementacion / cantidadEncuestas;
    metricaGlobalAseguramiento.totalImplementacion = metricaGlobalAseguramiento.noImplementada + metricaGlobalAseguramiento.implementacionInicial + metricaGlobalAseguramiento.implementacionParcial + metricaGlobalAseguramiento.implementacionAvanzada + metricaGlobalAseguramiento.implementacionOptimizad;
    metricaGlobalAseguramiento.totalImplementacion = metricaGlobalAseguramiento.totalImplementacion / cantidadEncuestas;
    this.metricaGlobal = [metricaGlobalGestion, metricaGlobalControl, metricaGlobalAseguramiento];

    this.crearGraficos(this.metricaGlobal);
  }

    calcularMetricas(answer: MetricaResponse, metrica: MetricaResponse): MetricaResponse {  

      metrica = {
        noImplementada: metrica.noImplementada + answer.noImplementada,
        implementacionInicial: metrica.implementacionInicial + answer.implementacionInicial,
        implementacionParcial: metrica.implementacionParcial + answer.implementacionParcial,
        implementacionAvanzada: metrica.implementacionAvanzada + answer.implementacionAvanzada,
        implementacionOptimizad: metrica.implementacionOptimizad + answer.implementacionOptimizad,
        tamanioMatrix: metrica.tamanioMatrix,
        totalImplementacion: 0,
      };
      return metrica;
  }

  calcularTotalMetrica(metrica: MetricaResponse): MetricaResponse {

    metrica ={
      noImplementada: metrica.noImplementada / metrica.tamanioMatrix,
      implementacionInicial: metrica.implementacionInicial / metrica.tamanioMatrix,
      implementacionParcial: metrica.implementacionParcial / metrica.tamanioMatrix,
      implementacionAvanzada: metrica.implementacionAvanzada / metrica.tamanioMatrix,
      implementacionOptimizad: metrica.implementacionOptimizad / metrica.tamanioMatrix,
      tamanioMatrix: metrica.tamanioMatrix,
      totalImplementacion: 0,
    }

    return metrica;

  }

    
  crearGraficos(listaMatrix: MetricaResponse[]) {
    listaMatrix.forEach((metrica, index) => {
      this.crearGrafico(metrica, index);
      // Pasar ambos valores al método crearGraficoImplementacionTotal

    });
  }

  crearGrafico(metrica: MetricaResponse, index: number) {
    // Etiquetas y valores
    const labels = ["nivel 1", "nivel 2", "nivel 3", "nivel 4", "nivel 5"];
    const values = [
      metrica.noImplementada,
      metrica.implementacionInicial,
      metrica.implementacionParcial,
      metrica.implementacionAvanzada,
      metrica.implementacionOptimizad
    ];
  
    // Destruir el gráfico existente si existe
    if (index === 0 && this.calidadChart1) {
      this.calidadChart1.destroy();
    } else if (index === 1 && this.calidadChart2) {
      this.calidadChart2.destroy();
    } else if (index === 2 && this.calidadChart3) {
      this.calidadChart3.destroy();
    }
  
    // Crear la instancia del gráfico de barras vertical
    const chart = new Chart(
      index === 0 ? this.calidadChartCanvas1.nativeElement :
      index === 1 ? this.calidadChartCanvas2.nativeElement :
      this.calidadChartCanvas3.nativeElement,
      {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Número de prácticas por nivel de implementación',
              data: values,
              // Usamos una paleta de colores similar para todas las barras
              backgroundColor: [
                '#1976D2',
                '#2196F3',
                '#03A9F4',
                '#BBDEFB',
                '#BDBDBD'
              ],
              borderColor: 'rgba(0, 0, 0, 1)',
              borderWidth: 1,
              barThickness: 40
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: this.obtenerTituloGrafico(index),
              font: {
                size: 16,
                weight: 'bold'
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `Promedio de prácticas por nivel de implementación: ${context.raw}`;
                }
              }
            },
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: Math.max(...values) + 1,
              title: {
                display: true,
                text: 'Número de prácticas por nivel'
              },
              ticks: {
                font: {
                  size: 12
                }
              }
            },
            x: {
              title: {
                display: true,
                text: 'Nivel de implementación de prácticas (1-5)'
              },
              ticks: {
                font: {
                  size: 12
                }
              }
            }
          }
        }
      }
    );
  
    // Guardar la referencia al gráfico
    if (index === 0) {
      this.calidadChart1 = chart;
    } else if (index === 1) {
      this.calidadChart2 = chart;
    } else if (index === 2) {
      this.calidadChart3 = chart;
    }
  }


  obtenerTituloGrafico(index: number): string {
    switch (index) {
      case 0:
        return 'Distribución del nivel de implementación de prácticas';
      case 1:
        return 'Distribución del nivel de implementación de prácticas';
      case 2:
        return 'Distribución del nivel de implementación de prácticas';
      default:
        return '';
    }
  }
  


  obtenerTituloImplementacion(index: number): string {
    switch (index) {
      case 0:
        return 'Comparación de las prácticas de gestión de calidad';
      case 1:
        return 'Comparación de las prácticas de control de calidad';
      case 2:
        return 'Comparación de lad prácticas de aseguramiento de calidad';
      default:
        return '';
    }
  }

  crearGraficoEsfuerzoGlobal(metrica: MetricaEsfuerzo) {
    // Etiquetas y valores
    const labels = [
      '<5%',
      '5-10%',
      '10-15%',
      '15-20%',
      '≥20%'
    ];
  
    const values = [
      metrica.menor5,
      metrica.entre510,
      metrica.entre1015,
      metrica.entre1520,
      metrica.mayor20
    ];
  
    // Destruir el gráfico existente si existe
    if (this.calidadEsfuerzo) {
      this.calidadEsfuerzo.destroy();
    }
  
    // Crear la instancia del gráfico de barras vertical
    this.calidadEsfuerzo = new Chart(this.calidadChartEsfuerzo.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Número de empresas',
            data: values,
            // Usar la misma paleta de colores que en las otras gráficas
            backgroundColor: [
              '#1976D2',
                '#2196F3',
                '#03A9F4',
                '#BBDEFB',
                '#BDBDBD'
            ],
            borderColor: 'rgba(0, 0, 0, 1)',
            borderWidth: 1,
            barThickness: 40 // Grosor de las barras
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Grado de esfuerzo poblacional',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Número de empresas: ${context.raw}`;
              }
            }
          },
          legend: {
            display: false // Oculta la leyenda (en este caso innecesaria)
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: Math.max(...values) + 1,
            title: {
              display: true,
              text: 'Número de empresas'
            },
            ticks: {
              font: {
                size: 12
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Rango de esfuerzo dedicado a calidad (%)'
            },
            ticks: {
              font: {
                size: 12
              }
            }
          }
        }
      }
    });
  }

  // Crear gráfico de desafíos globales
  crearGraficoDesafiosGlobal(metrica: MetricaDesafios) {
    // Etiquetas y valores
    const labels = [
      'Recursos limitados',
      'Dificultad para adaptar estándares',
      'Falta de conocimiento',
      'Falta de personal capacitado',
      'Resistencia al cambio',
      'Dificultad metodológica'
    ];
  
    const values = [
      metrica.recursos_limitados,
      metrica.dificultad_adaptar_estandares,
      metrica.falta_conocimiento,
      metrica.falta_personal_capacitado,
      metrica.resistencia_cambio,
      metrica.dificultad_metodologias
    ];
  
    // Destruir el gráfico existente si existe
    if (this.calidadChartDesafios) {
      this.calidadChartDesafios.destroy();
    }
  
    // Crear la instancia del gráfico de barras vertical
    this.calidadChartDesafios = new Chart(this.calidadChartDesafiosCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Frecuencia',
            data: values,
            backgroundColor: [
              '#1976D2',
                '#2196F3',
                '#03A9F4',
                '#BBDEFB',
                '#BDBDBD',
              '#5e3c58'
            ],
            borderColor: 'rgba(0, 0, 0, 1)',
            borderWidth: 1,
            barThickness: 40
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Desafíos en la implementación de prácticas de calidad',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Frecuencia: ${context.raw}`;
              }
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: Math.max(...values) + 1,
            title: {
              display: true,
              text: 'Número de empresas'
            },
            ticks: {
              font: {
                size: 12
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Desafíos'
            },
            ticks: {
              font: {
                size: 12
              }
            }
          }
        }
      }
    });
  }


  regresar() {
    window.history.back();
  }


}
