package com.observatorio.Observatorio_Software.domain.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Usuario {
    private String nombre;
    private String apellido;
    private String correo;
    private String contrasena;
    private String rol;
    private Organizacion objOrganizacion;
    private List<Cuestionario> listaCuestionarios;

}
