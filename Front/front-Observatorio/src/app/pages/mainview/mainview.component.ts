import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { EncuestaResponse } from 'src/app/core/models/responseQuestions.models';
import { AuthService } from 'src/app/core/services/login/auth.service';
import { QuestionService } from 'src/app/core/services/question/question.service';

@Component({
  selector: 'app-mainview',
  templateUrl: './mainview.component.html',
  styleUrls: ['./mainview.component.css']
})
export class MainviewComponent implements OnInit {

  usuario: any;
  listaEncuestas: EncuestaResponse[] = [];

  // ✅ Variables agregadas
  mostrarBotonEncuesta: boolean = true;
  fechaEncuestaRealizada: string = '';
  fechaHabilitadaProxima: string = '';
  loading = false;

  constructor(
    private readonly questionService: QuestionService,
    private readonly formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) { }

  async ngOnInit() {
    this.loading = true;
    await this.usuarioTieneEncuesta();
    await this.consultarEncuestas();
    this.loading = false;

  }

  async usuarioTieneEncuesta() {
    return new Promise((resolve) => {
      this.authService.consultarUsuarioPorToken().subscribe({
        next: (response) => {
          this.usuario = response;
          resolve(response);
        },
        error: (error) => {
          console.error('Error al consultar el usuario:', error);
          resolve(error);
        }
      });
    });
  }

  async consultarEncuestas() {
    await this.questionService.getEncuestasPorUsuario(this.usuario.id).then((response) => {
      this.listaEncuestas = response;

      const encuestaEsteAnio = this.listaEncuestas.find((encuesta) => {
        const fecha = new Date(encuesta.fechaCreacion);
        return fecha.getFullYear() === new Date().getFullYear();
      });

      if (encuestaEsteAnio) {
        this.mostrarBotonEncuesta = false;

        const fechaRealizacion = new Date(encuestaEsteAnio.fechaCreacion);
        this.fechaEncuestaRealizada = this.formatDate(encuestaEsteAnio.fechaCreacion);

        // Próxima fecha habilitada (mismo día pero año siguiente)
        const fechaProxima = new Date(fechaRealizacion);
        fechaProxima.setFullYear(fechaRealizacion.getFullYear() + 1);
        this.fechaHabilitadaProxima = this.formatDate(fechaProxima.toISOString());
      }

    }).catch((error) => {
      console.error('Error al consultar la encuesta:', error);
    });
  }

  generarResultados(idEncuesta: number) {
    this.router.navigate(['/resultados', idEncuesta]);
  }

  // ✅ Método para formatear la fecha
  formatDate(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  startSurvey() {
    console.log('Starting survey');
  }

}
