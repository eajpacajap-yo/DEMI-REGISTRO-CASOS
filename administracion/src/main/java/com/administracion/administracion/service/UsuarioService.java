package com.administracion.administracion.service;

import com.administracion.administracion.dto.ActualizarUsuarioDto;
import com.administracion.administracion.dto.CambiarPasswordDto;
import com.administracion.administracion.dto.CrearUsuarioDto;
import com.administracion.administracion.model.Rol;
import com.administracion.administracion.model.Usuario;
import com.administracion.administracion.repository.RolRepository;
import com.administracion.administracion.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario obtenerPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuaria no encontrada con ID: " + id));
    }

    public Usuario registrarUsuario(CrearUsuarioDto dto) {
        if (usuarioRepository.findByCorreo(dto.getCorreo()).isPresent()) {
            throw new RuntimeException("El correo ya se encuentra registrado en el sistema");
        }

        Rol rol = rolRepository.findById(dto.getRolId())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + dto.getRolId()));

        Usuario usuario = new Usuario();
        usuario.setPrimerNombre(dto.getPrimerNombre());
        usuario.setSegundoNombre(dto.getSegundoNombre());
        usuario.setTercerNombre(dto.getTercerNombre());
        usuario.setPrimerApellido(dto.getPrimerApellido());
        usuario.setSegundoApellido(dto.getSegundoApellido());
        usuario.setCorreo(dto.getCorreo());
        usuario.setPasswordHash(passwordEncoder.encode(dto.getPassword())); // Encriptación BCrypt
        usuario.setRol(rol);
        usuario.setActivo(true);

        return usuarioRepository.save(usuario);
    }

    public Usuario actualizarUsuario(Long id, ActualizarUsuarioDto dto) {
        Usuario usuario = obtenerPorId(id);

        // Si cambió de correo, validar que no esté en uso por otra persona
        if (!usuario.getCorreo().equalsIgnoreCase(dto.getCorreo())) {
            if (usuarioRepository.findByCorreo(dto.getCorreo()).isPresent()) {
                throw new RuntimeException("El correo ya pertenece a otra usuaria.");
            }
            usuario.setCorreo(dto.getCorreo());
        }

        Rol rol = rolRepository.findById(dto.getRolId())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        usuario.setPrimerNombre(dto.getPrimerNombre());
        usuario.setSegundoNombre(dto.getSegundoNombre());
        usuario.setTercerNombre(dto.getTercerNombre());
        usuario.setPrimerApellido(dto.getPrimerApellido());
        usuario.setSegundoApellido(dto.getSegundoApellido());
        usuario.setRol(rol);

        if (dto.getActivo() != null) {
            usuario.setActivo(dto.getActivo());
        }

        // Si se envió una nueva contraseña, se vuelve a encriptar
        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            usuario.setPasswordHash(passwordEncoder.encode(dto.getPassword().trim()));
        }

        return usuarioRepository.save(usuario);
    }

    public void eliminarUsuario(Long id) {
        Usuario usuario = obtenerPorId(id);
        // Desactivación lógica (recomendada para no romper la integridad de casos asignados)
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }

    public void cambiarPasswordPropia(Long id, CambiarPasswordDto dto) {
        Usuario usuario = obtenerPorId(id);

        // Validar que la contraseña actual ingresada coincida con la encriptada en la BD
        if (!passwordEncoder.matches(dto.getPasswordActual(), usuario.getPasswordHash())) {
            throw new RuntimeException("La contraseña actual no es correcta.");
        }

        if (dto.getNuevoPassword() == null || dto.getNuevoPassword().trim().length() < 12) {
            throw new RuntimeException("La nueva contraseña debe tener al menos 12 caracteres.");
        }

        // Encriptar y guardar la nueva contraseña
        usuario.setPasswordHash(passwordEncoder.encode(dto.getNuevoPassword().trim()));
        usuarioRepository.save(usuario);
    }
}

