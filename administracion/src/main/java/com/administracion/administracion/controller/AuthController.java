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
            String pin = recuperacionService.generarCodigoRecuperacion(dto);
            // Devolvemos confirmación (e incluimos el pin en la respuesta para facilitar la prueba directa)
            return ResponseEntity.ok(java.util.Map.of(
                "mensaje", "Código de recuperación generado exitosamente. Válido por 10 minutos.",
                "codigoDemostracion", pin
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