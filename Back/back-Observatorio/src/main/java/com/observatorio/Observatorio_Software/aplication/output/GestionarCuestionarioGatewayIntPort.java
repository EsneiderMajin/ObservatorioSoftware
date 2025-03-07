package com.observatorio.Observatorio_Software.aplication.output;

import com.observatorio.Observatorio_Software.domain.models.Cuestionario;
import com.observatorio.Observatorio_Software.domain.models.Respuesta;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.CuestionarioDTORespuesta;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.PreguntaDTORespuesta;

import java.util.List;

public interface GestionarCuestionarioGatewayIntPort {

    public boolean existeCuestionarioPorTitulo(String titulo);

    public Cuestionario guardarCuestionario(Cuestionario objCuestionario);

    public List<Cuestionario> listarCuestionarios();

    public List<Cuestionario> listarRespuestasCuestionarios();

    public Cuestionario asignarPreguntaCuestionario(Integer idPregunta);

    public Cuestionario consultarCuestionarioPorTitulo(String titulo);

    List<CuestionarioDTORespuesta> consultarCuestionarioPorPatron(String titulo);

    public List<Respuesta> listarCuestionariosPorUsuario(Integer Usuario);

    public CuestionarioDTORespuesta obtenerCuestionarioDTOPorRespuesta(Integer idRespuesta);

    public List<PreguntaDTORespuesta> obtenerPreguntasDTOPorCuestionario(Integer idCuestionario);



}
