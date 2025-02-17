package com.observatorio.Observatorio_Software.aplication.output;
import com.observatorio.Observatorio_Software.domain.models.Usuario;

public interface ManagementUsuarioGatewayIntPort {

    public boolean existeUsuarioPorCorreo(String correo);

    public Usuario guardar(Usuario usuario);

}
