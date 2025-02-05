package com.observatorio.Observatorio_Software.domain.usesCases;

import com.observatorio.Observatorio_Software.aplication.input.ManagementCuestionarioCUIntPort;
import com.observatorio.Observatorio_Software.domain.models.Cuestionario;
import com.observatorio.Observatorio_Software.domain.models.Respuesta;

import java.util.List;

public class ManagementCuestionarioCUAdapter implements ManagementCuestionarioCUIntPort {


    @Override
    public Cuestionario crearCuestionario(Cuestionario cuestionario) {
        return null;
    }

    @Override
    public Cuestionario asignarPreguntaCuestionario(Integer idPregunta) {
        return null;
    }

    @Override
    public List<Cuestionario> listarRespuestasCuestionarios() {
        return List.of();
    }

    @Override
    public List<Cuestionario> listarCuestionarios() {
        return List.of();
    }

    @Override
    public List<Respuesta> listarCuestionariosPorUsuario(Integer idusuario) {
        return List.of();
    }
}
