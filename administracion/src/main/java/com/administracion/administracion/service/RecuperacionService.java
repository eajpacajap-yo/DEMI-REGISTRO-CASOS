package com.administracion.administracion.service;

import com.administracion.administracion.dto.RestablecerPasswordDto;
import com.administracion.administracion.dto.SolicitarRecuperacionDto;
import com.administracion.administracion.model.TokenRecuperacion;
import com.administracion.administracion.model.Usuario;
import com.administracion.administracion.repository.TokenRecuperacionRepository;
import com.administracion.administracion.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class RecuperacionService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TokenRecuperacionRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public String generarCodigoRecuperacion(SolicitarRecuperacionDto dto) {
        Usuario usuario = usuarioRepository.findByCorreo(dto.getCorreo())
                .orElseThrow(() -> new RuntimeException("El correo ingresado no se encuentra registrado en el sistema."));

        if (!usuario.getActivo()) {
            throw new RuntimeException("La cuenta de usuario se encuentra inactiva. Contacte a la administradora.");
        }

        // Eliminar token previo si ya existía uno para este usuario
        tokenRepository.deleteByUsuario(usuario);

        // Generar PIN aleatorio de 6 dígitos
        SecureRandom random = new SecureRandom();
        int numero = 100000 + random.nextInt(900000);
        String pin = String.valueOf(numero);

        // Válido por 10 minutos
        LocalDateTime expiracion = LocalDateTime.now().plusMinutes(10);

        TokenRecuperacion token = new TokenRecuperacion(pin, usuario, expiracion);
        tokenRepository.save(token);

        //  Salida en consola de Spring Boot para fines de prueba/demostración
        System.out.println(" CÓDIGO DE RECUPERACIÓN GENERADO: " + pin);
        System.out.println("USUARIA: " + usuario.getPrimerNombre() + " (" + usuario.getCorreo() + ")");
        System.out.println(" VÁLIDO HASTA: " + expiracion);
        

        return pin;
    }

    @Transactional
    public void restablecerPassword(RestablecerPasswordDto dto) {
        TokenRecuperacion token = tokenRepository.findByCodigo(dto.getCodigo().trim())
                .orElseThrow(() -> new RuntimeException("El código de recuperación es inválido o no existe."));

        if (token.getFechaExpiracion().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(token);
            throw new RuntimeException("El código de recuperación ha expirado (límite de 10 minutos). Solicite uno nuevo.");
        }

        if (dto.getNuevoPassword() == null || dto.getNuevoPassword().trim().length() < 12) {
            throw new RuntimeException("La nueva contraseña debe tener al menos 12 caracteres.");
        }

        Usuario usuario = token.getUsuario();
        usuario.setPasswordHash(passwordEncoder.encode(dto.getNuevoPassword().trim()));
        usuarioRepository.save(usuario);

        // Eliminar el token usado para que no se reutilice
        tokenRepository.delete(token);
    }
}