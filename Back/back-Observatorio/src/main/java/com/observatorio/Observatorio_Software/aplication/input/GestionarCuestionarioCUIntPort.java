package com.observatorio.Observatorio_Software.aplication.input;

import com.observatorio.Observatorio_Software.domain.models.Cuestionario;
import com.observatorio.Observatorio_Software.domain.models.Respuesta;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.CuestionarioDTORespuesta;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.PreguntaDTORespuesta;

import java.util.List;

public interface GestionarCuestionarioCUIntPort {

    public Cuestionario crearCuestionario(Cuestionario cuestionario);

    Cuestionario consultarCuestionarioPorTitulo(String titulo);

    Cuestionario asignarPreguntaCuestionario(Integer idPregunta);

    public List<Cuestionario> listarRespuestasCuestionarios();

    public List<Cuestionario> listarCuestionarios();

    public List<Respuesta> listarCuestionariosPorUsuario(Integer Usuario);

    public CuestionarioDTORespuesta obtenerCuestionarioDTOPorRespuesta(Integer idRespuesta);

    public List<PreguntaDTORespuesta> obtenerPreguntasPorCuestionario(Integer idCuestionario);

}
