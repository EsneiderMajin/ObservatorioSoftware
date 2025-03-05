package com.observatorio.Observatorio_Software.infrastructure.input.DTORequest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CuestionarioDTOPeticion {

    private int idcuestionario;

    @NotNull(message = "{CuestionarioDTOPeticion.titulo.emply}")
    @Size(min = 3, max = 20, message = "{producto.codigo.size}")
    private String titulo;

    @NotNull(message = "{CuestionarioDTOPeticion.descripcion.emply}")
    @Size(min = 1, max = 100, message = "{CuestionarioDTOPeticion.descripcion.size}")
    private String descripcion;

    private List<PreguntaDTOPeticion> preguntas;

    //private UsuarioDTOPeticion objUsuario;

}