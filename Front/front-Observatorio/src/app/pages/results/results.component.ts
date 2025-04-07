import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Chart, CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend } from 'chart.js';
import { conclusionesEvaluacionCalidad, recomendacionesAseguramiento, recomendacionesControl, recomendacionesGestion } from 'src/app/core/enums/observatorio.enum';
import { Answer, MatrixAnswer, MetricaMatrix } from 'src/app/core/models/requestQuestions.models';
import { PreguntaResponse, question, MetricaResponse, listaConclusiones } from 'src/app/core/models/responseQuestions.models';
import { listaPracticas } from 'src/app/core/models/results.model';
import { AuthService } from 'src/app/core/services/login/auth.service';
import { QuestionService } from 'src/app/core/services/question/question.service';

  // Registrar los componentes de Chart.js que se usarán
  Chart.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  formGroup!: FormGroup;
  listaPreguntasEsfuerzo: PreguntaResponse[] = [];
  listaPreguntasCalidad: PreguntaResponse[] = [];
  listaPreguntasCalidadGlobal: PreguntaResponse[] = [];
  listaPreguntasGenerales: PreguntaResponse[] = [];
  conclusionesEvaluacion: string[] = [];
  conclusionesEvaluacionGlobal: string[] = [];
  encuestaId = 0;
  mostrarGrafica = false;
  averagedMetricsGlobal: { [question: string]: { [variable: string]: number } } = {};
  listaConclusiones: listaConclusiones[] = [];

  //listas Interpretacion

  listaPracticasGestion: listaPracticas[] = [];
  listaPracticasControl: listaPracticas[] = [];
  listaPracticasAseguramiento: listaPracticas[] = [];

  metricaIndividual: any[]=[];
  metricaGlobal: any[]=[];

  //Calidad Individual
  calidadChart1!: Chart;
  calidadChart2!: Chart;
  calidadChart3!: Chart;
  implementacionChart1!: Chart;
  implementacionChart2!: Chart;
  implementacionChart3!: Chart;
  @ViewChild('calidadChartCanvas1') calidadChartCanvas1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('calidadChartCanvas2') calidadChartCanvas2!: ElementRef<HTMLCanvasElement>;
  @ViewChild('calidadChartCanvas3') calidadChartCanvas3!: ElementRef<HTMLCanvasElement>;
  @ViewChild('implementacionTotal1') implementacionTotal1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('implementacionTotal2') implementacionTotal2!: ElementRef<HTMLCanvasElement>;
  @ViewChild('implementacionTotal3') implementacionTotal3!: ElementRef<HTMLCanvasElement>;


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
      this.encuestaId = params?.['id'] ?? 0;
    });
    await this.cargarDatos();
  }

  async cargarDatos() {
    await this.questionService.getPreguntasPorIdEncuesta('preguntasCalidad', this.encuestaId).then((res) => {
      this.listaPreguntasCalidad = res as PreguntaResponse[];
    });



    await this.questionService.getPreguntasPorCategoria('preguntasCalidad').then((res) => {
      this.listaPreguntasCalidadGlobal = res as PreguntaResponse[];
    });


    //este orfen es importante, se grafica la calidad indivuidual

    this.calculoGlobal();

    this.calculoindividual();

    this.recomendacionesEvaluacionCalidad();

    this.tablaInterpretaciones();
    
    
  }
    
  tablaInterpretaciones() {

    console.log("lista practicas:", this.listaPracticasGestion); 
    
  }

  calculoGlobal() {
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
      totalImplementacionIndividual: 0,
    };

    let metricaGlobalControl: MetricaResponse = {
      noImplementada: 0,
      implementacionInicial: 0,
      implementacionParcial: 0,
      implementacionAvanzada: 0,
      implementacionOptimizad: 0,
      totalImplementacion: 0,
      tamanioMatrix: 0,
      totalImplementacionIndividual: 0,
    };

    let metricaGlobalAseguramiento: MetricaResponse = {
      noImplementada: 0,
      implementacionInicial: 0,
      implementacionParcial: 0,
      implementacionAvanzada: 0,
      implementacionOptimizad: 0,
      totalImplementacion: 0,
      tamanioMatrix: 0,
      totalImplementacionIndividual: 0,
    };

    for (let i = 0; i < listaPreguntasMetricas.length; i++) {
      if (listaPreguntasMetricas[i].metrica) {
        if(listaPreguntasMetricas[i].question == "¿Cuál es el nivel de aplicación de las siguientes prácticas de gestión de calidad en sus proyectos?"){
          metricaGlobalGestion = this.calcularMetricas(listaPreguntasMetricas[i].metrica, metricaGlobalGestion);
          metricaGlobalGestion.tamanioMatrix = listaPreguntasMetricas[i].metrica.tamanioMatrix;
        }
        else if(listaPreguntasMetricas[i].question == "¿Cuál es el nivel de aplicación de las siguientes prácticas de control de calidad en sus proyectos?"){
          metricaGlobalControl = this.calcularMetricas(listaPreguntasMetricas[i].metrica, metricaGlobalControl);
          metricaGlobalControl.tamanioMatrix = listaPreguntasMetricas[i].metrica.tamanioMatrix;
        }
        else if(listaPreguntasMetricas[i].question == "¿Cuál es el nivel de aplicación de las siguientes prácticas de aseguramiento de calidad en sus proyectos?"){
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

    metricaGlobalGestion.totalImplementacionIndividual = this.listaPreguntasCalidad[0].questions[0].metrica?.totalImplementacion || 0;
    metricaGlobalControl.totalImplementacionIndividual = this.listaPreguntasCalidad[0].questions[1].metrica?.totalImplementacion || 0;
    metricaGlobalAseguramiento.totalImplementacionIndividual = this.listaPreguntasCalidad[0].questions[2].metrica?.totalImplementacion || 0;

    this.metricaGlobal = [metricaGlobalGestion, metricaGlobalControl, metricaGlobalAseguramiento];

    // this.crearGraficos(listaMatrix);

  }

  calculoindividual() {

    let listaPreguntasMetricas:question [] = this.listaPreguntasCalidad[0].questions;
  

    let metricaIndividualGestion: MetricaResponse = {
      noImplementada: 0,
      implementacionInicial: 0,
      implementacionParcial: 0,
      implementacionAvanzada: 0,
      implementacionOptimizad: 0,
      totalImplementacion: 0,
      tamanioMatrix: 0,
      totalImplementacionIndividual: 0,
    };

    let metricaIndividualControl: MetricaResponse = {
      noImplementada: 0,
      implementacionInicial: 0,
      implementacionParcial: 0,
      implementacionAvanzada: 0,
      implementacionOptimizad: 0,
      totalImplementacion: 0,
      tamanioMatrix: 0,
      totalImplementacionIndividual: 0,
    };

    let metricaIndividualAseguramiento: MetricaResponse = {
      noImplementada: 0,
      implementacionInicial: 0,
      implementacionParcial: 0,
      implementacionAvanzada: 0,
      implementacionOptimizad: 0,
      totalImplementacion: 0,
      tamanioMatrix: 0,
      totalImplementacionIndividual: 0,
    };


    for (let i = 0; i < listaPreguntasMetricas.length; i++) {
      console.log("linea 226",listaPreguntasMetricas[i]);
      if (listaPreguntasMetricas[i].metrica) {
        if(listaPreguntasMetricas[i].question == "¿Cuál es el nivel de aplicación de las siguientes prácticas de gestión de calidad en sus proyectos?"){
          metricaIndividualGestion = listaPreguntasMetricas[i].metrica;
          this.listaPracticasGestion = listaPreguntasMetricas[i].matrix; 
        }
        else if(listaPreguntasMetricas[i].question == "¿Cuál es el nivel de aplicación de las siguientes prácticas de control de calidad en sus proyectos?"){
          metricaIndividualControl = listaPreguntasMetricas[i].metrica;
          this.listaPracticasControl = listaPreguntasMetricas[i].matrix;

        }
        else if(listaPreguntasMetricas[i].question == "¿Cuál es el nivel de aplicación de las siguientes prácticas de aseguramiento de calidad en sus proyectos?"){
          metricaIndividualAseguramiento = listaPreguntasMetricas[i].metrica;
          this.listaPracticasAseguramiento = listaPreguntasMetricas[i].matrix;

        }

      }

    }

    this.metricaIndividual = [metricaIndividualGestion, metricaIndividualControl, metricaIndividualAseguramiento];

    for (let i = 0; i < this.metricaIndividual.length; i++) {
      this.metricaIndividual[i].totalImplementacionIndividual = this.metricaIndividual[i].totalImplementacion;
      this.metricaIndividual[i].totalImplementacion = this.metricaGlobal[i].totalImplementacion;
    }

    this.crearGraficos(this.metricaIndividual);


  }




  recomendacionesEvaluacionCalidad() {

    console.log(this.metricaIndividual);
    
    this.metricaIndividual.forEach((metrica, index) => {
      let recomendacion = '';
      let area = '';
      if (index === 0) {
        area = 'Gestión de calidad';
        if ((metrica.totalImplementacionIndividual ?? 0) <= 2) {
          recomendacion = recomendacionesGestion.entre12;
        } else if ((metrica.totalImplementacionIndividual ?? 0) <= 3) {
          recomendacion = recomendacionesGestion.entre23;
        } else if ((metrica.totalImplementacionIndividual ?? 0) <= 4) {
          recomendacion = recomendacionesGestion.entre34;
        } else if ((metrica.totalImplementacionIndividual ?? 0) <= 5) {
          recomendacion = recomendacionesGestion.entre45;
        }

      } else if (index === 1) {
        area = 'Control de calidad';
        if ((metrica.totalImplementacionIndividual ?? 0) <= 2) {
          recomendacion = recomendacionesControl.entre12;
        } else if ((metrica.totalImplementacionIndividual ?? 0) <= 3) {
          recomendacion = recomendacionesControl.entre23;
        } else if ((metrica.totalImplementacionIndividual ?? 0) <= 4) {
          recomendacion = recomendacionesControl.entre34;
        }
        else if ((metrica.totalImplementacionIndividual ?? 0) <= 5) {
          recomendacion = recomendacionesControl.entre45;
        }        
      } else if (index === 2) {
        area = 'Aseguramiento de calidad';
        if ((metrica.totalImplementacionIndividual ?? 0) <= 2) {
          recomendacion = recomendacionesAseguramiento.entre12;
        } else if ((metrica.totalImplementacionIndividual ?? 0) <= 3) {
          recomendacion = recomendacionesAseguramiento.entre23;
        } else if ((metrica.totalImplementacionIndividual ?? 0) <= 4) {
          recomendacion = recomendacionesAseguramiento.entre34;
        } else if ((metrica.totalImplementacionIndividual ?? 0) <= 5) {
          recomendacion = recomendacionesAseguramiento.entre45;
        }
      }


      this.listaConclusiones.push({
        area: area,
        puntaje: metrica.totalImplementacionIndividual ?? 0,
        recomendacion: recomendacion
      });
    });      


    // this.listaConclusiones.push({
    //   area: "Gestión de calidad",
    //   puntaje: metricaGestion.totalImplementacionIndividual ?? 0,
    //   recomendacion: 'hola'
    // });
    // this.listaConclusiones.push({
    //   area: "Control de calidad",
    //   puntaje: metricaControl.totalImplementacionIndividual ?? 0,
    //   recomendacion: 'como'
    // });
    // this.listaConclusiones.push({
    //   area: "Aseguramiento de calidad",
    //   puntaje: metricaAseguramiento.totalImplementacionIndividual ?? 0,
    //   recomendacion: 'vas'
    // });

  }

  procesarRecomendaciones(metrica: MetricaResponse, recomendacionType: string): string {

    let recomendacion = '';

    if(metrica){

    if ((metrica.totalImplementacionIndividual ?? 0) <= 2) {
      recomendacion = recomendacionType
    } else if ((metrica.totalImplementacionIndividual ?? 0) <= 3) {
      recomendacion = conclusionesEvaluacionCalidad.inicial;
    } else if ((metrica.totalImplementacionIndividual ?? 0) <= 4) {
      recomendacion = conclusionesEvaluacionCalidad.parcial;
    } else if ((metrica.totalImplementacionIndividual ?? 0) <= 5) {
      recomendacion = conclusionesEvaluacionCalidad.avanzada;
    } else {
      recomendacion = conclusionesEvaluacionCalidad.total;
    }

  }

  return recomendacion;

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
      this.crearGraficoImplementacionTotal(
        metrica.totalImplementacion,
        //tener presente
        metrica.totalImplementacionIndividual || 0,
        index
      );
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
              label: 'Nivel promedio de implementación',
              data: values,
              backgroundColor: [
                '#1976D2',
                '#2196F3',
                '#03A9F4',
                '#BBDEFB',
                '#BDBDBD'
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
              title: {
                display: true,
                text: 'Número de prácticas por nivel'
              },
              ticks: {
                font: {
                  size: 12 // Ajustar el tamaño de la fuente de los ejes
                }
              }
            },
            x: {
              title: {
                display: true,
                text: 'Nivel de implementación (escala Likert)'
              },
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
  
  crearGraficoImplementacionTotal(totalImplementacion: number, totalImplementacionIndividual: number, index: number) {
    // Destruir el gráfico existente si existe
    if (index === 0 && this.implementacionChart1) {
      this.implementacionChart1.destroy();
    } else if (index === 1 && this.implementacionChart2) {
      this.implementacionChart2.destroy();
    } else if (index === 2 && this.implementacionChart3) {
      this.implementacionChart3.destroy();
    }
  
    // Crear la instancia del gráfico de implementación total
    const chart = new Chart(
      index === 0 ? this.implementacionTotal1.nativeElement.getContext('2d')! :
      index === 1 ? this.implementacionTotal2.nativeElement.getContext('2d')! :
      this.implementacionTotal3.nativeElement.getContext('2d')!,
      {
        type: 'bar',
        data: {
          labels: ['Población Global', 'Su Empresa'],
          datasets: [
            {
              label: 'Nivel de Implementación de las prácticas (1-5)',
              data: [totalImplementacion, totalImplementacionIndividual],
              backgroundColor: [
                '#4b0082', // Color para Población Global
                '#19306e'  // Color para Individual
              ],
              borderColor: 'rgb(120, 44, 44)',
              barThickness: 40, // Ajustar el grosor de las barras
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: this.obtenerTituloImplementacion(index),
              font: {
                size: 14, // Ajustar el tamaño de la fuente del título
                weight: 'bold' // Hacer el título más grueso
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  return `${label}: ${value}`;
                }
              }
            },
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Nivel promedio de implementación (escala Likert 1 a 5)'
              },
              beginAtZero: true,
              max: 5,
              ticks: {
                font: {
                  size: 12 // Ajustar el tamaño de la fuente de los ejes
                }
              }
            },
            x: {
              title: {
                display: true,
                text: 'Muestras evaluadas'
              },
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
      this.implementacionChart1 = chart;
    } else if (index === 1) {
      this.implementacionChart2 = chart;
    } else if (index === 2) {
      this.implementacionChart3 = chart;
    }
  }

  obtenerTitulo(index: number): string {
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
        return 'Comparación de las prácticas de aseguramiento de calidad';
      default:
        return '';
    }
  }

  regresar() {
    window.history.back();
  }


}