package com.administracion.administracion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.administracion.administracion.model.RecursoMultimedia;;
@Repository
public interface RecursoMultimediaRepository extends JpaRepository<RecursoMultimedia, Integer> {

    // Consulta para que la PWA obtenga solo los recursos activos de una pantalla
    List<RecursoMultimedia> findByModuloPwaAndActivoTrue(String moduloPwa);

    // Consulta para que el panel de administración filtre por tipo (ej. ver todas las imágenes)
    List<RecursoMultimedia> findByTipoRecursoAndActivoTrue(String tipoRecurso);
}