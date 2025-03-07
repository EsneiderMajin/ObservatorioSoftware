package com.observatorio.Observatorio_Software.infrastructure.output.persistencia.repositorios;

import com.observatorio.Observatorio_Software.infrastructure.output.persistencia.entidades.TipoPreguntaEntity;
import org.springframework.data.repository.CrudRepository;

public interface TipoPreguntasRepository extends CrudRepository<TipoPreguntaEntity, Integer> {

}
