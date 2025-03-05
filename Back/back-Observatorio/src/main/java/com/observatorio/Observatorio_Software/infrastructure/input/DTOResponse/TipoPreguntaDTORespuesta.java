package com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TipoPreguntaDTORespuesta {

    private int idTipoPregunta;
    private String nombre;
    private String descripcion;
    //private List<PreguntaDTORespuesta> preguntas;

}
