package com.observatorio.Observatorio_Software.Cuestionario.domain.models;
import java.util.List;
import com.observatorio.Observatorio_Software.Pregunta.domain.models.Pregunta;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Cuestionario {
    private int idcuestionario;
    private String titulo;
    private String descripcion;
    private List<Pregunta> listaPreguntas;


}
