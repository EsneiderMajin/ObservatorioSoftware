package com.observatorio.Observatorio_Software.domain.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Resultados {
    private int idresultados;
    private String descripcion;
    private Respuesta objRespuesta;
    private TipoPregunta objTipoPregunta;
    private Organizacion objOrganizacion;
    private OpcionRespuesta objOpcionRespuesta;
    private Pregunta objPregunta;
    private Usuario objUsuario;
    private Cuestionario objCuestionario;
    private int cantidad;
    private int total;
    private double porcentaje;

}
