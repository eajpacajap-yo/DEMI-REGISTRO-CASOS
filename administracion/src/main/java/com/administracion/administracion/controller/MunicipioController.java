package com.administracion.administracion.controller;

import com.administracion.administracion.model.Municipio;
import com.administracion.administracion.service.MunicipioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/municipios")
@CrossOrigin(origins = "*") // Permite peticiones desde cualquier origen (React Native/Web)
public class MunicipioController {

    @Autowired
    private MunicipioService municipioService;

    @GetMapping
    public ResponseEntity<List<Municipio>> listarMunicipios() {
        List<Municipio> municipios = municipioService.listarTodos();
        return ResponseEntity.ok(municipios);
    }
}