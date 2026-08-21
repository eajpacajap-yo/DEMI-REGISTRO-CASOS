package com.administracion.administracion.repository;

import com.administracion.administracion.model.Caso;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface CasoRepository extends JpaRepository<Caso, Long> {
    
    // Buscar un expediente por su código anonimizado (Ej: TOT-2026-0001)
    Optional<Caso> findByCodigoExpediente(String codigoExpediente);
    
    // Filtrar casos por municipio para reportes o paneles
    List<Caso> findByMunicipioId(Long municipioId);
    
    // Verificar existencia del expediente antes de guardar
    boolean existsByCodigoExpediente(String codigoExpediente);
}
