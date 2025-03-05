package com.observatorio.Observatorio_Software.infrastructure.input.DTORequest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PreguntaDTOPeticion {

    private int idpregunta;

    @NotNull(message = "{PreguntaDTOPeticion.enunciado.emply}")
    private String enunciado;

    private List<RespuestaDTOPeticion> listaRespuestas;
    private TipoPreguntaDTOPeticion objTipoPregunta;
    private CuestionarioDTOPeticion objCuestionario;
}
