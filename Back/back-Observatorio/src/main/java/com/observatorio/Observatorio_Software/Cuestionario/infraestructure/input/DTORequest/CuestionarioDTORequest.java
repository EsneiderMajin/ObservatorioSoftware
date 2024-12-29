package com.observatorio.Observatorio_Software.Cuestionario.infraestructure.input.DTORequest;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CuestionarioDTORequest {
    private int idcuestionario;

    @NotNull(message = "{CuestionarioDTOPeticion.titulo.emply}")
    @Size(min = 3, max = 20, message = "{producto.codigo.size}")
    private String titulo;

    @NotNull(message = "{CuestionarioDTOPeticion.descripcion.emply}")
    @Size(min = 1, max = 100, message = "{CuestionarioDTOPeticion.descripcion.size}")
    private String descripcion;

    //private List<PreguntaDTOPeticion> preguntas;
}
