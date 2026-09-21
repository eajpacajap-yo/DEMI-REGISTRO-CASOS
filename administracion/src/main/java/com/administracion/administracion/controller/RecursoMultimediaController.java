package com.administracion.administracion.controller;


import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.administracion.administracion.model.RecursoMultimedia;              
import com.administracion.administracion.repository.RecursoMultimediaRepository;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/api/recursos")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class RecursoMultimediaController {

    private final String DIRECTORIO_SUBIDAS = "uploads/multimedia/";
    private final RecursoMultimediaRepository recursoRepo;

    public RecursoMultimediaController(RecursoMultimediaRepository recursoRepo) {
        this.recursoRepo = recursoRepo;
    }

    // 1. Endpoint institucional exclusivo para administradoras (JWT requerido)
    @PostMapping(value = "/admin/subir", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> subirImagen(
            @RequestParam("archivo") MultipartFile archivo,
            @RequestParam("titulo") String titulo,
            @RequestParam("modulo") String modulo,
            @RequestParam("idiomaId") Integer idiomaId,
            @RequestParam(value = "descripcionEs", required = false) String descripcionEs,
            @RequestParam(value = "descripcionQuc", required = false) String descripcionQuc
    ) {
        if (archivo.isEmpty()) {
            return ResponseEntity.badRequest().body("El archivo es obligatorio");
        }

        try {
            // Crear carpeta si no existe
            Path rutaDirectorio = Paths.get(DIRECTORIO_SUBIDAS);
            if (!Files.exists(rutaDirectorio)) {
                Files.createDirectories(rutaDirectorio);
            }

            // Generar nombre seguro único
            String extension = archivo.getOriginalFilename().substring(archivo.getOriginalFilename().lastIndexOf("."));
            String nombreArchivo = UUID.randomUUID() + extension;
            Path destino = rutaDirectorio.resolve(nombreArchivo);

            // Guardar archivo en disco
            Files.copy(archivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

            // Registrar en base de datos PostgreSQL
            RecursoMultimedia recurso = new RecursoMultimedia();
            recurso.setTitulo(titulo);
            recurso.setTipoRecurso("IMAGEN");
            recurso.setModuloPwa(modulo);
            recurso.setIdiomaId(idiomaId);
            recurso.setRutaAlmacenamiento("/uploads/multimedia/" + nombreArchivo);
            recurso.setDescripcionEs(descripcionEs);
            recurso.setDescripcionQuc(descripcionQuc);
            recurso.setVersion(1);
            recurso.setActivo(true);

            recursoRepo.save(recurso);

            return ResponseEntity.ok(recurso);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error al almacenar el archivo: " + e.getMessage());
        }
    }

    // 2. Endpoint público para la PWA (No requiere token)
    @GetMapping("/publicos/{modulo}")
    public ResponseEntity<List<RecursoMultimedia>> obtenerRecursosPorModulo(@PathVariable String modulo) {
        return ResponseEntity.ok(recursoRepo.findByModuloPwaAndActivoTrue(modulo));
    }
}