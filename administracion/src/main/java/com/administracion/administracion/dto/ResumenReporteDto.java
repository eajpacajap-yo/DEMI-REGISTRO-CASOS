package com.administracion.administracion.dto;

import java.util.Map;

public class ResumenReporteDto {
    private long totalCasos;
    private Map<String, Long> casosPorMunicipio;
    private Map<String, Long> casosPorTipoViolencia;
    private Map<String, Long> casosPorEstado;

    // 1. Constructor vacío 
    public ResumenReporteDto() {}

    // 2. Constructor con los 4 parámetros exactos que llama el controlador
    public ResumenReporteDto(long totalCasos, 
                             Map<String, Long> casosPorMunicipio, 
                             Map<String, Long> casosPorTipoViolencia, 
                             Map<String, Long> casosPorEstado) {
        this.totalCasos = totalCasos;
        this.casosPorMunicipio = casosPorMunicipio;
        this.casosPorTipoViolencia = casosPorTipoViolencia;
        this.casosPorEstado = casosPorEstado;
    }

    public long getTotalCasos() { 
        return totalCasos; 
    }
    
    public void setTotalCasos(long totalCasos) { 
        this.totalCasos = totalCasos; 
    }

    public Map<String, Long> getCasosPorMunicipio() { 
        return casosPorMunicipio; 
    }
    
    public void setCasosPorMunicipio(Map<String, Long> casosPorMunicipio) { 
        this.casosPorMunicipio = casosPorMunicipio; 
    }

    public Map<String, Long> getCasosPorTipoViolencia() { 
        return casosPorTipoViolencia; 
    }
    
    public void setCasosPorTipoViolencia(Map<String, Long> casosPorTipoViolencia) { 
        this.casosPorTipoViolencia = casosPorTipoViolencia; 
    }

    public Map<String, Long> getCasosPorEstado() { 
        return casosPorEstado; 
    }
    
    public void setCasosPorEstado(Map<String, Long> casosPorEstado) { 
        this.casosPorEstado = casosPorEstado; 
    }
}