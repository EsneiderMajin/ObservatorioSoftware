package com.observatorio.Observatorio_Software.domain.models;

import com.observatorio.Observatorio_Software.infrastructure.input.DTORequest.PreguntaDTOPeticion;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Respuesta {
    private int idrespuesta;
    private String descripcion;

    public Respuesta(int idrespuesta, String descripcion, PreguntaDTOPeticion objPregunta) {
        this.idrespuesta = idrespuesta;
        this.descripcion = descripcion;
        //this.objPregunta = objPregunta;
    }
    private Pregunta objPregunta;
    private Usuario objUsuario;


    @Override
    public String toString() {
        return "Respuesta{" +
                "idrespuesta=" + idrespuesta +
                ", descripcion='" + descripcion + '\'' +
                // Evitar imprimir pregunta directamente para evitar la recursión infinita
                ", preguntaId=" + (objPregunta != null ? objPregunta.getIdpregunta() : null) +
                '}';
    }

}