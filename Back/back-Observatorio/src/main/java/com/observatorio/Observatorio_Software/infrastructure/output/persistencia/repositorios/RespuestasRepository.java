package com.observatorio.Observatorio_Software.infrastructure.output.persistencia.repositorios;

import com.observatorio.Observatorio_Software.infrastructure.output.persistencia.entidades.RespuestaEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface RespuestasRepository extends CrudRepository<RespuestaEntity, Integer> {

    @Query("SELECT p FROM RespuestaEntity p WHERE p.objUsuario.idUsuario = :idUsuario")
    List<RespuestaEntity> findByidUsuario(Integer idUsuario);

    @Query("SELECT p FROM RespuestaEntity p WHERE p.objPregunta.idpregunta = :idPregunta")
    List<RespuestaEntity> findByPregunta(Integer idPregunta);
    //prueba//
    // @Query("SELECT CASE WHEN COUNT(r) > 0 THEN TRUE ELSE FALSE END FROM Respuesta r WHERE r.idUsuario = ?1 AND r.cuestionario = ?2")
    // boolean existsByUsuarioAndCuestionario(Usuario Usuario, Cuestionario cuestionario);
    //@Query("SELECT CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END AS Existe_Asociacion FROM Respuesta r WHERE r.idUsuario = ?1 AND r.idpregunta = ?2")
    //boolean existsByUsuarioAndCuestionario(Integer idUsuario,Integer idCuestionario);
    // Método para verificar si ya existe una respuesta de un Usuario para una pregunta
    boolean existsByObjUsuarioIdUsuarioAndObjPreguntaIdpregunta(int idUsuario, int idPregunta);

}