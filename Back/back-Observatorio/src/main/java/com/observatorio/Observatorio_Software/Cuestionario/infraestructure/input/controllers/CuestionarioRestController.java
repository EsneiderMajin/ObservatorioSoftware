package com.observatorio.Observatorio_Software.Cuestionario.infraestructure.input.controllers;

import com.observatorio.Observatorio_Software.Cuestionario.aplication.input.GestionarCuestionarioCUIntPort;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Validated
public class CuestionarioRestController {

    private final GestionarCuestionarioCUIntPort objGestionarCuestionarioCUInt;


}
