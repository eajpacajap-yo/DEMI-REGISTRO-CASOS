package com.administracion.administracion.repository;

import com.administracion.administracion.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Método clave para el Login con JWT
    Optional<Usuario> findByCorreo(String correo);
    
    // Para validar que no se dupliquen correos
    boolean existsByCorreo(String correo);
}