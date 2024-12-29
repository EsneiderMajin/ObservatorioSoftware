package com.observatorio.Observatorio_Software.Cuestionario.domain.usescases;


import com.observatorio.Observatorio_Software.Cuestionario.aplication.input.GestionarCuestionarioCUIntPort;
import com.observatorio.Observatorio_Software.Cuestionario.domain.models.Cuestionario;

import java.util.List;

public class GestionarCuestionarioCUAdapter implements GestionarCuestionarioCUIntPort {

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
        return null;
    }

    @Override
    public List<Cuestionario> listarCuestionarios() {
        return null;
    }

    @Override
    public List<Cuestionario> listarCuestionariosPorUsuario(Integer idusuario) {
        return null;
    }

    @Override
    public Cuestionario obtenerCuestionarioPorRespuesta(Integer idRespuesta) {
        return null;
    }

    @Override
    public List<Cuestionario> obtenerPreguntasPorCuestionario(Integer idCuestionario) {
        return null;
    }

}




