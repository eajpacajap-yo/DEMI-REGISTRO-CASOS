package com.administracion.administracion.service;

import com.administracion.administracion.model.Municipio;
import com.administracion.administracion.repository.MunicipioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MunicipioService {

    @Autowired
    private MunicipioRepository municipioRepository;

    public List<Municipio> listarTodos() {
        return municipioRepository.findAll();
    }
}