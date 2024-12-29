package com.observatorio.Observatorio_Software.TipoPregunta.domain.models;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TipoPregunta {
    private int idTipoPregunta;
    private String nombre;
    private String descripcion;
}
