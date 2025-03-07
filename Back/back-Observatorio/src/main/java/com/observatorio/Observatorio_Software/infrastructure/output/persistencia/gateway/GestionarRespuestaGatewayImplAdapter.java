package com.observatorio.Observatorio_Software.infrastructure.output.persistencia.gateway;

import com.observatorio.Observatorio_Software.aplication.output.GestionarRespuestaGatewayIntPort;
import com.observatorio.Observatorio_Software.domain.models.Cuestionario;
import com.observatorio.Observatorio_Software.domain.models.Pregunta;
import com.observatorio.Observatorio_Software.domain.models.Respuesta;
import com.observatorio.Observatorio_Software.domain.models.Usuario;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.CuestionarioDTORespuesta;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.PreguntaDTORespuesta;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.RespuestaDTORespuesta;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.UsuarioDTORespuesta;
import com.observatorio.Observatorio_Software.infrastructure.output.controladorExcepciones.excepcionesPropias.UsuarioYaRespondioException;
import com.observatorio.Observatorio_Software.infrastructure.output.persistencia.entidades.CuestionarioEntity;
import com.observatorio.Observatorio_Software.infrastructure.output.persistencia.entidades.PreguntaEntity;
import com.observatorio.Observatorio_Software.infrastructure.output.persistencia.entidades.RespuestaEntity;
import com.observatorio.Observatorio_Software.infrastructure.output.persistencia.entidades.UsuarioEntity;
import com.observatorio.Observatorio_Software.infrastructure.output.persistencia.repositorios.CuestionarioRepository;
import com.observatorio.Observatorio_Software.infrastructure.output.persistencia.repositorios.PreguntasRepository;
import com.observatorio.Observatorio_Software.infrastructure.output.persistencia.repositorios.RespuestasRepository;
import com.observatorio.Observatorio_Software.infrastructure.output.persistencia.repositorios.UsuarioRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GestionarRespuestaGatewayImplAdapter implements GestionarRespuestaGatewayIntPort {
    private final ModelMapper UsuarioModelMapper;
    private final UsuarioRepository objUsuarioRepository;
    private final CuestionarioRepository objCuestionarioRepository;
    private final PreguntasRepository objPreguntasRepository;
    private final RespuestasRepository objRespuestasRepository;
    public GestionarRespuestaGatewayImplAdapter(UsuarioRepository objUsuarioRepository, CuestionarioRepository objCuestionarioRepository,
                                                PreguntasRepository objPreguntasRepository, RespuestasRepository objRespuestasRepository, ModelMapper UsuarioModelMapper){
        this.UsuarioModelMapper = UsuarioModelMapper;
        this.objCuestionarioRepository = objCuestionarioRepository;
        this.objUsuarioRepository = objUsuarioRepository;
        this.objPreguntasRepository = objPreguntasRepository;
        this.objRespuestasRepository = objRespuestasRepository;
    }
    @Override
    public void registrarRespuesta(Usuario objUsuario, Cuestionario objCuestionario,List<Pregunta> objPreguntas) {

        //validacion existencia Usuario

        UsuarioEntity Usuario = objUsuarioRepository.findById(objUsuario.getIdUsuario()).
                orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        //validacion existencia cuestionario
        CuestionarioEntity cuestionario = objCuestionarioRepository.findById(objCuestionario.getIdcuestionario())
                .orElseThrow(() -> new IllegalArgumentException("Cuestionario no encontrado"));

        for(Pregunta preguntaDTO: objPreguntas){
            // Verificar si el Usuario ya ha respondido la pregunta
            boolean existeRespuesta = objRespuestasRepository.existsByObjUsuarioIdUsuarioAndObjPreguntaIdpregunta(objUsuario.getIdUsuario(), preguntaDTO.getIdpregunta());
            if (existeRespuesta) {
                throw new UsuarioYaRespondioException("El Usuario ya ha respondido la pregunta con ID: " + preguntaDTO.getIdpregunta());
            }
            //validacion existenia de pregunta asocaida a la respuesta
            PreguntaEntity pregunta = objPreguntasRepository.findById(preguntaDTO.getIdpregunta())
                    .orElseThrow(() -> new IllegalArgumentException("Pregunta no encontrada"));

            for(Respuesta respuestaDTO: preguntaDTO.getListaRespuestas()){
                Pregunta objPreguntaRespuesta = UsuarioModelMapper.map(pregunta, Pregunta.class);
                Usuario objUsuarioEncontrado = UsuarioModelMapper.map(Usuario,Usuario.class);
                // Cuestionario objCuestionarioEncontrado = UsuarioModelMapper.map(cuestionario,Cuestionario.class);
                Respuesta respuesta = new Respuesta();
                //respuesta.setDescripcion(preguntaDTO.getListaRespuestas().get(0).toString());
                respuesta.setDescripcion(respuestaDTO.getDescripcion());
                respuesta.setObjPregunta(objPreguntaRespuesta);
                respuesta.setObjUsuario(objUsuarioEncontrado);

                RespuestaEntity objRespuestaEntity = UsuarioModelMapper.map(respuesta, RespuestaEntity.class);
                objRespuestasRepository.save(objRespuestaEntity);
            }



        }

    }

    @Override
    public void consultarRespuesta(UsuarioDTORespuesta Usuario, CuestionarioDTORespuesta cuestionario, List<PreguntaDTORespuesta> preguntas) {
        System.out.println("ENTRO A CONSULTAR RESPUESTA");
        System.out.println("ENTRO A CONSULTAR RESPUESTA"+Usuario.getIdUsuario());
        UsuarioEntity UsuarioEntity = objUsuarioRepository.findById(Usuario.getIdUsuario())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        CuestionarioEntity cuestionarioEntity = objCuestionarioRepository.findById(cuestionario.getIdcuestionario())
                .orElseThrow(() -> new IllegalArgumentException("Cuestionario no encontrado"));

        for (PreguntaDTORespuesta preguntaDTO : preguntas) {
            PreguntaEntity preguntaEntity = objPreguntasRepository.findById(preguntaDTO.getIdpregunta())
                    .orElseThrow(() -> new IllegalArgumentException("Pregunta no encontrada"));

            List<RespuestaEntity> respuestasEntity = objRespuestasRepository.findByPregunta(preguntaEntity.getIdpregunta());
            List<Respuesta> respuestas = respuestasEntity.stream()
                    .map(respuestaEntity -> UsuarioModelMapper.map(respuestaEntity, Respuesta.class))
                    .collect(Collectors.toList());

            List<RespuestaDTORespuesta> listaRespuestas = respuestas.stream()
                    .map(respuesta -> {
                        RespuestaDTORespuesta respuestaEnt = UsuarioModelMapper.map(respuesta, RespuestaDTORespuesta.class);
                        return respuestaEnt;
                    })
                    .collect(Collectors.toList());
            preguntaDTO.setListaRespuestas(listaRespuestas);
        }
    }


}