

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Chart, CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend } from 'chart.js';
import { InterpretacionPracticasGestion, TituloPracticasAseguramiento, TituloPracticasControl, TituloPracticasGestion } from 'src/app/core/enums/interpretacion.enum';
import { conclusionesEvaluacionCalidad, recomendacionesAseguramiento, recomendacionesControl, recomendacionesGestion } from 'src/app/core/enums/observatorio.enum';
import { Answer, MatrixAnswer, MetricaMatrix } from 'src/app/core/models/requestQuestions.models';
import { PreguntaResponse, question, MetricaResponse, MetricaEsfuerzo, MetricaDesafios, listaConclusiones } from 'src/app/core/models/responseQuestions.models';
import { listaPracticas } from 'src/app/core/models/results.model';
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
          puntaje: metrica.totalImplementacion ?? 0,
          recomendacion: recomendacion
        });
      });      
  
    }

    tablaInterpretaciones() {

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
            [TituloPracticasAseguramiento.definicion_calidad_aseguramiento]: TituloPracticasAseguramiento.definicion_calidad_contenido,
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
          TituloPracticasAseguramiento.definicion_calidad_aseguramiento,
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
            if (item.hasOwnProperty(practica)) {
              const nivel = item[practica] as keyof typeof interpretacionNiveles;
              if (interpretacionNiveles[nivel]) {
                array.push({
                  practica: tituloPracticas[practica as keyof typeof tituloPracticas],
                  nivel: nivel,
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

    //Graficar los desafios globales
    this.crearGraficoDesafiosGlobal(metricaDesafios);

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

    //Graficar el esfuerzo global
    this.crearGraficoEsfuerzoGlobal(metricaEsfuerzoGlobal);


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
    const labels = ["1", "2", "3", "4", "5"];
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
              label: 'Frecuencia',
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
