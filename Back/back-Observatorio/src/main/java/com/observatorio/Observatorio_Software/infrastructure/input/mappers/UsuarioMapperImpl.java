package com.observatorio.Observatorio_Software.infrastructure.input.mappers;

import com.observatorio.Observatorio_Software.domain.models.Cuestionario;
import com.observatorio.Observatorio_Software.domain.models.Usuario;
import com.observatorio.Observatorio_Software.infrastructure.input.DTORequest.UsuarioDTOPeticion;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.CuestionarioDTORespuesta;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.UsuarioDTORespuesta;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioMapperImpl implements UsuarioMapperInfraestructuraDominio{

    @Override
    public Usuario mappearDePeticionAUsuario(UsuarioDTOPeticion peticion) {

        Usuario Usuario = new Usuario(

                peticion.getIdUsuario(),
                peticion.getNombres(),
                peticion.getApellidos(),
                peticion.getCorreo(),
                peticion.getContrasena(),
                peticion.getRol()
                );
        return Usuario;
    }

    @Override
    public UsuarioDTORespuesta mappearDeUsuarioARespuesta(Usuario Usuario) {

        UsuarioDTORespuesta UsuarioMapeado = new UsuarioDTORespuesta();
        UsuarioMapeado.setIdUsuario(Usuario.getIdUsuario());
        UsuarioMapeado.setNombres(Usuario.getNombres());
        UsuarioMapeado.setApellidos(Usuario.getApellidos());
        UsuarioMapeado.setCorreo(Usuario.getCorreo());
        UsuarioMapeado.setContrasena(Usuario.getContrasena());
        UsuarioMapeado.setRol(Usuario.getRol());
        return UsuarioMapeado;
    }

    @Override
    public List<UsuarioDTORespuesta> mappearDeUsuariosARespuesta(List<Usuario> Usuarios) {

        List<UsuarioDTORespuesta> response = new ArrayList<>();
        for(int i = 0 ; i<Usuarios.size() ; i++){
            Usuario UsuarioPeticion = Usuarios.get(i);

            UsuarioDTORespuesta UsuarioMapeado = new UsuarioDTORespuesta();
            UsuarioMapeado.setIdUsuario(UsuarioPeticion.getIdUsuario());
            UsuarioMapeado.setNombres(UsuarioPeticion.getNombres());
            UsuarioMapeado.setApellidos(UsuarioPeticion.getApellidos());
            UsuarioMapeado.setCorreo(UsuarioPeticion.getCorreo());
            UsuarioMapeado.setContrasena(UsuarioPeticion.getContrasena());
            UsuarioMapeado.setRol(UsuarioPeticion.getRol());
            response.add(UsuarioMapeado);
        }
        return response;
    }

    @Override
    public List<Usuario> mappearRespuestaAUsuario(List<UsuarioDTOPeticion> Usuarios) {
        List<Usuario> response = new ArrayList<>();
        for(UsuarioDTOPeticion UsuarioPeticion : Usuarios){
            Usuario UsuarioMapeado = this.mappearDePeticionAUsuario(UsuarioPeticion);
            response.add(UsuarioMapeado);
        }
        return response;
    }

}
