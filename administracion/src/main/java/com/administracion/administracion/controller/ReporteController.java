package com.administracion.administracion.controller;

import com.administracion.administracion.dto.ResumenReporteDto;
import com.administracion.administracion.model.Caso;
import com.administracion.administracion.repository.CasoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class ReporteController {

    private final CasoRepository casoRepository;

    public ReporteController(CasoRepository casoRepository) {
        this.casoRepository = casoRepository;
    }

    @GetMapping("/resumen")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRABAJADORA')")
    public ResponseEntity<ResumenReporteDto> obtenerResumenGeneral() {
        List<Caso> expedientes = casoRepository.findAll();

        long totalCasos = expedientes.size();

        Map<String, Long> porMunicipio = new HashMap<>();
        Map<String, Long> porTipo = new HashMap<>();
        Map<String, Long> porEstado = new HashMap<>();

        // Recorrido seguro sin problemas de genéricos ni lambdas complejas
        for (Caso c : expedientes) {
            // Conteo por Municipio
            if (c.getMunicipio() != null && c.getMunicipio().getNombre() != null) {
                String muni = c.getMunicipio().getNombre();
                porMunicipio.put(muni, porMunicipio.getOrDefault(muni, 0L) + 1);
            }

            // Conteo por Tipo de Violencia
            if (c.getTipoViolencia() != null && c.getTipoViolencia().getNombre() != null) {
                String tipo = c.getTipoViolencia().getNombre();
                porTipo.put(tipo, porTipo.getOrDefault(tipo, 0L) + 1);
            }

            // Conteo por Estado Procesal
            if (c.getEstado() != null && c.getEstado().getNombre() != null) {
                String estado = c.getEstado().getNombre();
                porEstado.put(estado, porEstado.getOrDefault(estado, 0L) + 1);
            }
        }

        // Instancia del DTO limpio
       ResumenReporteDto resumen = new ResumenReporteDto();
        resumen.setTotalCasos(totalCasos);
        resumen.setCasosPorMunicipio(porMunicipio);
        resumen.setCasosPorTipoViolencia(porTipo);
        resumen.setCasosPorEstado(porEstado);

        return ResponseEntity.ok(resumen);  
        
    }
}