import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationData } from 'src/app/core/models/generics.model';
import { Register } from 'src/app/core/models/register.model';
import { RegisterService } from 'src/app/core/services/register/register.service';
import { SupabaseService } from 'src/app/core/services/supabase/supabase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registroForm!: FormGroup;
  register: Register = {} as Register;

    notificationData: NotificationData = {
      title: "",
      description: "",
      isError: false
    };
  loading = false;
  visibleAlert = false;

  constructor(private readonly fb: FormBuilder,
              private readonly registerService: RegisterService,
              private supabaseService: SupabaseService,
              private router: Router
  ) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)] ],
    });
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      this.register.nombre = this.registroForm.value.nombre;
      this.register.correoElectronico = this.registroForm.value.correo;
      this.register.contrasena = this.registroForm.value.contrasena;
      this.register.rol = 'Usuario'; 
      this.onRegister();
    } else {
      this.registroForm.markAllAsTouched();
    }
  }

  async onRegister(): Promise<void> { 


      await this.registerService.postCreateUsuario(this.register).then((response) => {
        this.loading = false
        this.notificationData.title = "Registro exitoso"
        this.notificationData.description = "Se ha enviado un correo de verificación a su correo electrónico."
        this.visibleAlert = true
      }
      ).catch((error) => {
        console.error('Error al guardar el registro:', error);
      }
      );

  }

  buttonOption(response: any): void {
    if (response) {
      this.registroForm.reset();
      this.visibleAlert = false; 
    }

  }


}