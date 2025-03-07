package com.observatorio.Observatorio_Software.infrastructure.output.persistencia.repositorios;

import com.observatorio.Observatorio_Software.infrastructure.output.persistencia.entidades.CuestionarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CuestionarioRepository extends JpaRepository<CuestionarioEntity,Integer> {

    @Query("SELECT count(*) FROM CuestionarioEntity p  WHERE p.titulo=?1")
    Integer existeCuestionarioPorTitulo(String titulo);


    List<CuestionarioEntity> findByTituloIgnoreCaseContainingOrderByIdcuestionario(String patron);

    boolean existsByTitulo(@Param("titulo") String titulo);

    @Query("SELECT COUNT(p) > 0 FROM CuestionarioEntity p WHERE p.idcuestionario = :id")
    boolean existsById(@Param("id") String id);

    CuestionarioEntity findByTitulo(String titulo);


}