import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registroForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      // Aquí puedes manejar la lógica de envío al servidor o lo que necesites
      console.log('Formulario válido:', this.registroForm.value);
    } else {
      console.log('Formulario inválido');
      // Opcional: marcar todos los campos como "tocados" para que muestren errores
      this.registroForm.markAllAsTouched();
    }
  }
}