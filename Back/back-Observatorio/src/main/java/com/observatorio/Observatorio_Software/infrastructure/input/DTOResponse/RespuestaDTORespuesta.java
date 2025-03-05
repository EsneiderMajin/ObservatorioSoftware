package com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RespuestaDTORespuesta {

    private int idrespuesta;
    private String descripcion;
    private List<PreguntaDTORespuesta> preguntas;

    private UsuarioDTORespuesta objUsuario;

    private CuestionarioDTORespuesta objCuestionario;

    public RespuestaDTORespuesta(int idrespuesta, String descripcion) {
    }







    //private PreguntaDTOPeticion objPregunta;
    //private UsuarioDTORespuesta objUsuario;

    // public RespuestaDTORespuesta(){

    // }

    // public RespuestaDTORespuesta(int idrespuesta, String descripcion, PreguntaDTOPeticion objPregunta) {
    //     this.idrespuesta = idrespuesta;
    //     this.descripcion = descripcion;
    //     this.objPregunta = objPregunta;
    // }
}
