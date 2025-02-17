package com.observatorio.Observatorio_Software.infrastructure.output.controladorExcepciones;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.ConstraintViolationException;

import com.observatorio.Observatorio_Software.infrastructure.output.controladorExcepciones.estructuraExcepciones.CodigoError;
import com.observatorio.Observatorio_Software.infrastructure.output.controladorExcepciones.estructuraExcepciones.ErrorUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class RestApiExceptionHandler {


/*
    //========================================
    /*
    @ExceptionHandler(ReglaNegocioExcepcion.class)
    public ResponseEntity<Error> handleGenericException(final HttpServletRequest req,
                                                        final ReglaNegocioExcepcion ex, final Locale locale) {
        final Error error = ErrorUtils
                .crearError(CodigoError.VIOLACION_REGLA_DE_NEGOCIO.getCodigo(), ex.formatException(),
                        HttpStatus.BAD_REQUEST.value())
                .setUrl(req.getRequestURL().toString()).setMetodo(req.getMethod());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EntidadNoExisteException.class)
    public ResponseEntity<Error> handleGenericException(final HttpServletRequest req,
                                                        final EntidadNoExisteException ex, final Locale locale) {
        final Error error = ErrorUtils
                .crearError(CodigoError.ENTIDAD_NO_ENCONTRADA.getCodigo(),
                        String.format("%s, %s",
                                CodigoError.ENTIDAD_NO_ENCONTRADA.getLlaveMensaje(),
                                ex.getMessage()),
                        HttpStatus.NOT_FOUND.value())
                .setUrl(req.getRequestURL().toString()).setMetodo(req.getMethod());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }


     */

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        System.out.println("Retornando respuesta con los errores identificados");
        Map<String, String> errores = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String campo = ((FieldError) error).getField();
            String mensajeDeError = error.getDefaultMessage();
            errores.put(campo, mensajeDeError);
        });

        return new ResponseEntity<Map<String, String>>(errores, HttpStatus.BAD_REQUEST);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(ConstraintViolationException.class)
    ResponseEntity<String> handleConstraintViolationException(ConstraintViolationException e) {
        return new ResponseEntity<>(e.getMessage(),
                HttpStatus.BAD_REQUEST);
    }
}
