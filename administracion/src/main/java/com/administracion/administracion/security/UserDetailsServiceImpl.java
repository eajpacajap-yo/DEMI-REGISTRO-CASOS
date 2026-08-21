package com.administracion.administracion.security;

import com.administracion.administracion.model.Usuario;
import com.administracion.administracion.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con correo: " + correo));

        if (!usuario.getActivo()) {
            throw new UsernameNotFoundException("Usuario inactivo en el sistema");
        }

        SimpleGrantedAuthority autoridad = new SimpleGrantedAuthority(usuario.getRol().getNombre());

        return new User(
                usuario.getCorreo(),
                usuario.getPasswordHash(),
                Collections.singletonList(autoridad)
        );
    }
}