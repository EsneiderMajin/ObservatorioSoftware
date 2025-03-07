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
@Table(name = "Preguntas")
public class PreguntaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idpregunta;

    @Column(nullable = false, length = 30)
    private String enunciado;

    @OneToMany(mappedBy = "objPregunta", fetch = FetchType.EAGER)
    private List<RespuestaEntity> listaRespuestas;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idtippregunta", nullable = false)
    private TipoPreguntaEntity objTipoPregunta;

    @ManyToOne
    @JoinColumn(name = "idCuestionario", nullable = false)
    private CuestionarioEntity objCuestionario;

    // public PreguntaEntity(){
    //     this.listaRespuestas = new ArrayList<>();
    // }

}
