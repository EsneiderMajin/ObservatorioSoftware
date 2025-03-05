package com.observatorio.Observatorio_Software.aplication.input;

import com.observatorio.Observatorio_Software.domain.models.Usuario;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.UsuarioDTORespuesta;

import java.util.List;

public interface GestionarUsuarioCUIntPort {

    public Usuario  registrarUsuario(Usuario objUsuario);

    public List<Usuario> listar();

    public UsuarioDTORespuesta obtenerUsuarioDTOPorId(int idUsuario);

}
