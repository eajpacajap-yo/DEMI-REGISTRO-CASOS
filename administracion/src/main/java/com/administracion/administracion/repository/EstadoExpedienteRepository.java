package com.administracion.administracion.repository;

import com.administracion.administracion.model.EstadoExpediente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EstadoExpedienteRepository extends JpaRepository<EstadoExpediente, Long> {
}