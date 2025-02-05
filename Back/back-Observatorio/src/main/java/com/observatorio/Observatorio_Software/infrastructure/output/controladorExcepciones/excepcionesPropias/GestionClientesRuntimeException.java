package com.observatorio.Observatorio_Software.infrastructure.output.controladorExcepciones.excepcionesPropias;

import com.observatorio.Observatorio_Software.infrastructure.output.controladorExcepciones.estructuraExcepciones.CodigoError;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public abstract class GestionClientesRuntimeException extends RuntimeException{

protected CodigoError codigoError;

  public abstract String formatException();
}
