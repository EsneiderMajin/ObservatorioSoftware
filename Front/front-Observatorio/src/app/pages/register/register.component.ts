import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(private fb: FormBuilder,
              private registerService: RegisterService,
              private supabaseService: SupabaseService
  ) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      console.log('Formulario válido:', this.registroForm);
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
        console.log('Registro guardado:', response);
      }
      ).catch((error) => {
        console.error('Error al guardar el registro:', error);
      }
      );

  }


}