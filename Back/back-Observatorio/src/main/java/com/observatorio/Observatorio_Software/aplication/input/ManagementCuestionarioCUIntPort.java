package com.observatorio.Observatorio_Software.aplication.input;

import com.observatorio.Observatorio_Software.domain.models.Cuestionario;
import com.observatorio.Observatorio_Software.domain.models.Respuesta;

import java.util.List;

public interface ManagementCuestionarioCUIntPort {

    public Cuestionario crearCuestionario(Cuestionario cuestionario);

    Cuestionario asignarPreguntaCuestionario(Integer idPregunta);

    public List<Cuestionario> listarRespuestasCuestionarios();

    public List<Cuestionario> listarCuestionarios();

    public List<Respuesta> listarCuestionariosPorUsuario(Integer idusuario);

    //public Cuestionario obtenerCuestionarioPorRespuesta(Integer idRespuesta);

    //public List<> obtenerPreguntasPorCuestionario(Integer idCuestionario);
}
