package com.observatorio.Observatorio_Software.infrastructure.configuration;

import com.observatorio.Observatorio_Software.aplication.output.CuestionarioFormateadorResultadoIntPort;
import com.observatorio.Observatorio_Software.aplication.output.GestionarCuestionarioGatewayIntPort;
import com.observatorio.Observatorio_Software.aplication.output.GestionarUsuarioGatewayIntPort;
import com.observatorio.Observatorio_Software.domain.usesCases.GestionarCuestionarioCUAdapter;
import com.observatorio.Observatorio_Software.domain.usesCases.GestionarUsuarioCUAdapter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfigurations {

    @Bean
    public GestionarCuestionarioCUAdapter crearGestionarCuestionarioCUInt(
            GestionarCuestionarioGatewayIntPort objGestionarCuestionarioGateway,
            CuestionarioFormateadorResultadoIntPort objCuestionarioFormateadorRespuestas){
        GestionarCuestionarioCUAdapter objGestionarCuestionarioCU = new GestionarCuestionarioCUAdapter(objGestionarCuestionarioGateway,
                objCuestionarioFormateadorRespuestas);
        return objGestionarCuestionarioCU;
    }

    @Bean
    public GestionarUsuarioCUAdapter crearGestionarUsuarioCUInt(
            GestionarUsuarioGatewayIntPort objGestionarUsuarioGateway,
            CuestionarioFormateadorResultadoIntPort objUsuarioFormateadorResultados) {
        return new GestionarUsuarioCUAdapter(objGestionarUsuarioGateway, objUsuarioFormateadorResultados);
    }
}