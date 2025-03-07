package com.observatorio.Observatorio_Software.infrastructure.input.controllers;

import com.observatorio.Observatorio_Software.aplication.input.GestionarUsuarioCUIntPort;
import com.observatorio.Observatorio_Software.domain.models.Usuario;
import com.observatorio.Observatorio_Software.infrastructure.input.DTORequest.UsuarioDTOPeticion;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.UsuarioDTORespuesta;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
@Validated
@RequiredArgsConstructor

public class UsuarioRestController {

    private final GestionarUsuarioCUIntPort objGestionarUsuarioCUInt;
    private final ModelMapper modelMapper;

    // @PostMapping("/Usuarios")
    // public ResponseEntity<UsuarioDTORespuesta> create(@Valid @RequestBody UsuarioDTOPeticion objUsuario) {
    //     Usuario objUsuarioCrear = objMapeador.mappearDePeticionAUsuario(objUsuario);
    //     Usuario objUsuarioCreado = objGestionarUsuarioCUInt.registrarUsuario(objUsuarioCrear);
    //     ResponseEntity<UsuarioDTORespuesta> objRespuesta = new ResponseEntity<UsuarioDTORespuesta>(
    //             objMapeador.mappearDeUsuarioARespuesta(objUsuarioCreado),
    //             HttpStatus.CREATED);
    //     return objRespuesta;
    // }

    @PostMapping("/Usuarios")
    public ResponseEntity<UsuarioDTORespuesta> create(@Valid @RequestBody UsuarioDTOPeticion objUsuario) {
        Usuario objUsuarioCrear = modelMapper.map(objUsuario, Usuario.class);
        Usuario objUsuarioCreado = objGestionarUsuarioCUInt.registrarUsuario(modelMapper.map(objUsuarioCrear,Usuario.class));
        ResponseEntity<UsuarioDTORespuesta> objRespuesta = new ResponseEntity<UsuarioDTORespuesta>(
                modelMapper.map(objUsuarioCreado, UsuarioDTORespuesta.class),
                HttpStatus.CREATED);
        return objRespuesta;
    }

    @GetMapping("/Usuarios")
    public ResponseEntity<List<UsuarioDTORespuesta>> listar() {

        Iterable<Usuario> Usuarios = this.objGestionarUsuarioCUInt.listar();
        List<UsuarioDTORespuesta> listUsuarios = this.modelMapper.map(Usuarios,
                new TypeToken<List<UsuarioDTORespuesta>>() {
                }.getType());

        ResponseEntity<List<UsuarioDTORespuesta>> objRespuesta = new ResponseEntity<List<UsuarioDTORespuesta>>
                (listUsuarios,
                        HttpStatus.OK
                );

        return objRespuesta;
    }

}
