package com.observatorio.Observatorio_Software.infrastructure.output.persistencia.entidades;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@Table(name = "Respuesta")
public class RespuestaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idrespuesta;

    @Column(nullable = false, length = 30)
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idPregunta")
    private PreguntaEntity objPregunta;

    @ManyToOne
    @JoinColumn(name = "idUsuario")
    private UsuarioEntity objUsuario;

    public RespuestaEntity() {

    }
}