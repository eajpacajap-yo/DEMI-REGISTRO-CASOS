package com.administracion.administracion.controller;

import com.administracion.administracion.dto.CrearCasoDto;
import com.administracion.administracion.model.Caso;
import com.administracion.administracion.service.CasoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/casos")
public class CasoController {

    @Autowired
    private CasoService casoService;

    @GetMapping
    public ResponseEntity<List<Caso>> listarCasos() {
        return ResponseEntity.ok(casoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerCaso(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(casoService.obtenerPorId(id));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> crearCaso(@RequestBody CrearCasoDto dto) {
        try {
            Caso nuevoCaso = casoService.crearCaso(dto);
            return ResponseEntity.ok(nuevoCaso);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarCaso(@PathVariable Long id, @RequestBody CrearCasoDto dto) {
        try {
            Caso actualizado = casoService.actualizarCaso(id, dto);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCaso(@PathVariable Long id) {
        try {
            casoService.eliminarCaso(id);
            return ResponseEntity.ok("Expediente eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}