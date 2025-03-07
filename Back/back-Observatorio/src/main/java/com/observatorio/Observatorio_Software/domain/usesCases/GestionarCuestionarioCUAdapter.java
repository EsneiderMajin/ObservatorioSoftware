package com.observatorio.Observatorio_Software.domain.usesCases;

import com.observatorio.Observatorio_Software.aplication.input.GestionarCuestionarioCUIntPort;
import com.observatorio.Observatorio_Software.aplication.output.CuestionarioFormateadorResultadoIntPort;
import com.observatorio.Observatorio_Software.aplication.output.GestionarCuestionarioGatewayIntPort;
import com.observatorio.Observatorio_Software.domain.models.Cuestionario;
import com.observatorio.Observatorio_Software.domain.models.Respuesta;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.CuestionarioDTORespuesta;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.PreguntaDTORespuesta;
import com.observatorio.Observatorio_Software.infrastructure.output.controladorExcepciones.excepcionesPropias.EntidadNoExisteException;

import java.util.List;

public class GestionarCuestionarioCUAdapter implements GestionarCuestionarioCUIntPort {

    private final GestionarCuestionarioGatewayIntPort objGestionarCuestionarioGateway;
    private final CuestionarioFormateadorResultadoIntPort objCuestionarioFormateadorResultados;

    public GestionarCuestionarioCUAdapter(GestionarCuestionarioGatewayIntPort objRegistrarCuestionarioGateway,
                                          CuestionarioFormateadorResultadoIntPort objCuestionarioFormateadorResultados) {
        this.objGestionarCuestionarioGateway = objRegistrarCuestionarioGateway;
        this.objCuestionarioFormateadorResultados = objCuestionarioFormateadorResultados;
    }

    @Override
    public Cuestionario crearCuestionario(Cuestionario cuestionario) {

        Cuestionario objCuestionarioCreado = null;
        if (this.objGestionarCuestionarioGateway.existeCuestionarioPorTitulo(cuestionario.getTitulo())) {
            this.objCuestionarioFormateadorResultados.retornarRespuestaErrorEntidadExiste("Error, se encuentra en el sistema un Cuestionario con el titulo ingresado ");
        } else {
            objCuestionarioCreado = this.objGestionarCuestionarioGateway.guardarCuestionario(cuestionario);
        }
        return objCuestionarioCreado;
    }


    @Override
    public List<Cuestionario> listarCuestionarios() {
        List<Cuestionario> listaCuestionarios = this.objGestionarCuestionarioGateway.listarCuestionarios();
        return listaCuestionarios;
    }

    @Override
    public List<Respuesta> listarCuestionariosPorUsuario(Integer idUsuario) {

        return this.objGestionarCuestionarioGateway.listarCuestionariosPorUsuario(idUsuario);

    }

    @Override
    public CuestionarioDTORespuesta obtenerCuestionarioDTOPorRespuesta(Integer idRespuesta) {
        return this.objGestionarCuestionarioGateway.obtenerCuestionarioDTOPorRespuesta(idRespuesta);

    }

    @Override
    public List<PreguntaDTORespuesta> obtenerPreguntasPorCuestionario(Integer idCuestionario) {

        return this.objGestionarCuestionarioGateway.obtenerPreguntasDTOPorCuestionario(idCuestionario);

    }


    @Override
    public Cuestionario consultarCuestionarioPorTitulo(String titulo) {
        if (this.objGestionarCuestionarioGateway.existeCuestionarioPorTitulo(titulo)) {
            return this.objGestionarCuestionarioGateway.consultarCuestionarioPorTitulo(titulo);
        }

        EntidadNoExisteException objException = new EntidadNoExisteException("No existe publicacion con el titulo" + titulo);
        throw objException;

    }

    @Override
    public Cuestionario asignarPreguntaCuestionario(Integer idPregunta) {
        Cuestionario preguntaCuestionario = this.objGestionarCuestionarioGateway.asignarPreguntaCuestionario(idPregunta);
        return null;
    }

    @Override
    public List<Cuestionario> listarRespuestasCuestionarios() {
        List<Cuestionario> listaRespuestaCuestionarios = this.objGestionarCuestionarioGateway.listarRespuestasCuestionarios();
        return listaRespuestaCuestionarios;
    }
}