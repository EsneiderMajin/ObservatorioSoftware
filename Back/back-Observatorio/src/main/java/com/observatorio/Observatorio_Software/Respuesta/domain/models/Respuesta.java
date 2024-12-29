package com.observatorio.Observatorio_Software.Respuesta.domain.models;
import com.observatorio.Observatorio_Software.Pregunta.domain.models.Pregunta;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Respuesta {
    private int idrespuesta;
    private String descripcion;
    private Pregunta objPregunta;

}
