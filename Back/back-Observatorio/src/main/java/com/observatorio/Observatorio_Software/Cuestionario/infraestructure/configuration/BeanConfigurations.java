package com.observatorio.Observatorio_Software.Cuestionario.infraestructure.configuration;

import com.observatorio.Observatorio_Software.Cuestionario.domain.usescases.GestionarCuestionarioCUAdapter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfigurations {
    //temporal
    @Bean
    public GestionarCuestionarioCUAdapter gestionarCuestionarioCUAdapter() {
        return new GestionarCuestionarioCUAdapter();
    }
}
