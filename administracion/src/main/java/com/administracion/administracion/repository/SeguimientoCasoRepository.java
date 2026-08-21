package com.administracion.administracion.repository;

import com.administracion.administracion.model.SeguimientoCaso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

public interface SeguimientoCasoRepository extends JpaRepository<SeguimientoCaso, Long> {

    // Obtener el historial de un expediente ordenado por fecha
    List<SeguimientoCaso> findByCasoIdOrderByFechaAtencionDesc(Long casoId);
}