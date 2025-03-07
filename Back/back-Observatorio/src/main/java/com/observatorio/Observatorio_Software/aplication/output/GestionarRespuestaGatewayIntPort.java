package com.observatorio.Observatorio_Software.aplication.output;

import com.observatorio.Observatorio_Software.domain.models.Cuestionario;
import com.observatorio.Observatorio_Software.domain.models.Pregunta;
import com.observatorio.Observatorio_Software.domain.models.Usuario;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.CuestionarioDTORespuesta;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.PreguntaDTORespuesta;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.UsuarioDTORespuesta;

import java.util.List;

public interface GestionarRespuestaGatewayIntPort {

    public void registrarRespuesta(Usuario Usuario,Cuestionario cuestionario,List<Pregunta> preguntas) throws Exception;

    public void consultarRespuesta(UsuarioDTORespuesta Usuario, CuestionarioDTORespuesta cuestionario, List<PreguntaDTORespuesta> preguntas);

}
