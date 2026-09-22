import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReporteService, ResumenReporte } from '../../services/reporte.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class ReportesComponent implements OnInit {
  private reporteService = inject(ReporteService);
  private cdr = inject(ChangeDetectorRef);

  resumen?: ResumenReporte;
  cargando = true;
  error = false;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.error = false;
    this.reporteService.obtenerResumen().subscribe({
      next: (data) => {
        this.resumen = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar reporte:', err);
        this.error = true;
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  obtenerEntradas(obj?: { [key: string]: number }): { clave: string; valor: number }[] {
    if (!obj) return [];
    return Object.entries(obj).map(([clave, valor]) => ({ clave, valor }));
  }

  exportarPDF(): void {
    if (!this.resumen) return;

    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString('es-GT');

    // Encabezado institucional
    doc.setFillColor(92, 29, 104);
    doc.rect(0, 0, 210, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('DEMI - Defensoría de la Mujer Indígena', 14, 12);
    doc.setFontSize(10);
    doc.text('Informe Resumen Estadístico de Expedientes de Atención - Totonicapán', 14, 18);

    doc.setTextColor(40, 40, 40);
    doc.setFontSize(10);
    doc.text(`Fecha de emisión: ${fecha}`, 14, 32);
    doc.text(`Total general de casos registrados: ${this.resumen.totalCasos}`, 14, 38);

    let posFin = 42;

    // 1. Tabla por Municipio
    const tablaMunicipios = this.obtenerEntradas(this.resumen.casosPorMunicipio).map(i => [i.clave, i.valor]);
    autoTable(doc, {
      startY: posFin,
      head: [['Municipio', 'Casos Atendidos']],
      body: tablaMunicipios,
      headStyles: { fillColor: [92, 29, 104] },
      theme: 'grid'
    });
    posFin = (doc as any).lastAutoTable.finalY + 10;

    // 2. Tabla por Tipo de Violencia
    const tablaTipos = this.obtenerEntradas(this.resumen.casosPorTipoViolencia).map(i => [i.clave, i.valor]);
    autoTable(doc, {
      startY: posFin,
      head: [['Tipo de Violencia', 'Total']],
      body: tablaTipos,
      headStyles: { fillColor: [46, 125, 50] },
      theme: 'grid'
    });
    posFin = (doc as any).lastAutoTable.finalY + 10;

    // 3. Tabla por Estado Procesal
    const tablaEstados = this.obtenerEntradas(this.resumen.casosPorEstado).map(i => [i.clave, i.valor]);
    autoTable(doc, {
      startY: posFin,
      head: [['Estado Procesal', 'Expedientes']],
      body: tablaEstados,
      headStyles: { fillColor: [69, 90, 100] },
      theme: 'grid'
    });

    doc.save(`Resumen_Casos_DEMI_${fecha.replace(/\//g, '-')}.pdf`);
  }

  exportarExcel(): void {
    if (!this.resumen) return;

    const fecha = new Date().toLocaleDateString('es-GT');
    const libro = XLSX.utils.book_new();

    // Hoja 1: Resumen General y Totales
    const datosGeneral = [
      ['REPORTE ESTADÍSTICO DE CASOS - DEMI TOTONICAPÁN'],
      ['Fecha de generación:', fecha],
      ['Total general de casos:', this.resumen.totalCasos],
      [],
      ['--- CASOS POR MUNICIPIO ---'],
      ['Municipio', 'Cantidad'],
      ...this.obtenerEntradas(this.resumen.casosPorMunicipio).map(i => [i.clave, i.valor]),
      [],
      ['--- CASOS POR TIPO DE VIOLENCIA ---'],
      ['Tipo de Violencia', 'Cantidad'],
      ...this.obtenerEntradas(this.resumen.casosPorTipoViolencia).map(i => [i.clave, i.valor]),
      [],
      ['--- CASOS POR ESTADO PROCESAL ---'],
      ['Estado Procesal', 'Cantidad'],
      ...this.obtenerEntradas(this.resumen.casosPorEstado).map(i => [i.clave, i.valor])
    ];

    const hoja = XLSX.utils.aoa_to_sheet(datosGeneral);
    XLSX.utils.book_append_sheet(libro, hoja, 'Resumen Estadístico');

    XLSX.writeFile(libro, `Resumen_Casos_DEMI_${fecha.replace(/\//g, '-')}.xlsx`);
  }
}