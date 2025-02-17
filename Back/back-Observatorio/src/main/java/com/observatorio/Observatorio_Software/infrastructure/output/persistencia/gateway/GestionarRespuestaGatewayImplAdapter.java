package com.observatorio.Observatorio_Software.infrastructure.output.persistencia.gateway;

import com.observatorio.Observatorio_Software.aplication.output.ManagementRespuestaGatewayIntPort;
import com.observatorio.Observatorio_Software.domain.models.Cuestionario;
import com.observatorio.Observatorio_Software.domain.models.Pregunta;
import com.observatorio.Observatorio_Software.domain.models.Usuario;

import java.util.List;

public class GestionarRespuestaGatewayImplAdapter implements ManagementRespuestaGatewayIntPort {
    @Override
    public void registrarRespuesta(Usuario usuario, Cuestionario cuestionario, List<Pregunta> preguntas) throws Exception {

    }
}
