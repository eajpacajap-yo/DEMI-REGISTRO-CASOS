package com.administracion.administracion.service;

import com.administracion.administracion.dto.CrearSeguimientoDto;
import com.administracion.administracion.model.Caso;
import com.administracion.administracion.model.SeguimientoCaso;
import com.administracion.administracion.model.Usuario;
import com.administracion.administracion.repository.CasoRepository;
import com.administracion.administracion.repository.SeguimientoCasoRepository;
import com.administracion.administracion.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeguimientoCasoService {

    @Autowired
    private SeguimientoCasoRepository seguimientoRepository;

    @Autowired
    private CasoRepository casoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<SeguimientoCaso> listarPorCaso(Long casoId) {
        return seguimientoRepository.findByCasoIdOrderByFechaAtencionDesc(casoId);
    }

    public SeguimientoCaso registrarSeguimiento(CrearSeguimientoDto dto) {
        Caso caso = casoRepository.findById(dto.getCasoId())
                .orElseThrow(() -> new RuntimeException("Expediente no encontrado con ID: " + dto.getCasoId()));

        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + dto.getUsuarioId()));

        SeguimientoCaso seguimiento = new SeguimientoCaso();
        seguimiento.setCaso(caso);
        seguimiento.setUsuario(usuario);
        seguimiento.setEtapaProcesal(dto.getEtapaProcesal());
        seguimiento.setDescripcionAvance(dto.getDescripcionAvance());

        return seguimientoRepository.save(seguimiento);
    }

    public SeguimientoCaso actualizarSeguimiento(Long id, CrearSeguimientoDto dto) {
        SeguimientoCaso seguimiento = seguimientoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seguimiento no encontrado con ID: " + id));

        seguimiento.setEtapaProcesal(dto.getEtapaProcesal());
        seguimiento.setDescripcionAvance(dto.getDescripcionAvance());

        return seguimientoRepository.save(seguimiento);
    }

    public void eliminarSeguimiento(Long id) {
        if (!seguimientoRepository.existsById(id)) {
            throw new RuntimeException("Seguimiento no encontrado con ID: " + id);
        }
        seguimientoRepository.deleteById(id);
    }
}