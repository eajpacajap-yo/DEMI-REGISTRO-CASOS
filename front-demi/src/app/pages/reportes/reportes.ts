import { Component, OnInit, inject, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CasoService } from '../../services/caso.service';
import { Caso } from '../../models/caso';
import { ResumenReporte } from '../../services/reporte.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Chart from 'chart.js/auto';

export type PeriodoFiltro = 'todos' | 'semana' | 'mes' | 'anio';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class ReportesComponent implements OnInit {
  private casoService = inject(CasoService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('graficaMunicipios') graficaMunicipiosRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficaViolencia') graficaViolenciaRef!: ElementRef<HTMLCanvasElement>;

  chartMunicipios?: Chart;
  chartViolencia?: Chart;

  todosLosCasos: Caso[] = [];
  resumen?: ResumenReporte;
  cargando = true;
  error = false;

  filtroPeriodo: PeriodoFiltro = 'todos';
  etiquetaPeriodo: string = 'Histórico Completo';

  ngOnInit(): void {
    this.cargarCasosBase();
  }

  cargarCasosBase(): void {
    this.cargando = true;
    this.error = false;
    this.casoService.listarCasos().subscribe({
      next: (casos) => {
        this.todosLosCasos = casos;
        this.procesarMetricas();
        this.cargando = false;
        this.cdr.detectChanges();
        setTimeout(() => this.construirGraficas(), 80);
      },
      error: (err) => {
        console.error('Error al cargar expedientes para reportes:', err);
        this.error = true;
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cambiarFiltroPeriodo(periodo: PeriodoFiltro): void {
    this.filtroPeriodo = periodo;
    switch (periodo) {
      case 'semana':
        this.etiquetaPeriodo = 'Última Semana (Últimos 7 días)';
        break;
      case 'mes':
        this.etiquetaPeriodo = 'Último Mes (Últimos 30 días)';
        break;
      case 'anio':
        this.etiquetaPeriodo = 'Último Año (Últimos 365 días)';
        break;
      default:
        this.etiquetaPeriodo = 'Histórico Completo';
        break;
    }

    this.procesarMetricas();
    this.cdr.detectChanges();
    setTimeout(() => this.construirGraficas(), 80);
  }

   private procesarMetricas(): void {
    const hoy = new Date();
    // Normalizar 'hoy' a inicio del día para comparaciones precisas de fechas
    const hoyMs = hoy.getTime();

    const casosFiltrados = this.todosLosCasos.filter((caso: any) => {
      if (this.filtroPeriodo === 'todos') return true;

      // Leer directamente los nombres reales según la tabla de PostgreSQL
      const valorFecha = caso.fechaRegistro || caso.fecha_registro || caso.creadoEn || caso.creado_en;

      if (!valorFecha) {
        return false;
      }

      // Convertir fecha (soporta formato 'YYYY-MM-DD' de tipo date y ISO de timestamp)
      const fechaObjeto = new Date(valorFecha);
      const fechaMs = fechaObjeto.getTime();

      if (isNaN(fechaMs)) {
        return false;
      }

      // Diferencia en días enteros
      const diferenciaDias = (hoyMs - fechaMs) / (1000 * 60 * 60 * 24);

      if (this.filtroPeriodo === 'semana') {
        return diferenciaDias >= 0 && diferenciaDias <= 7;
      }
      if (this.filtroPeriodo === 'mes') {
        return diferenciaDias >= 0 && diferenciaDias <= 30;
      }
      if (this.filtroPeriodo === 'anio') {
        return diferenciaDias >= 0 && diferenciaDias <= 365;
      }

      return true;
    });

    const municipiosMap: { [key: string]: number } = {};
    const violenciaMap: { [key: string]: number } = {};
    const estadoMap: { [key: string]: number } = {};

    casosFiltrados.forEach((c: any) => {
      // Municipio
      const mun = c.municipio?.nombre || c.municipio || 'No Definido';
      municipiosMap[mun] = (municipiosMap[mun] || 0) + 1;

      // Tipo de Violencia
      const viol = c.tipoViolencia?.nombre || c.tipoViolencia || 'No Definido';
      violenciaMap[viol] = (violenciaMap[viol] || 0) + 1;

      // Estado procesal
      const est = c.estado?.nombre || c.estado || 'Registrado';
      estadoMap[est] = (estadoMap[est] || 0) + 1;
    });

    this.resumen = {
      totalCasos: casosFiltrados.length,
      casosPorMunicipio: municipiosMap,
      casosPorTipoViolencia: violenciaMap,
      casosPorEstado: estadoMap
    };
  }

  obtenerEntradas(obj?: { [key: string]: number }): { clave: string; valor: number }[] {
    if (!obj) return [];
    return Object.entries(obj).map(([clave, valor]) => ({ clave, valor }));
  }

  construirGraficas(): void {
    if (!this.resumen || !this.graficaMunicipiosRef || !this.graficaViolenciaRef) return;

    if (this.chartMunicipios) this.chartMunicipios.destroy();
    if (this.chartViolencia) this.chartViolencia.destroy();

    const munData = this.obtenerEntradas(this.resumen.casosPorMunicipio);
    const ctxMun = this.graficaMunicipiosRef.nativeElement.getContext('2d');
    if (ctxMun) {
      this.chartMunicipios = new Chart(ctxMun, {
        type: 'bar',
        data: {
          labels: munData.map((d) => d.clave),
          datasets: [{
            label: 'Expedientes',
            data: munData.map((d) => d.valor),
            backgroundColor: '#0097d8'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    }

    const violData = this.obtenerEntradas(this.resumen.casosPorTipoViolencia);
    const ctxViol = this.graficaViolenciaRef.nativeElement.getContext('2d');
    if (ctxViol) {
      this.chartViolencia = new Chart(ctxViol, {
        type: 'doughnut',
        data: {
          labels: violData.map((d) => d.clave),
          datasets: [{
            data: violData.map((d) => d.valor),
            backgroundColor: ['#5c1d68', '#1b365d', '#0097d8', '#f59e0b', '#10b981']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }

  exportarPDF(): void {
    if (!this.resumen) return;

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const fecha = new Date().toLocaleDateString('es-GT', { year: 'numeric', month: 'long', day: 'numeric' });
    const hora = new Date().toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });

    // Banner Superior
    doc.setFillColor(27, 54, 93);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setFillColor(0, 151, 216);
    doc.rect(0, 28, 210, 2.5, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('DEFENSORÍA DE LA MUJER INDÍGENA — DEMI', 14, 11);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Oficina Regional de Totonicapán | Sistema de Registro y Control de Casos', 14, 17);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORME ESTADÍSTICO ', 14, 23);

    // Metadatos
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`Fecha de emisión: ${fecha} (${hora})`, 14, 37);
    doc.text(`Periodo analizado: ${this.etiquetaPeriodo}`, 14, 42);

    // KPI Total
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, 48, 182, 17, 2, 2, 'FD');
    doc.setFillColor(92, 29, 104);
    doc.rect(14, 48, 3.5, 17, 'F');

    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('TOTAL DE EXPEDIENTES EN EL PERIODO:', 22, 59);
    doc.setFontSize(14);
    doc.setTextColor(92, 29, 104);
    doc.text(`${this.resumen.totalCasos} casos`, 190, 59, { align: 'right' });

    let posFin = 72;

    // Tabla Municipios
    const tablaMunicipios = this.obtenerEntradas(this.resumen.casosPorMunicipio).map((i) => [
      i.clave,
      i.valor,
      `${((i.valor / (this.resumen?.totalCasos || 1)) * 100).toFixed(1)}%`
    ]);

    autoTable(doc, {
      startY: posFin,
      head: [['Municipio', 'Casos Atendidos', 'Porcentaje']],
      body: tablaMunicipios,
      theme: 'plain',
      headStyles: { fillColor: [27, 54, 93], textColor: [255, 255, 255], fontStyle: 'bold' }
    });

    posFin = (doc as any).lastAutoTable.finalY + 10;

    // Tabla Tipología
    const tablaTipos = this.obtenerEntradas(this.resumen.casosPorTipoViolencia).map((i) => [
      i.clave,
      i.valor,
      `${((i.valor / (this.resumen?.totalCasos || 1)) * 100).toFixed(1)}%`
    ]);

    autoTable(doc, {
      startY: posFin,
      head: [['Tipo de Violencia', 'Total de Casos', 'Proporción']],
      body: tablaTipos,
      theme: 'plain',
      headStyles: { fillColor: [92, 29, 104], textColor: [255, 255, 255], fontStyle: 'bold' }
    });

    doc.save(`Reporte_DEMI_${this.filtroPeriodo}_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  exportarExcel(): void {
    if (!this.resumen) return;

    const fecha = new Date().toLocaleDateString('es-GT');
    const libro = XLSX.utils.book_new();

    const filas = [
      ['REPORTE ESTADÍSTICO DE CASOS - DEMI TOTONICAPÁN'],
      ['Periodo:', this.etiquetaPeriodo],
      ['Fecha de generación:', fecha],
      ['Total de casos:', this.resumen.totalCasos],
      [],
      ['--- CASOS POR MUNICIPIO ---'],
      ['Municipio', 'Cantidad'],
      ...this.obtenerEntradas(this.resumen.casosPorMunicipio).map((i) => [i.clave, i.valor]),
      [],
      ['--- CASOS POR TIPO DE VIOLENCIA ---'],
      ['Tipo de Violencia', 'Cantidad'],
      ...this.obtenerEntradas(this.resumen.casosPorTipoViolencia).map((i) => [i.clave, i.valor]),
      [],
      ['--- CASOS POR ESTADO PROCESAL ---'],
      ['Estado Procesal', 'Cantidad'],
      ...this.obtenerEntradas(this.resumen.casosPorEstado).map((i) => [i.clave, i.valor])
    ];

    const hoja = XLSX.utils.aoa_to_sheet(filas);
    XLSX.utils.book_append_sheet(libro, hoja, 'Resumen');
    XLSX.writeFile(libro, `Resumen_DEMI_${this.filtroPeriodo}_${fecha.replace(/\//g, '-')}.xlsx`);
  }
}