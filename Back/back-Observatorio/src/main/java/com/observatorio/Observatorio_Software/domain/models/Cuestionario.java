package com.observatorio.Observatorio_Software.domain.models;

import java.util.Collection;
import java.util.List;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Cuestionario {

    private int idcuestionario;
    private String titulo;
    private String descripcion;
//    private Usuario objUsuario;
    private List<Pregunta> preguntas;
}
