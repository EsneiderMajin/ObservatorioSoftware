package com.observatorio.Observatorio_Software.infrastructure.input.DTORequest;

import com.observatorio.Observatorio_Software.domain.models.Cuestionario;
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
public class UsuarioDTOPeticion{

                    /*
                *     private String nombre;
    private String apellido;
    private String correo;
    private String contrasena;
    private String rol;
    private Organizacion objOrganizacion;
    private List<Cuestionario> listaCuestionarios;*/

    private Integer idUsuario;

    @NotNull(message = "{producto.codigo.emply}")
    @Size(min = 1, max = 30, message = "{producto.codigo.size}")
    private String nombres;

    @NotNull(message = "{producto.codigo.emply}")
    @Size(min = 1, max = 30, message = "{producto.codigo.size}")
    private String apellidos;

    private String correo;

    private String contrasena;

    private String rol;

    private List<RespuestaDTOPeticion> listaRespuestas;

}
