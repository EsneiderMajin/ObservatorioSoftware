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
@Table(name = "TipoPregunta")

public class TipoPreguntaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idTipoPregunta;

    @Column(nullable = false, length = 30)
    private String nombre;

    @Column(nullable = false, length = 30)
    private String descripcion;

    @OneToMany(mappedBy = "objTipoPregunta")
    private List<PreguntaEntity> preguntas;
}