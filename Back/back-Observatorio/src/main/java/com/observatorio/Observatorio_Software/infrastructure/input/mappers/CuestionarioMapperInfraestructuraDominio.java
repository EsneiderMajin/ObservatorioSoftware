package com.observatorio.Observatorio_Software.infrastructure.input.mappers;

import com.observatorio.Observatorio_Software.domain.models.Cuestionario;
import com.observatorio.Observatorio_Software.domain.models.Pregunta;
import com.observatorio.Observatorio_Software.infrastructure.input.DTORequest.CuestionarioDTOPeticion;
import com.observatorio.Observatorio_Software.infrastructure.input.DTORequest.PreguntaDTOPeticion;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.CuestionarioDTORespuesta;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.PreguntaDTORespuesta;
import org.mapstruct.Mapper;

import java.util.List;
@Mapper(componentModel = "spring")
public interface CuestionarioMapperInfraestructuraDominio {

    Cuestionario mappearDePeticionACuestionario(CuestionarioDTOPeticion peticion);

    CuestionarioDTORespuesta mappearDeCuestionarioARespuesta(Cuestionario cuestionario);

    List<CuestionarioDTORespuesta> mappearDeCuestionariosARespuesta(List<Cuestionario> cuestionarios);

    List<Cuestionario> mappearRespuestaACuestionario(List<CuestionarioDTOPeticion> cuestionarios);

    PreguntaDTORespuesta mappearPreguntaARespuesta(Pregunta pregunta );

    Pregunta mappearPeticionAPregunta(PreguntaDTOPeticion peticion);

}
