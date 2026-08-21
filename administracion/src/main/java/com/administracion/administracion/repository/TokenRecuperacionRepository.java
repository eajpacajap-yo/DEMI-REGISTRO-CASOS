
package com.administracion.administracion.repository;

import com.administracion.administracion.model.TokenRecuperacion;
import com.administracion.administracion.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TokenRecuperacionRepository extends JpaRepository<TokenRecuperacion, Long> {
    Optional<TokenRecuperacion> findByCodigo(String codigo);
    Optional<TokenRecuperacion> findByUsuario(Usuario usuario);
    void deleteByUsuario(Usuario usuario);
}