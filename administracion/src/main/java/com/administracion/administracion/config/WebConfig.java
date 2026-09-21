package com.administracion.administracion.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Obtiene la ruta absoluta de la carpeta uploads en el disco
        String rutaSubidas = Paths.get("uploads").toAbsolutePath().toUri().toString();

        // Expone los archivos físicos bajo el prefijo URL /uploads/
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(rutaSubidas);
    }
}
