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

    @Autowired 
    private EmailService emailService;

    @Transactional
    public String generarCodigoRecuperacion(SolicitarRecuperacionDto dto) {
        Usuario usuario = usuarioRepository.findByCorreo(dto.getCorreo())
                .orElseThrow(() -> new RuntimeException("El correo ingresado no se encuentra registrado en el sistema."));

        if (usuario.getActivo() != null && !usuario.getActivo()) {
            throw new RuntimeException("La cuenta de usuario se encuentra inactiva. Contacte a la administradora.");
        }

        // Eliminar tokens previos que existían para este usuario
        tokenRepository.deleteByUsuario(usuario);

        // Generar PIN numérico de 6 dígitos
        SecureRandom random = new SecureRandom();
        int numero = 100000 + random.nextInt(900000);
        String pin = String.valueOf(numero);

        // Válido por 10 minutos
        LocalDateTime expiracion = LocalDateTime.now().plusMinutes(10);

        // Instanciar y asignar TODOS los valores antes de guardar
        TokenRecuperacion token = new TokenRecuperacion();
        token.setCodigo(pin);
        token.setUsuario(usuario);
        token.setFechaExpiracion(expiracion);
        token.setUtilizado(false);

        tokenRepository.save(token);

        try {
             emailService.enviarCodigoRecuperacion(usuario.getCorreo(), pin);
            } catch (Exception e) {
                    System.err.println("Error al enviar el correo vía SMTP: " + e.getMessage());
                    throw new RuntimeException("No fue posible enviar el correo de recuperación. Verifique la conexión.");
            }

  
    System.out.println(">>> CÓDIGO GENERADO Y ENVIADO A: " + usuario.getCorreo());
    

        return pin;
    }

    @Transactional
    public void restablecerPassword(RestablecerPasswordDto dto) {
        if (dto.getCodigo() == null || dto.getCodigo().trim().isEmpty()) {
            throw new RuntimeException("El código de recuperación es obligatorio.");
        }

        TokenRecuperacion token = tokenRepository.findByCodigo(dto.getCodigo().trim())
                .orElseThrow(() -> new RuntimeException("El código de recuperación es inválido o no existe."));

        if (Boolean.TRUE.equals(token.getUtilizado())) {
            throw new RuntimeException("El código de recuperación ya ha sido utilizado.");
        }

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

        // Eliminar el token usado para asegurar un solo uso
        tokenRepository.delete(token);
    }
}