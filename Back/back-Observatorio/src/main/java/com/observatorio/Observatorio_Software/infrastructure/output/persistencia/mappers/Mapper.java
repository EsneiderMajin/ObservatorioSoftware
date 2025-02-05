package com.observatorio.Observatorio_Software.infrastructure.output.persistencia.mappers;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/*
 * configuración centralizada de ModelMapper para la reutilización en la aplicación separación de preocupaciones
 * y tipos de datos fáciles de manejar
 * */
@Configuration
public class Mapper {
    @Bean
    public ModelMapper crearMapper() {
        ModelMapper mapper = new ModelMapper();
        return mapper;
    }
}
