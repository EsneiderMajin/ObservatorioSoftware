package com.observatorio.Observatorio_Software.aplication.output;

import com.observatorio.Observatorio_Software.domain.models.Cuestionario;

import java.util.List;

public interface ManagementCuestionarioGatewayIntPort {

    public Cuestionario guardarCuestionario(Cuestionario objCuestionario);

    public List<Cuestionario> listarCuestionarios();

    public List<Cuestionario> listarRespuestasCuestionarios();

    public Cuestionario asignarPreguntaCuestionario(Integer idPregunta);

    public List<Cuestionario> listarCuestionariosPorUsuario(Integer idusuario);

    //public CuestionarioDTORRespuesta obtenerCuestionarioPorRespuesta(Integer idRespuesta);

}
