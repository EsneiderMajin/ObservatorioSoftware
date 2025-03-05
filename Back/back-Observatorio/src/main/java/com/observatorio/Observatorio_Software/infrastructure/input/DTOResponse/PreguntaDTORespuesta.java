package com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PreguntaDTORespuesta {

    private int idpregunta;
    private String enunciado;
    @JsonIgnore
    private List<RespuestaDTORespuesta> listaRespuestas;
    private TipoPreguntaDTORespuesta objTipoPregunta;
    //private CuestionarioDTORespuesta objCuestionario;

    public PreguntaDTORespuesta(int idpregunta, String enunciado, TipoPreguntaDTORespuesta objTipoPregunta) {
        this.idpregunta = idpregunta;
        this.enunciado = enunciado;
        this.objTipoPregunta = objTipoPregunta;
    }

}
