package com.observatorio.Observatorio_Software.domain.models;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TipoPregunta {
    private int idtipopregunta;
    private String nombre;
    private String descripcion;
}
