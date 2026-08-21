package com.administracion.administracion.dto;

public class RestablecerPasswordDto {
    private String codigo;
    private String nuevoPassword;

    public RestablecerPasswordDto() {}

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getNuevoPassword() { return nuevoPassword; }
    public void setNuevoPassword(String nuevoPassword) { this.nuevoPassword = nuevoPassword; }
}