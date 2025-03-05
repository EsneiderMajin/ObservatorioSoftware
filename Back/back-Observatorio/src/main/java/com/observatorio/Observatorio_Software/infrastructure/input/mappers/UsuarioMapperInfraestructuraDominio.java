package com.observatorio.Observatorio_Software.infrastructure.input.mappers;

import com.observatorio.Observatorio_Software.domain.models.Usuario;
import com.observatorio.Observatorio_Software.infrastructure.input.DTORequest.UsuarioDTOPeticion;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.UsuarioDTORespuesta;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UsuarioMapperInfraestructuraDominio {
    Usuario mappearDePeticionAUsuario(UsuarioDTOPeticion peticion);

    UsuarioDTORespuesta mappearDeUsuarioARespuesta(Usuario Usuario);

    List<UsuarioDTORespuesta> mappearDeUsuariosARespuesta(List<Usuario> Usuarios);

    List<Usuario> mappearRespuestaAUsuario(List<UsuarioDTOPeticion> Usuarios);


}