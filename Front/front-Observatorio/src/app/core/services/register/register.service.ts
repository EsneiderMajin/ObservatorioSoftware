import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { Register } from '../../models/register.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
        private supabaseService: SupabaseService
  ) { }

  async postCreateUsuario(registro: Register): Promise<void> {
    const supabase = this.supabaseService.getClient();
    try {
      // Usar el método signUp de Supabase Auth para registrar al usuario
      const { data, error } = await supabase.auth.signUp({
        email: registro.correoElectronico,
        password: registro.contrasena,
        options: {
          // Aquí puedes agregar datos adicionales para almacenar en el perfil del usuario
          data: {
            nombre: registro.nombre,
            rol: registro.rol
          }
        }
      });
      if (error) {
        console.error('Error al registrar usuario:', error);
        throw error;
      }
      console.log('Usuario registrado con éxito:', data);
    } catch (error) {
      console.error('Error al guardar registro:', error);
      throw error;
    }
  }

  
}
