package com.observatorio.Observatorio_Software.infrastructure.output.persistencia.repositorios;

import com.observatorio.Observatorio_Software.infrastructure.output.persistencia.entidades.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UsuarioRepository extends JpaRepository<UsuarioEntity,Integer> {
    // @Query("SELECT COUNT(d) > 0 FROM UsuarioEntity d WHERE d.idpersona = :idpersona")
    // //@Query("SELECT COUNT(d) > 0 FROM UsuarioEntity d WHERE LOWER(CAST(d.idpersona AS string)) = LOWER(:idpersona)")
    // boolean existsByID(@Param("idpersona") String idpersona);

    // UsuarioEntity findById(int idpersona);

    @Query("SELECT COUNT(d) > 0 FROM UsuarioEntity d WHERE LOWER(d.correo) = LOWER(:correo)")
    boolean existsByCorreo(@Param("correo") String correo);

    UsuarioEntity findByCorreo(String correo);


    //
}