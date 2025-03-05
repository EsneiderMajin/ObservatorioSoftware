package com.observatorio.Observatorio_Software.infrastructure.input.DTORequest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RespuestaDTOPeticion {
    //TODO: notaciones
    private int idrespuesta;
    private String descripcion;
    private PreguntaDTOPeticion objPregunta;
    //private UsuarioDTOPeticion objUsuario;
}