package com.observatorio.Observatorio_Software.aplication.output;
import com.observatorio.Observatorio_Software.domain.models.Usuario;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.UsuarioDTORespuesta;

import java.util.List;

public interface GestionarUsuarioGatewayIntPort {

    public boolean existeUsuarioPorCorreo(String correo);

    public Usuario guardar(Usuario objUsuario);

    public UsuarioDTORespuesta consultarUsuarioPorId(int id);

    public List<Usuario> listar();


}
