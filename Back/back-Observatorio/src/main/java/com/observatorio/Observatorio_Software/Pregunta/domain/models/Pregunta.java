package com.observatorio.Observatorio_Software.Pregunta.domain.models;

import com.observatorio.Observatorio_Software.Cuestionario.domain.models.Cuestionario;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Pregunta {

    private int idPregunta;
    private String enunciado;
    private String tipo;
    private Cuestionario objCuestionario;

}
