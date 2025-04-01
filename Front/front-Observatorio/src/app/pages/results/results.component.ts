import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Chart, CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend } from 'chart.js';
import { conclusionesEvaluacionCalidad } from 'src/app/core/enums/observatorio.enum';
import { PreguntaResponse, questions } from 'src/app/core/models/responseQuestions.models';
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
  listaPreguntasGenerales: PreguntaResponse[] = [];
  conclusionesEvaluacion: string[] = [];
  encuestaId = 0;

  calidadChart1!: Chart;
  calidadChart2!: Chart;
  calidadChart3!: Chart;

    // Instancias de Chart para los gráficos de implementación total
  implementacionChart1!: Chart;
  implementacionChart2!: Chart;
  implementacionChart3!: Chart;

  @ViewChild('calidadChartCanvas1') calidadChartCanvas1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('calidadChartCanvas2') calidadChartCanvas2!: ElementRef<HTMLCanvasElement>;
  @ViewChild('calidadChartCanvas3') calidadChartCanvas3!: ElementRef<HTMLCanvasElement>;

  // Referencias a los canvas de los gráficos de implementación total
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
    //Preguntas Calidad
    await this.questionService.getPreguntasPorIdEncuesta('preguntasCalidad', this.encuestaId).then((res) => {
      this.listaPreguntasCalidad = res as PreguntaResponse[];
    });

    // Obtener las tres preguntas matrix
    const matrixQuestions = this.listaPreguntasCalidad?.[0]?.questions?.slice(0, 3);

    // Calcular métricas para cada pregunta matrix
    matrixQuestions?.forEach((matrixQuestion, index) => {
      this.calcularMetricasMatrix(matrixQuestion, index);
    });


    //Preguntas esfuerzo
    // await this.questionService.getPreguntasPorCategoria('preguntasEsfuerzo').then((res) => {
    //   this.listaPreguntasEsfuerzo = res as PreguntaResponse[];
    //   console.log('Preguntas Esfuerzo 2:', this.listaPreguntasEsfuerzo);
    // });

  }


  calcularTotalImplementacion(frequencyCount: number[]): { frequencyCount: number[], totalImplementacion: number } {
    let contPracticas = 0;
    let contGrados = 0;

    frequencyCount.forEach((count, index) => {
      frequencyCount[index] = (index + 1) * count;
      const grado = index + 1;
      contPracticas += count;
      contGrados += grado * count;
    });

    const totalImplementacion = contPracticas > 0 ? contGrados / contPracticas : 0;

    return {
      frequencyCount,
      totalImplementacion
    };
  }

  calcularMetricasMatrix(matrixQuestion: questions | undefined, index: number) {
    let frecuenciaTexto = '';
    switch (index) {
      case 0:
        frecuenciaTexto = 'Frecuencia relativa del grado de implementación de prácticas de gestión de calidad';
        break;
      case 1:
        frecuenciaTexto = 'Frecuencia relativa del grado de implementación de prácticas de control de calidad';
        break;
      case 2:
        frecuenciaTexto = 'Frecuencia relativa del grado de implementación de prácticas de aseguramiento de calidad';
        break;
      default:
        break;
    }

    if (!matrixQuestion || matrixQuestion.type !== 'matrix') {
      console.warn('No hay pregunta matrix disponible para graficar');
      return;
    }

    const frequencyCount = [0, 0, 0, 0, 0]; // Índice 0-4 corresponden a los grados 1-5

    Object.values(matrixQuestion.matrix).forEach(level => {
      if (typeof level === 'number' && level >= 1 && level <= 5) {
        frequencyCount[level - 1]++;
      }
    });

    // Calcular la implementación y obtener el total
    const { frequencyCount: updatedFrequencyCount, totalImplementacion } = this.calcularTotalImplementacion(frequencyCount);

    // Asignar la conclusión según el total de implementación
    let conclusion = '';
    if (totalImplementacion < 1) {
      conclusion = conclusionesEvaluacionCalidad.baja;
    } else if (totalImplementacion < 2) {
      conclusion = conclusionesEvaluacionCalidad.inicial;
    } else if (totalImplementacion < 3) {
      conclusion = conclusionesEvaluacionCalidad.parcial;
    } else if (totalImplementacion < 4) {
      conclusion = conclusionesEvaluacionCalidad.avanzada;
    } else {
      conclusion = conclusionesEvaluacionCalidad.total;
    }

    // Almacenar la conclusión en el array
    if (index >= 0 && index < this.conclusionesEvaluacion.length) {
      this.conclusionesEvaluacion[index] = conclusion;
    } else {
      this.conclusionesEvaluacion.push(conclusion);
    }

    // Etiquetas y valores
    const labels = [
      "1 (No implementada)",
      "2 (Implementación inicial)",
      "3 (Implementación parcial)",
      "4 (Implementación avanzada)",
      "5 (Implementación optimizada)"
    ];

    const values = frequencyCount;

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
                'rgba(255, 99, 132, 0.8)', // Rojo
                'rgba(255, 159, 64, 0.8)', // Naranja
                'rgba(255, 205, 86, 0.8)', // Amarillo
                'rgba(75, 192, 192, 0.8)', // Verde
                'rgba(54, 162, 235, 0.8)'  // Azul
              ],
              borderColor: 'rgba(0, 0, 0, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: frecuenciaTexto,
              font: {
                size: 14
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
              max: Math.max(...values) + 1 // Ajustar el rango según la frecuencia máxima
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

    // Crear el gráfico de implementación total
    this.crearGraficoImplementacionTotal(totalImplementacion, index);
  }

  crearGraficoImplementacionTotal(totalImplementacion: number, index: number) {
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
          labels: ['Implementación Total'],
          datasets: [
            {
              label: 'Implementación Total',
              data: [totalImplementacion],
              backgroundColor: 'rgba(75, 192, 192, 0.8)', // Verde
              borderColor: 'rgba(0, 0, 0, 1)',
              barThickness: 100, 
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Implementación Total',
              font: {
                size: 14
              }
            },
            tooltip: {
              callbacks: {
                label: function(context: { raw: any; }) {
                  return `Implementación Total: ${context.raw}`;
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
              max: 5 // Ajustar el rango según la escala de implementación
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


  regresar() {
    window.history.back();
  }


}