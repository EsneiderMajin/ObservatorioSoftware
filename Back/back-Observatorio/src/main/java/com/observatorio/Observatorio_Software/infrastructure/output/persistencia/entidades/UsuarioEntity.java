package com.observatorio.Observatorio_Software.infrastructure.output.persistencia.entidades;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Usuarios")
public class UsuarioEntity {

    /*
    *     private Integer idUsuario;
    private String nombres;
    private String apellidos;
    private String correo;
    private String contrasena;
    private String rol;
    private List<Respuesta> listaRespuestas;*/

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idUsuario;

    @Column(nullable = false, length = 30)
    private String nombres;

    @Column(nullable = false, length = 30)
    private String apellidos;

    @Column(nullable = false, length = 30)
    private String correo;

    @Column(nullable = false, length = 30)
    private String contrasena;

    @Column(nullable = false, length = 30)
    private String rol;

    @OneToMany(mappedBy = "objUsuario")
    private List<RespuestaEntity> listaRespuestas;

    public UsuarioEntity(Integer idUsuario, String nombres, String apellidos, String correo, String contrasena, String rol, List<RespuestaEntity> listaRespuestas) {
        this.idUsuario = idUsuario;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.correo = correo;
        this.contrasena = contrasena;
        this.rol = rol;
        this.listaRespuestas = listaRespuestas;
    }

}
