package com.administracion.administracion.controller;

import com.administracion.administracion.dto.JwtResponseDto;
import com.administracion.administracion.dto.LoginRequestDto;
import com.administracion.administracion.model.Usuario;
import com.administracion.administracion.repository.UsuarioRepository;
import com.administracion.administracion.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private com.administracion.administracion.service.RecuperacionService recuperacionService;

   @PostMapping("/login")
    public ResponseEntity<?> autenticarUsuario(@RequestBody LoginRequestDto loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getCorreo(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            Usuario usuario = usuarioRepository.findByCorreo(loginRequest.getCorreo())
                    .orElseThrow(() -> new RuntimeException("Error: Usuario no encontrado"));

            String jwt = jwtUtils.generarToken(usuario.getCorreo(), usuario.getRol().getNombre());

            String nombreCompleto = usuario.getPrimerNombre() + " " + usuario.getPrimerApellido();

            return ResponseEntity.ok(new JwtResponseDto(
                    jwt,
                    usuario.getId(),
                    usuario.getCorreo(),
                    nombreCompleto,
                    usuario.getRol().getNombre()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/solicitar-recuperacion")
    public ResponseEntity<?> solicitarRecuperacion(@RequestBody com.administracion.administracion.dto.SolicitarRecuperacionDto dto) {
        try {
            // Se mantiene la lógica del servicio para generar y almacenar el PIN temporal
            String pin = recuperacionService.generarCodigoRecuperacion(dto);
            
            // Log en consola para conocer el PIN durante las pruebas de la presentación
            System.out.println(">>> [DEMO] CÓDIGO GENERADO PARA " + dto.getCorreo() + ": " + pin);

            // Se envía únicamente el mensaje informativo al frontend
            return ResponseEntity.ok(java.util.Map.of(
                "mensaje", "Se ha enviado un código de seguridad a su correo. Revise su bandeja de entrada."
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/restablecer-password")
    public ResponseEntity<?> restablecerPassword(@RequestBody com.administracion.administracion.dto.RestablecerPasswordDto dto) {
        try {
            recuperacionService.restablecerPassword(dto);
            return ResponseEntity.ok("Contraseña restablecida exitosamente. Ya puede iniciar sesión.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}