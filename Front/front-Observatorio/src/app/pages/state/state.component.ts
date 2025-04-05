

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Chart, CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend } from 'chart.js';
import { conclusionesEvaluacionCalidad } from 'src/app/core/enums/observatorio.enum';
import { Answer, MatrixAnswer, MetricaMatrix } from 'src/app/core/models/requestQuestions.models';
import { PreguntaResponse, question, MetricaResponse, MetricaEsfuerzo, MetricaDesafios } from 'src/app/core/models/responseQuestions.models';
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
  conclusionesEvaluacion: string[] = [];
  conclusionesEvaluacionGlobal: string[] = [];
  encuestaId = 0;
  mostrarGrafica = false;
  averagedMetricsGlobal: { [question: string]: { [variable: string]: number } } = {};

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

    await this.cargarDatos();
  }

  async cargarDatos() {

    await this.questionService.getPreguntasPorCategoria('preguntasCalidad').then((res) => {
      this.listaPreguntasCalidadGlobal = res as PreguntaResponse[];
    });

    console.log(this.listaPreguntasCalidadGlobal);

    await this.questionService.getPreguntasPorCategoria('preguntasEsfuerzo').then((res) => {
      this.listaPreguntasEsfuerzo = res as PreguntaResponse[];
    });

    console.log(this.listaPreguntasEsfuerzo);

    await this.questionService.getPreguntasPorCategoria('preguntasDesafios').then((res) => {
      this.listaPreguntasDesafios = res as PreguntaResponse[];
    });

    console.log(this.listaPreguntasDesafios);


    this.calcularCalidadGlobal();

    this.calcularEsfuerzoGlobal();

    this.calcularDesafiosGlobal();


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
        if(listaPreguntasMetricas[i].question == "¿Con qué frecuencia se aplican las siguientes prácticas de gestión de calidad en sus proyectos?"){
          metricaGlobalGestion = this.calcularMetricas(listaPreguntasMetricas[i].metrica, metricaGlobalGestion);
          metricaGlobalGestion.tamanioMatrix = listaPreguntasMetricas[i].metrica.tamanioMatrix;
        }
        else if(listaPreguntasMetricas[i].question == "¿Con qué frecuencia se aplican las siguientes prácticas de control de calidad en sus proyectos?"){
          metricaGlobalControl = this.calcularMetricas(listaPreguntasMetricas[i].metrica, metricaGlobalControl);
          metricaGlobalControl.tamanioMatrix = listaPreguntasMetricas[i].metrica.tamanioMatrix;
        }
        else if(listaPreguntasMetricas[i].question == "¿Con qué frecuencia se aplican las siguientes prácticas de aseguramiento de calidad en sus proyectos?"){
          metricaGlobalAseguramiento = this.calcularMetricas(listaPreguntasMetricas[i].metrica, metricaGlobalAseguramiento);
          metricaGlobalAseguramiento.tamanioMatrix = listaPreguntasMetricas[i].metrica.tamanioMatrix;
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
    const listaMatrix = [metricaGlobalGestion, metricaGlobalControl, metricaGlobalAseguramiento];

    this.crearGraficos(listaMatrix);
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
    const labels = [
      "1",
      "2",
      "3",
      "4",
      "5"
    ];
  
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
              backgroundColor: [
                '#ffc7ff',
                '#dd9ddc',
                '#ba74b9',
                '#984a97',
                '#752174'
              ],
              borderColor: 'rgba(0, 0, 0, 1)',
              barThickness: 40, // Ajustar el grosor de las barras
              borderWidth: 1, // Ajustar el grosor de las barras
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: this.obtenerTitulo(index),
              font: {
                size: 14, // Ajustar el tamaño de la fuente del título
                weight: 'bold' // Hacer el título más grueso
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
              display: false // Deshabilitar la leyenda
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: Math.max(...values) + 1,
              ticks: {
                font: {
                  size: 12 // Ajustar el tamaño de la fuente de los ejes
                }
              }
            },
            x: {
              ticks: {
                font: {
                  size: 12 // Ajustar el tamaño de la fuente de los ejes
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

  obtenerTitulo(index: number): string {
    switch (index) {
      case 0:
        return 'Grado de implementación poblacional';
      case 1:
        return 'Grado de implementación poblacional';
      case 2:
        return 'Grado de implementación poblacional';
      default:
        return '';
    }
  }


  obtenerTituloImplementacion(index: number): string {
    switch (index) {
      case 0:
        return 'Comparación del grado de implementación';
      case 1:
        return 'Comparación del grado de implementación';
      case 2:
        return 'Comparación del grado de implementación';
      default:
        return '';
    }
  }

  // Crear gráfico de esfuerzo global
  crearGraficoEsfuerzoGlobal(metrica: MetricaEsfuerzo) {
    // Etiquetas y valores
    const labels = [
      'Menor a 5',
      'Entre 5 y 10',
      'Entre 10 y 15',
      'Entre 15 y 20',
      'Mayor a 20'
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
            label: 'Frecuencia',
            data: values,
            backgroundColor: [
              '#ffc7ff',
              '#dd9ddc',
              '#ba74b9',
              '#984a97',
              '#752174'
            ],
            borderColor: 'rgba(0, 0, 0, 1)',
            barThickness: 40, // Ajustar el grosor de las barras
            borderWidth: 1, // Ajustar el grosor de las barras
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
              size: 14, // Ajustar el tamaño de la fuente del título
              weight: 'bold' // Hacer el título más grueso
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
            display: false // Deshabilitar la leyenda
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: Math.max(...values) + 1,
            ticks: {
              font: {
                size: 12 // Ajustar el tamaño de la fuente de los ejes
              }
            }
          },
          x: {
            ticks: {
              font: {
                size: 12 // Ajustar
                // el tamaño de la fuente de los ejes
                // y el color de las etiquetas
                // color: '#000000' // Cambiar el color de las etiquetas
                // fontColor: '#000000' // Cambiar el color de las etiquetas
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
      'Dificultad para adaptar estándares de calidad internacionales',
      'Falta de conocimiento',
      'Falta de personal capacitado o especializado',
      'Resistencia al cambio',
      'Dificultad para encontrar metodologías'
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
              '#ffc7ff',
              '#dd9ddc',
              '#ba74b9',
              '#984a97',
              '#752174'
            ],
            borderColor: 'rgba(0, 0, 0, 1)',
            barThickness: 40, // Ajustar el grosor de las barras
            borderWidth: 1, // Ajustar el grosor de las barras
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Desafíos globales en la implementación de prácticas de calidad',
            font: {
              size: 14, // Ajustar el tamaño de la fuente del título
              weight: 'bold' // Hacer el título más grueso
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
            display: false // Deshabilitar la leyenda
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: Math
.max(...values) + 1,
            ticks: {
              font: {
                size: 12 // Ajustar el tamaño de la fuente de los ejes
              }
            }
          },
          x: {
            ticks: {
              font: {
                size: 12 // Ajustar el tamaño de la fuente de los ejes
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
