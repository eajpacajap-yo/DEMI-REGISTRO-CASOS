package com.administracion.administracion.service;

import com.administracion.administracion.dto.CrearCasoDto;
import com.administracion.administracion.model.*;
import com.administracion.administracion.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CasoService {

    @Autowired
    private CasoRepository casoRepository;

    @Autowired
    private MunicipioRepository municipioRepository;

    @Autowired
    private TipoViolenciaRepository tipoViolenciaRepository;

    @Autowired
    private EstadoExpedienteRepository estadoExpedienteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Caso> listarTodos() {
        return casoRepository.findAll();
    }

    public Caso obtenerPorId(Long id) {
        return casoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expediente no encontrado con ID: " + id));
    }

    public Caso crearCaso(CrearCasoDto dto) {
        Municipio municipio = municipioRepository.findById(dto.getMunicipioId())
                .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
        TipoViolencia tipoViolencia = tipoViolenciaRepository.findById(dto.getTipoViolenciaId())
                .orElseThrow(() -> new RuntimeException("Tipo de violencia no encontrado"));
        EstadoExpediente estado = estadoExpedienteRepository.findById(dto.getEstadoId())
                .orElseThrow(() -> new RuntimeException("Estado no encontrado"));
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioRegistroId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Caso caso = new Caso();
        caso.setCodigoExpediente(dto.getCodigoExpediente());
        caso.setMunicipio(municipio);
        caso.setLocalidad(dto.getLocalidad());
        caso.setTipoViolencia(tipoViolencia);
        caso.setEstado(estado);
        caso.setUsuarioRegistro(usuario);

        return casoRepository.save(caso);
    }

    public Caso actualizarCaso(Long id, CrearCasoDto dto) {
        Caso caso = obtenerPorId(id);

        Municipio municipio = municipioRepository.findById(dto.getMunicipioId())
                .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
        TipoViolencia tipoViolencia = tipoViolenciaRepository.findById(dto.getTipoViolenciaId())
                .orElseThrow(() -> new RuntimeException("Tipo de violencia no encontrado"));
        EstadoExpediente estado = estadoExpedienteRepository.findById(dto.getEstadoId())
                .orElseThrow(() -> new RuntimeException("Estado no encontrado"));

        caso.setMunicipio(municipio);
        caso.setLocalidad(dto.getLocalidad());
        caso.setTipoViolencia(tipoViolencia);
        caso.setEstado(estado);

        return casoRepository.save(caso);
    }

    public void eliminarCaso(Long id) {
        if (!casoRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar: Caso no encontrado con ID: " + id);
        }
        casoRepository.deleteById(id);
    }
}