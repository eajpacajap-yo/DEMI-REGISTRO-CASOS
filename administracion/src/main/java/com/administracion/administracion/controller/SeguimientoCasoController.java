package com.administracion.administracion.controller;

import com.administracion.administracion.dto.CrearSeguimientoDto;
import com.administracion.administracion.model.SeguimientoCaso;
import com.administracion.administracion.service.SeguimientoCasoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/seguimientos")
public class SeguimientoCasoController {

    @Autowired
    private SeguimientoCasoService seguimientoService;

    // GET: Listar todo el historial de un caso específico
    @GetMapping("/caso/{casoId}")
    public ResponseEntity<List<SeguimientoCaso>> listarPorCaso(@PathVariable Long casoId) {
        return ResponseEntity.ok(seguimientoService.listarPorCaso(casoId));
    }

    // POST: Registrar nueva actuación procesal
    @PostMapping
    public ResponseEntity<?> registrarSeguimiento(@RequestBody CrearSeguimientoDto dto) {
        try {
            SeguimientoCaso nuevo = seguimientoService.registrarSeguimiento(dto);
            return ResponseEntity.ok(nuevo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT: Editar/Corregir una actuación
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarSeguimiento(@PathVariable Long id, @RequestBody CrearSeguimientoDto dto) {
        try {
            SeguimientoCaso actualizado = seguimientoService.actualizarSeguimiento(id, dto);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE: Eliminar un registro de bitácora
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarSeguimiento(@PathVariable Long id) {
        try {
            seguimientoService.eliminarSeguimiento(id);
            return ResponseEntity.ok("Seguimiento eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}