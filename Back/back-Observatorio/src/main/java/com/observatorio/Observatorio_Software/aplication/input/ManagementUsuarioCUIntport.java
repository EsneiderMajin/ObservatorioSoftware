package com.observatorio.Observatorio_Software.aplication.input;

import com.observatorio.Observatorio_Software.domain.models.Usuario;

import java.util.List;

public interface ManagementUsuarioCUIntport {

    public Usuario registrarUsuario(Usuario objUsuario);

    public List<Usuario> listar();



}
