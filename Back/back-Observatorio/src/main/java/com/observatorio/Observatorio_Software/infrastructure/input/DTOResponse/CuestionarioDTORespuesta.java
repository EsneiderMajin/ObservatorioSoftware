package com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CuestionarioDTORespuesta {

    private int idcuestionario;
    private String titulo;
    private String descripcion;
    private List<PreguntaDTORespuesta> preguntas;
//    private UsuarioDTORespuesta objUsuario;

}
