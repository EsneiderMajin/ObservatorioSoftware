package com.observatorio.Observatorio_Software.aplication.output;

import com.observatorio.Observatorio_Software.domain.models.Cuestionario;
import com.observatorio.Observatorio_Software.domain.models.Pregunta;
import com.observatorio.Observatorio_Software.domain.models.Respuesta;
import com.observatorio.Observatorio_Software.domain.models.Usuario;

import java.util.List;

public interface ManagementRespuestaGatewayIntPort {

    public void registrarRespuesta(Usuario usuario, Cuestionario cuestionario, List<Pregunta> preguntas) throws Exception;

}
