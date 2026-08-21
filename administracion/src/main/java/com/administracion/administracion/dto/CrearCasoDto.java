package com.administracion.administracion.dto;

public class CrearCasoDto {

    private String codigoExpediente;
    private Long municipioId;
    private String localidad;
    private Long tipoViolenciaId;
    private Long estadoId;
    private Long usuarioRegistroId;

    public CrearCasoDto() {
    }

    public CrearCasoDto(String codigoExpediente, Long municipioId, String localidad, Long tipoViolenciaId, Long estadoId, Long usuarioRegistroId) {
        this.codigoExpediente = codigoExpediente;
        this.municipioId = municipioId;
        this.localidad = localidad;
        this.tipoViolenciaId = tipoViolenciaId;
        this.estadoId = estadoId;
        this.usuarioRegistroId = usuarioRegistroId;
    }

    public String getCodigoExpediente() {
        return codigoExpediente;
    }

    public void setCodigoExpediente(String codigoExpediente) {
        this.codigoExpediente = codigoExpediente;
    }

    public Long getMunicipioId() {
        return municipioId;
    }

    public void setMunicipioId(Long municipioId) {
        this.municipioId = municipioId;
    }

    public String getLocalidad() {
        return localidad;
    }

    public void setLocalidad(String localidad) {
        this.localidad = localidad;
    }

    public Long getTipoViolenciaId() {
        return tipoViolenciaId;
    }

    public void setTipoViolenciaId(Long tipoViolenciaId) {
        this.tipoViolenciaId = tipoViolenciaId;
    }

    public Long getEstadoId() {
        return estadoId;
    }

    public void setEstadoId(Long estadoId) {
        this.estadoId = estadoId;
    }

    public Long getUsuarioRegistroId() {
        return usuarioRegistroId;
    }

    public void setUsuarioRegistroId(Long usuarioRegistroId) {
        this.usuarioRegistroId = usuarioRegistroId;
    }
}