package com.observatorio.Observatorio_Software.infrastructure.output.persistencia.gateway;

import com.observatorio.Observatorio_Software.aplication.output.GestionarCuestionarioGatewayIntPort;
import com.observatorio.Observatorio_Software.domain.models.Cuestionario;
import com.observatorio.Observatorio_Software.domain.models.Respuesta;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.CuestionarioDTORespuesta;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.PreguntaDTORespuesta;
import com.observatorio.Observatorio_Software.infrastructure.output.persistencia.entidades.CuestionarioEntity;
import com.observatorio.Observatorio_Software.infrastructure.output.persistencia.entidades.PreguntaEntity;
import com.observatorio.Observatorio_Software.infrastructure.output.persistencia.entidades.RespuestaEntity;
import com.observatorio.Observatorio_Software.infrastructure.output.persistencia.entidades.TipoPreguntaEntity;
import com.observatorio.Observatorio_Software.infrastructure.output.persistencia.repositorios.CuestionarioRepository;
import com.observatorio.Observatorio_Software.infrastructure.output.persistencia.repositorios.PreguntasRepository;
import com.observatorio.Observatorio_Software.infrastructure.output.persistencia.repositorios.RespuestasRepository;
import com.observatorio.Observatorio_Software.infrastructure.output.persistencia.repositorios.TipoPreguntasRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GestionarCuestionarioGatewayImplAdapter implements GestionarCuestionarioGatewayIntPort {

    private final CuestionarioRepository objCuestionarioRepository;
    private final RespuestasRepository objRespuestaRepository;
    private final ModelMapper CuestionarioModelMapper;
    private final TipoPreguntasRepository tipoPreguntaRepository;
    private final PreguntasRepository objPreguntaRepository;

    public GestionarCuestionarioGatewayImplAdapter(CuestionarioRepository objCuestionarioRepository, RespuestasRepository objRespuestaRepository,
                                                   ModelMapper CuestionarioModelMapper, TipoPreguntasRepository tipoPreguntaRepository,
                                                   PreguntasRepository objPreguntaRepository){
        this.objCuestionarioRepository = objCuestionarioRepository;
        this.objRespuestaRepository = objRespuestaRepository;
        this.CuestionarioModelMapper = CuestionarioModelMapper;
        this.tipoPreguntaRepository = tipoPreguntaRepository;
        this.objPreguntaRepository = objPreguntaRepository;
    }

    @Override
    public boolean existeCuestionarioPorTitulo(String titulo) {
        return this.objCuestionarioRepository.existeCuestionarioPorTitulo(titulo) == 1;
    }

    //
    @Override
    public Cuestionario guardarCuestionario(Cuestionario objCuestionario) {
        // Mapeo de las preguntas asociadas
        CuestionarioEntity objCuestionarioEntity = this.CuestionarioModelMapper.map(objCuestionario, CuestionarioEntity.class);
        List<PreguntaEntity> objPreguntaEntity = objCuestionario.getPreguntas().stream()
                .map(pregunta -> {
                    PreguntaEntity preguntaEntity = CuestionarioModelMapper.map(pregunta, PreguntaEntity.class);
                    //==========
                    // Buscar y asignar TipoPreguntaEntity existente revisar por que no esta haciendo la relacion
                    TipoPreguntaEntity tipoPreguntaEntity = tipoPreguntaRepository.findById(pregunta.getObjTipoPregunta().getIdTipoPregunta())
                            .orElseThrow(() -> new IllegalArgumentException("TipoPreguntaEntity no encontrada con ID: " + pregunta.getObjTipoPregunta().getIdTipoPregunta()));

                    preguntaEntity.setObjTipoPregunta(tipoPreguntaEntity);
                    //========
                    // Establecer la relación con el cuestionario
                    preguntaEntity.setObjCuestionario(objCuestionarioEntity);
                    return preguntaEntity;
                })
                .collect(Collectors.toList());

        // Asignar las preguntas al cuestionario
        // objCuestionario.setPreguntas(objPreguntaEntity.stream()
        // .map(CuestionarioModelMapper::mapToDomain) // Mapear de vuelta a entidades de dominio
        // .collect(Collectors.toList()));
        objCuestionarioEntity.setPreguntas(objPreguntaEntity);
        //revisar va o no
        //objPreguntaEntity.forEach(pregunta -> pregunta.setObjCuestionario(objCuestionarioEntity));
        //PreguntaEntity objPreguntaEntity = this.CuestionarioModelMapper(objCuestionario.getPreguntas(),PreguntaEntity.class);

        CuestionarioEntity objCuestionarioEntityCreado = this.objCuestionarioRepository.save(objCuestionarioEntity);
        Cuestionario objCuestionarioRespuesta = this.CuestionarioModelMapper.map(objCuestionarioEntityCreado, Cuestionario.class);
        return objCuestionarioRespuesta;
    }


    @Override
    public List<Cuestionario> listarCuestionarios() {
        Iterable<CuestionarioEntity> lista = this.objCuestionarioRepository.findAll();
        List<Cuestionario> listaObtenida = this.CuestionarioModelMapper.map(lista, new TypeToken<List<Cuestionario>>() {
        }.getType());
        return listaObtenida;
    }

    @Override
    public List<Cuestionario> listarRespuestasCuestionarios() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'listarRespuestasCuestionarios'");
    }

    @Override
    public Cuestionario asignarPreguntaCuestionario(Integer idPregunta) {
        return null;
    }

    @Override
    public Cuestionario consultarCuestionarioPorTitulo(String titulo) {
        return this.CuestionarioModelMapper.map(this.objCuestionarioRepository.findByTitulo(titulo), Cuestionario.class);
    }

    @Override
    public List<CuestionarioDTORespuesta> consultarCuestionarioPorPatron(String titulo) {
        System.out.println("patron " + titulo);

        Iterable<CuestionarioEntity> cuestionario = this.objCuestionarioRepository.findByTituloIgnoreCaseContainingOrderByIdcuestionario(titulo);;
        List<CuestionarioDTORespuesta> listCuestionarios = this.CuestionarioModelMapper.map(cuestionario, new TypeToken<List<CuestionarioDTORespuesta>>() {
        }.getType());
        return listCuestionarios;
    }

    @Override
    public List<Respuesta> listarCuestionariosPorUsuario(Integer Usuario) {
        Iterable<RespuestaEntity> respuestas = this.objRespuestaRepository.findByidUsuario(Usuario);
        List<Respuesta> listaObtenida = this.CuestionarioModelMapper.map(respuestas, new TypeToken<List<Respuesta>>() {
        }.getType());
        return listaObtenida;
    }

    @Override
    public List<PreguntaDTORespuesta> obtenerPreguntasDTOPorCuestionario(Integer idCuestionario) {
        System.out.println("que hay:" + idCuestionario);
        List<PreguntaEntity> preguntas = objPreguntaRepository.findByObjCuestionarioIdcuestionario(idCuestionario);

        List<PreguntaDTORespuesta> listaObtenida = preguntas.stream()
                .map(preguntaEntity -> CuestionarioModelMapper.map(preguntaEntity, PreguntaDTORespuesta.class))
                .collect(Collectors.toList());

        return listaObtenida;
    }

    @Override
    public CuestionarioDTORespuesta obtenerCuestionarioDTOPorRespuesta(Integer idRespuesta) {
        Integer idPregunta = this.objRespuestaRepository.findById(idRespuesta).get().getObjPregunta().getIdpregunta();
        Integer idCuestionario = this.objPreguntaRepository.findById(idPregunta).get().getObjCuestionario().getIdcuestionario();
        return this.CuestionarioModelMapper.map(this.objCuestionarioRepository.findById(idCuestionario).get(), CuestionarioDTORespuesta.class);
    }



}