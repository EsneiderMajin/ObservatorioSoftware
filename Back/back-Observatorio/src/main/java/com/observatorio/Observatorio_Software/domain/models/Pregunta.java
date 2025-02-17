package com.observatorio.Observatorio_Software.domain.models;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Pregunta {
    private int idPregunta;
    private String enunciado;
    private String tipo;
    private Cuestionario objCuestionario;
    private List<Respuesta> listaRespuestas;

}