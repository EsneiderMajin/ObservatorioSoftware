package com.observatorio.Observatorio_Software.infrastructure.output.persistencia.repositorios;

import com.observatorio.Observatorio_Software.infrastructure.output.persistencia.entidades.PreguntaEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PreguntasRepository extends CrudRepository<PreguntaEntity, Integer> {

    @Query("SELECT p FROM PreguntaEntity p WHERE p.objCuestionario.idcuestionario = :idCuestionario")
    List<PreguntaEntity> findByObjCuestionarioIdcuestionario(@Param("idCuestionario") Integer idCuestionario);
}