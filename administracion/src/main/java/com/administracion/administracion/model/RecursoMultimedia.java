package com.administracion.administracion.model; 

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recursos_multimedia")
public class RecursoMultimedia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(name = "tipo_recurso", nullable = false, length = 30)
    private String tipoRecurso; // "IMAGEN" o "AUDIO"

    @Column(name = "idioma_id", nullable = false)
    private Integer idiomaId;

    @Column(name = "tipo_violencia_id")
    private Integer tipoViolenciaId;

    @Column(name = "modulo_pwa", nullable = false, length = 50)
    private String moduloPwa; // "galeria", "prevencion", "ruta-denuncia", "asesoria"

    @Column(name = "ruta_almacenamiento", nullable = false, length = 255)
    private String rutaAlmacenamiento;

    @Column(name = "descripcion_es", columnDefinition = "TEXT")
    private String descripcionEs;

    @Column(name = "descripcion_quc", columnDefinition = "TEXT")
    private String descripcionQuc;

    @Column(nullable = false)
    private Integer version = 1;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "creado_en")
    private LocalDateTime creadoEn = LocalDateTime.now();

    // Constructores
    public RecursoMultimedia() {}

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getTipoRecurso() { return tipoRecurso; }
    public void setTipoRecurso(String tipoRecurso) { this.tipoRecurso = tipoRecurso; }

    public Integer getIdiomaId() { return idiomaId; }
    public void setIdiomaId(Integer idiomaId) { this.idiomaId = idiomaId; }

    public Integer getTipoViolenciaId() { return tipoViolenciaId; }
    public void setTipoViolenciaId(Integer tipoViolenciaId) { this.tipoViolenciaId = tipoViolenciaId; }

    public String getModuloPwa() { return moduloPwa; }
    public void setModuloPwa(String moduloPwa) { this.moduloPwa = moduloPwa; }

    public String getRutaAlmacenamiento() { return rutaAlmacenamiento; }
    public void setRutaAlmacenamiento(String rutaAlmacenamiento) { this.rutaAlmacenamiento = rutaAlmacenamiento; }

    public String getDescripcionEs() { return descripcionEs; }
    public void setDescripcionEs(String descripcionEs) { this.descripcionEs = descripcionEs; }

    public String getDescripcionQuc() { return descripcionQuc; }
    public void setDescripcionQuc(String descripcionQuc) { this.descripcionQuc = descripcionQuc; }

    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public LocalDateTime getCreadoEn() { return creadoEn; }
    public void setCreadoEn(LocalDateTime creadoEn) { this.creadoEn = creadoEn; }
}