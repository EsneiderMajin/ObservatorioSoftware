package com.observatorio.Observatorio_Software.infrastructure.output.persistencia.gateway;

import com.observatorio.Observatorio_Software.aplication.output.GestionarUsuarioGatewayIntPort;
import com.observatorio.Observatorio_Software.domain.models.Usuario;
import com.observatorio.Observatorio_Software.infrastructure.input.DTOResponse.UsuarioDTORespuesta;
import com.observatorio.Observatorio_Software.infrastructure.output.persistencia.entidades.UsuarioEntity;
import com.observatorio.Observatorio_Software.infrastructure.output.persistencia.repositorios.UsuarioRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class GestionarUsuarioGatewayImplAdapter implements GestionarUsuarioGatewayIntPort {

    private final ModelMapper UsuarioModelMapper;
    private final UsuarioRepository objUsuarioRepository;

    public GestionarUsuarioGatewayImplAdapter( UsuarioRepository objUsuarioRepository,
                                               ModelMapper UsuarioModelMapper
    ){
        this.objUsuarioRepository = objUsuarioRepository;
        this.UsuarioModelMapper = UsuarioModelMapper;
    }

    @Override
    public boolean existeUsuarioPorCorreo(String correo) {
        return this.objUsuarioRepository.existsByCorreo(correo);
    }

    @Override
    public Usuario guardar(Usuario objUsuario) {
        if (objUsuario == null) {
            throw new IllegalArgumentException("El objeto Usuario no puede ser nulo");
        }
        UsuarioEntity objUsuarioEntity = UsuarioModelMapper.map(objUsuario, UsuarioEntity.class);

        UsuarioEntity objUsuarioEntityCreado = this.objUsuarioRepository.save(objUsuarioEntity);

        Usuario objUsuarioRespuesta = this.UsuarioModelMapper.map(objUsuarioEntityCreado, Usuario.class);
        return objUsuarioRespuesta;
    }

    @Override
    public List<Usuario> listar() {
        Iterable<UsuarioEntity> lista = this.objUsuarioRepository.findAll();
        List<Usuario> listaObtenida = this.UsuarioModelMapper.map(lista, new TypeToken<List<Usuario>>() {
        }.getType());
        return listaObtenida;
    }


    @Override
    public UsuarioDTORespuesta consultarUsuarioPorId(int id) {
        return this.UsuarioModelMapper.map(this.objUsuarioRepository.findById(id).get(), UsuarioDTORespuesta.class);
    }

}