package com.observatorio.Observatorio_Software.infrastructure.output.controladorExcepciones.excepcionesPropias;

import lombok.Getter;

@Getter
public class UsuarioYaRespondioException extends RuntimeException {

    public UsuarioYaRespondioException(String message) {
        super(message);
    }
}
