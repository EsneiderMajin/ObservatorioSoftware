package com.observatorio.Observatorio_Software.domain.usesCases;

import com.observatorio.Observatorio_Software.aplication.input.GestionarUsuarioCUIntPort;
import com.observatorio.Observatorio_Software.aplication.output.CuestionarioFormateadorResultadoIntPort;
import com.observatorio.Observatorio_Software.aplication.output.GestionarUsuarioGatewayIntPort;
import com.observatorio.Observatorio_Software.domain.models.Usuario;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.UsuarioDTORespuesta;

import java.util.List;

public class GestionarUsuarioCUAdapter implements GestionarUsuarioCUIntPort {

    private final GestionarUsuarioGatewayIntPort objGestionarUsuarioGateway;
    private final CuestionarioFormateadorResultadoIntPort objCuestionarioFormateadorResultados;

    public GestionarUsuarioCUAdapter(GestionarUsuarioGatewayIntPort objManagementUsuarioGateway,
                                     CuestionarioFormateadorResultadoIntPort objCuestionarioFormateadorResultados){
        this.objGestionarUsuarioGateway = objManagementUsuarioGateway;
        this.objCuestionarioFormateadorResultados = objCuestionarioFormateadorResultados;
    }


    @Override
    public Usuario registrarUsuario(Usuario objUsuario) {
        Usuario objUsuarioCreado = null;
        if (this.objGestionarUsuarioGateway.existeUsuarioPorCorreo(objUsuario.getCorreo())) {
            this.objCuestionarioFormateadorResultados.
                    retornarRespuestaErrorEntidadExiste("Error. Ya existe un Usuario con ese correo ");
        }else{
            objUsuarioCreado = this.objGestionarUsuarioGateway.guardar(objUsuario);
        }
        return objUsuarioCreado;
    }



    @Override
    public List<Usuario> listar() {
        //List<Usuario> listaObtenida = objGestionarUsuarioateway.listar();
        //return listaObtenida;
        return this.objGestionarUsuarioGateway.listar();
    }

    @Override
    public UsuarioDTORespuesta obtenerUsuarioDTOPorId(int idUsuario) {
        System.out.println("1 ID Usuario: "+idUsuario);
        return this.objGestionarUsuarioGateway.consultarUsuarioPorId(idUsuario);

    }


}
