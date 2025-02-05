package com.observatorio.Observatorio_Software.domain.models;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Respuesta {
    private int idrespuesta;
    private String descripcion;
    private Pregunta objPregunta;

}
