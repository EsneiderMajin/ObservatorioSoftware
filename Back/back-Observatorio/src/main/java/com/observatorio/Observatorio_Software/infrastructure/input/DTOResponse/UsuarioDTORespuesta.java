package com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.observatorio.Observatorio_Software.domain.models.Cuestionario;
import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioDTORespuesta {

    private Integer idUsuario;
    private String nombres;
    private String apellidos;
    private String correo;
    private String contrasena;
    private String rol;
    @JsonIgnore
    private List<RespuestaDTORespuesta> listaRespuestas;
}
