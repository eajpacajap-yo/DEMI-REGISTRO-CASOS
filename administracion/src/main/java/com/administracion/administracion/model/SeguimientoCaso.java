package com.administracion.administracion.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "seguimientos_caso")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class SeguimientoCaso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "caso_id", nullable = false)
    private Caso caso;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "etapa_procesal", nullable = false, length = 100)
    private String etapaProcesal;

    @Column(name = "descripcion_avance", nullable = false, columnDefinition = "TEXT")
    private String descripcionAvance;

    @Column(name = "fecha_atencion", nullable = false, updatable = false)
    private LocalDateTime fechaAtencion = LocalDateTime.now();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Caso getCaso() {
        return caso;
    }

    public void setCaso(Caso caso) {
        this.caso = caso;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
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

    public LocalDateTime getFechaAtencion() {
        return fechaAtencion;
    }

    public void setFechaAtencion(LocalDateTime fechaAtencion) {
        this.fechaAtencion = fechaAtencion;
    }

    public SeguimientoCaso(Long id, Caso caso, Usuario usuario, String etapaProcesal, String descripcionAvance,
            LocalDateTime fechaAtencion) {
        this.id = id;
        this.caso = caso;
        this.usuario = usuario;
        this.etapaProcesal = etapaProcesal;
        this.descripcionAvance = descripcionAvance;
        this.fechaAtencion = fechaAtencion;
    }

    public SeguimientoCaso() {
    }

    
}