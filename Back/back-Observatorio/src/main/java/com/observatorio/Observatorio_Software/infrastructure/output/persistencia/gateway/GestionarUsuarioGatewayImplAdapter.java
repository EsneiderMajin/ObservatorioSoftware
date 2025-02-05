package com.observatorio.Observatorio_Software.infrastructure.output.persistencia.gateway;

import com.observatorio.Observatorio_Software.aplication.output.ManagementUsuarioGatewayIntPort;
import com.observatorio.Observatorio_Software.domain.models.Usuario;

public class GestionarUsuarioGatewayImplAdapter implements ManagementUsuarioGatewayIntPort {
    @Override
    public boolean existeUsuarioPorCorreo(String correo) {
        return false;
    }

    @Override
    public Usuario guardar(Usuario usuario) {
        return null;
    }
}
