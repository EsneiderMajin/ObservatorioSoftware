package com.observatorio.Observatorio_Software.domain.models;

import lombok.*;

import java.util.List;
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Usuario {
    private Integer idUsuario;
    private String nombres;
    private String apellidos;
    private String correo;
    private String contrasena;
    private String rol;
    private List<Respuesta> listaRespuestas;

    public Usuario(Integer idUsuario, String nombres, String apellidos, String correo, String contrasena, String rol) {
        this.idUsuario = idUsuario;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.correo = correo;
        this.contrasena = contrasena;
        this.rol = rol;
    }

}
