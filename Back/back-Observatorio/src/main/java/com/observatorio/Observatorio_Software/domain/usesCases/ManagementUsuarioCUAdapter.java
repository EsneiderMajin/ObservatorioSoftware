package com.observatorio.Observatorio_Software.domain.usesCases;

import com.observatorio.Observatorio_Software.aplication.input.ManagementUsuarioCUIntport;
import com.observatorio.Observatorio_Software.domain.models.Usuario;

import java.util.List;

public class ManagementUsuarioCUAdapter implements ManagementUsuarioCUIntport {

    @Override
    public Usuario registrarUsuario(Usuario objUsuario) {
        return null;
    }

    @Override
    public List<Usuario> listar() {
        return List.of();
    }
}
