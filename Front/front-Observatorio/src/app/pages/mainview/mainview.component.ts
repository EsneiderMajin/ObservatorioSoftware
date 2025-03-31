import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/login/auth.service';
import { QuestionService } from 'src/app/core/services/question/question.service';

@Component({
  selector: 'app-mainview',
  templateUrl: './mainview.component.html',
  styleUrls: ['./mainview.component.css']
})
export class MainviewComponent implements OnInit {

  usuario: any;
  mostrarResultados = false;

  constructor(
        private readonly questionService: QuestionService,
        private readonly formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService,
  ) { }

  async ngOnInit() {
    await this.usuarioTieneEncuesta();
    await this.consultarResultados();

  }

  async usuarioTieneEncuesta(){

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

  async consultarResultados() {
    await this.questionService.getEncuestaPorUsuario(this.usuario.id).then((response) => {
      if (response) {
        this.mostrarResultados = true;
      }
    }
    ).catch((error) => {
      console.error('Error al consultar la encuesta:', error);
    }
    );
  }

  startSurvey() {
    console.log('Starting survey');
  }
  
}
