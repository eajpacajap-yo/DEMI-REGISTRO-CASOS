package com.administracion.administracion.dto;

public class CrearSeguimientoDto {

    private Long casoId;
    private Long usuarioId;
    private String etapaProcesal;
    private String descripcionAvance;

    public CrearSeguimientoDto() {
    }

    public CrearSeguimientoDto(Long casoId, Long usuarioId, String etapaProcesal, String descripcionAvance) {
        this.casoId = casoId;
        this.usuarioId = usuarioId;
        this.etapaProcesal = etapaProcesal;
        this.descripcionAvance = descripcionAvance;
    }

    public Long getCasoId() {
        return casoId;
    }

    public void setCasoId(Long casoId) {
        this.casoId = casoId;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getEtapaProcesal() {
        return etapaProcesal;
    }

    public void setEtapaProcesal(String etapaProcesal) {
        this.etapaProcesal = etapaProcesal;
    }

    public String getDescripcionAvance() {
        return descripcionAvance;
    }

    public void setDescripcionAvance(String descripcionAvance) {
        this.descripcionAvance = descripcionAvance;
    }
}