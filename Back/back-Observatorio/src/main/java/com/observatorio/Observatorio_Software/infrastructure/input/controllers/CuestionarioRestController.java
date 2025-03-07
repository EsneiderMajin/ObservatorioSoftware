package com.observatorio.Observatorio_Software.infrastructure.input.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.observatorio.Observatorio_Software.aplication.input.GestionarCuestionarioCUIntPort;
import com.observatorio.Observatorio_Software.aplication.input.GestionarUsuarioCUIntPort;
import com.observatorio.Observatorio_Software.aplication.output.GestionarRespuestaGatewayIntPort;
import com.observatorio.Observatorio_Software.domain.models.Cuestionario;
import com.observatorio.Observatorio_Software.domain.models.Pregunta;
import com.observatorio.Observatorio_Software.domain.models.Usuario;
import com.observatorio.Observatorio_Software.domain.models.Respuesta;
import com.observatorio.Observatorio_Software.infrastructure.input.DTORequest.CuestionarioDTOPeticion;
import com.observatorio.Observatorio_Software.infrastructure.input.DTORequest.PreguntaDTOPeticion;
import com.observatorio.Observatorio_Software.infrastructure.input.DTORequest.UsuarioDTOPeticion;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.CuestionarioDTORespuesta;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.PreguntaDTORespuesta;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.RespuestaDTORespuesta;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.UsuarioDTORespuesta;
import com.observatorio.Observatorio_Software.infrastructure.input.mappers.CuestionarioMapperInfraestructuraDominio;
import com.observatorio.Observatorio_Software.infrastructure.output.controladorExcepciones.estructuraExcepciones.CodigoError;
import com.observatorio.Observatorio_Software.infrastructure.output.controladorExcepciones.estructuraExcepciones.Error;
import com.observatorio.Observatorio_Software.infrastructure.output.controladorExcepciones.estructuraExcepciones.ErrorUtils;
import com.observatorio.Observatorio_Software.infrastructure.output.controladorExcepciones.excepcionesPropias.UsuarioYaRespondioException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Validated
public class CuestionarioRestController {

    private final GestionarCuestionarioCUIntPort objGestionarCuestionarioCUInt;
    private final GestionarUsuarioCUIntPort objGestionarUsuarioCUInt;
    private final GestionarRespuestaGatewayIntPort objRespuestaGatewayAdapter;
    private final ModelMapper modelMapper;
    private final CuestionarioMapperInfraestructuraDominio objMapeador;


    @PostMapping("/cuestionarios")
    public ResponseEntity<CuestionarioDTORespuesta> create(@Valid @RequestBody CuestionarioDTOPeticion objCuestionario) {
        Cuestionario objCuestionarioCrear = modelMapper.map(objCuestionario,Cuestionario.class);
        Cuestionario objCuestionarioCreado = objGestionarCuestionarioCUInt.crearCuestionario(modelMapper.map(objCuestionarioCrear, Cuestionario.class));
        ResponseEntity<CuestionarioDTORespuesta> objRespuesta = new ResponseEntity<CuestionarioDTORespuesta>(
                modelMapper.map(objCuestionarioCreado, CuestionarioDTORespuesta.class),
                HttpStatus.CREATED);
        return objRespuesta;
    }


    @GetMapping("/cuestionarios")
    public ResponseEntity<List<CuestionarioDTORespuesta>> listar() {
        Iterable<Cuestionario> cuestionarios = this.objGestionarCuestionarioCUInt.listarCuestionarios();
        List<CuestionarioDTORespuesta> listCuestionarios = this.modelMapper.map(cuestionarios,
                new TypeToken<List<CuestionarioDTORespuesta>>() {
                }.getType());
        ResponseEntity<List<CuestionarioDTORespuesta>> objRespuesta = new ResponseEntity<List<CuestionarioDTORespuesta>>
                (listCuestionarios,
                        HttpStatus.OK
                );
        return objRespuesta;
    }


    @PostMapping("/registrar-respuestas")
    public ResponseEntity<?> registrarRespuestas(@RequestBody Map<String, Object> request) {
        try{
            // Extraer los objetos del mapa
            ObjectMapper mapper = new ObjectMapper();

            UsuarioDTOPeticion Usuario = mapper.convertValue(request.get("Usuario"), UsuarioDTOPeticion.class);
            CuestionarioDTOPeticion cuestionario = mapper.convertValue(request.get("cuestionario"), CuestionarioDTOPeticion.class);
            List<PreguntaDTOPeticion> preguntas = mapper.convertValue(request.get("preguntas"), new TypeReference<List<PreguntaDTOPeticion>>() {});

            Usuario objUsuarioCrear = modelMapper.map(Usuario,Usuario.class);
            Cuestionario objCuestionarioCrear = modelMapper.map(cuestionario,Cuestionario.class);
            List<Pregunta> objPreguntas = preguntas.stream()
                    .map(preguntaDTO -> modelMapper.map(preguntaDTO, Pregunta.class))
                    .collect(Collectors.toList());

            objRespuestaGatewayAdapter.registrarRespuesta(objUsuarioCrear, objCuestionarioCrear, objPreguntas);
            return ResponseEntity.ok().build();
        }catch (UsuarioYaRespondioException e) {
            Error error = ErrorUtils.crearError(CodigoError.VIOLACION_REGLA_DE_NEGOCIO.getCodigo(), e.getMessage(), HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Error error = ErrorUtils.crearError(CodigoError.ERROR_GENERICO.getCodigo(), CodigoError.ERROR_GENERICO.getLlaveMensaje(), HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }


    @GetMapping("/consultar-respuestas")
    public ResponseEntity<List<RespuestaDTORespuesta>> consultarRespuestas(@RequestParam Integer idUsuario) {
        System.out.println(" contrrolle idUsuario: " + idUsuario);
        UsuarioDTORespuesta Usuario = this.objGestionarUsuarioCUInt.obtenerUsuarioDTOPorId(idUsuario);
        System.out.println("UsuarioDTO: " + Usuario.toString() + Usuario.getNombres());

        Iterable<Respuesta> resp = this.objGestionarCuestionarioCUInt.listarCuestionariosPorUsuario(idUsuario);
        List<RespuestaDTORespuesta> listaRespuestas = this.modelMapper.map(resp,
                new TypeToken<List<RespuestaDTORespuesta>>() {
                }.getType());
        for (RespuestaDTORespuesta respuesta : listaRespuestas) {
            CuestionarioDTORespuesta cuestionario = this.objGestionarCuestionarioCUInt.obtenerCuestionarioDTOPorRespuesta(respuesta.getIdrespuesta());

            List<PreguntaDTORespuesta> preguntas = objGestionarCuestionarioCUInt.obtenerPreguntasPorCuestionario(cuestionario.getIdcuestionario());
            objRespuestaGatewayAdapter.consultarRespuesta(Usuario, cuestionario, preguntas);

            respuesta.setObjCuestionario(cuestionario);
            respuesta.setObjUsuario(Usuario);
            respuesta.setPreguntas(preguntas);

        }

        return new ResponseEntity<>(listaRespuestas, HttpStatus.OK);
    }




}


