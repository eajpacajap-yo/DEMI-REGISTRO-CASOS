package com.administracion.administracion.dto;

public class CambiarPasswordDto {

    private String passwordActual;
    private String nuevoPassword;

    public CambiarPasswordDto() {}

    public CambiarPasswordDto(String passwordActual, String nuevoPassword) {
        this.passwordActual = passwordActual;
        this.nuevoPassword = nuevoPassword;
    }

    public String getPasswordActual() {
        return passwordActual;
    }

    public void setPasswordActual(String passwordActual) {
        this.passwordActual = passwordActual;
    }

    public String getNuevoPassword() {
        return nuevoPassword;
    }

    public void setNuevoPassword(String nuevoPassword) {
        this.nuevoPassword = nuevoPassword;
    }
}