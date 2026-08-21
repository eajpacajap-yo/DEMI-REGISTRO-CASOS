package com.administracion.administracion.model;

import jakarta.persistence.*;


@Entity
@Table(name = "estados_expediente")

public class EstadoExpediente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String nombre;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public EstadoExpediente(Long id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    public EstadoExpediente() {
    }

    
}