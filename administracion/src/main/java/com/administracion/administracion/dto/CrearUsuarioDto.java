package com.administracion.administracion.dto;

public class CrearUsuarioDto {
    private String primerNombre;
    private String segundoNombre;
    private String tercerNombre;
    private String primerApellido;
    private String segundoApellido;
    private String correo;
    private String password;
    private Long rolId; // ID del rol: 1 = ROLE_ADMIN, 2 = ROLE_PROFESIONAL / USUARIA

    public CrearUsuarioDto() {}

    public CrearUsuarioDto(String primerNombre, String segundoNombre, String tercerNombre, String primerApellido, String segundoApellido, String correo, String password, Long rolId) {
        this.primerNombre = primerNombre;
        this.segundoNombre = segundoNombre;
        this.tercerNombre = tercerNombre;
        this.primerApellido = primerApellido;
        this.segundoApellido = segundoApellido;
        this.correo = correo;
        this.password = password;
        this.rolId = rolId;
    }

    public String getPrimerNombre() { return primerNombre; }
    public void setPrimerNombre(String primerNombre) { this.primerNombre = primerNombre; }

    public String getSegundoNombre() { return segundoNombre; }
    public void setsegundoNombre(String segundoNombre) { this.segundoNombre = segundoNombre; }

    public String getTercerNombre() { return tercerNombre; }
    public void setTercerNombre(String tercerNombre) { this.tercerNombre = tercerNombre; }

    public String getPrimerApellido() { return primerApellido; }
    public void setPrimerApellido(String primerApellido) { this.primerApellido = primerApellido; }

    public String getSegundoApellido() { return segundoApellido; }
    public void setSegundoApellido(String segundoApellido) { this.segundoApellido = segundoApellido; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Long getRolId() { return rolId; }
    public void setRolId(Long rolId) { this.rolId = rolId; }
}
