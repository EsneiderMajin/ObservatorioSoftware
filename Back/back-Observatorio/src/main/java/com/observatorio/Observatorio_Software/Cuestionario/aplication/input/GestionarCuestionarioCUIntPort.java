package com.observatorio.Observatorio_Software.Cuestionario.aplication.input;

import com.observatorio.Observatorio_Software.Cuestionario.domain.models.Cuestionario;

import java.util.List;

public interface GestionarCuestionarioCUIntPort {

    public Cuestionario crearCuestionario(Cuestionario cuestionario);

    Cuestionario asignarPreguntaCuestionario(Integer idPregunta);

    public List<Cuestionario> listarRespuestasCuestionarios();

    public List<Cuestionario> listarCuestionarios();

    public List<Cuestionario> listarCuestionariosPorUsuario(Integer idusuario);

    public Cuestionario obtenerCuestionarioPorRespuesta(Integer idRespuesta);

    public List<Cuestionario> obtenerPreguntasPorCuestionario(Integer idCuestionario);



}
