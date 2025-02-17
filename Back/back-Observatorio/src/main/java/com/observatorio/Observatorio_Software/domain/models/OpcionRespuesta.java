package com.observatorio.Observatorio_Software.domain.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OpcionRespuesta {
    private int idopcionrespuesta;
    private String descripcion;
    private Pregunta objPregunta;
}
