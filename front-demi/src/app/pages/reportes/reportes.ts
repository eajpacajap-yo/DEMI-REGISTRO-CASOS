import {
  Component,
  OnInit,
  AfterViewInit,
  inject,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReporteService, ResumenReporte } from '../../services/reporte.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class ReportesComponent implements OnInit, AfterViewInit {
  private reporteService = inject(ReporteService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('graficaMunicipios') graficaMunicipiosRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficaViolencia') graficaViolenciaRef!: ElementRef<HTMLCanvasElement>;

  chartMunicipios?: Chart;
  chartViolencia?: Chart;

  resumen?: ResumenReporte;
  cargando = true;
  error = false;

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngAfterViewInit(): void {
    if (this.resumen) {
      this.construirGraficas();
    }
  }

  cargarDatos(): void {
    this.cargando = true;
    this.error = false;
    this.reporteService.obtenerResumen().subscribe({
      next: (data) => {
        this.resumen = data;
        this.cargando = false;
        this.cdr.detectChanges();
        setTimeout(() => this.construirGraficas(), 100);
      },
      error: (err) => {
        console.error('Error al obtener reporte:', err);
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

  private cargarImagenBase64(url: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          resolve('');
        }
      };
      img.onerror = () => resolve('');
      img.src = url;
    });
  }

  private construirGraficas(): void {
    if (!this.resumen) return;

    if (this.chartMunicipios) {
      this.chartMunicipios.destroy();
    }
    if (this.chartViolencia) {
      this.chartViolencia.destroy();
    }

    if (this.graficaMunicipiosRef?.nativeElement) {
      const datosMun = this.obtenerEntradas(this.resumen.casosPorMunicipio);
      this.chartMunicipios = new Chart(this.graficaMunicipiosRef.nativeElement, {
        type: 'bar',
        data: {
          labels: datosMun.map((d) => d.clave),
          datasets: [
            {
              label: 'Casos Registrados',
              data: datosMun.map((d) => d.valor),
              backgroundColor: '#1b365d',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1 }
            }
          }
        }
      });
    }

    if (this.graficaViolenciaRef?.nativeElement) {
      const datosVio = this.obtenerEntradas(this.resumen.casosPorTipoViolencia);
      this.chartViolencia = new Chart(this.graficaViolenciaRef.nativeElement, {
        type: 'doughnut',
        data: {
          labels: datosVio.map((d) => d.clave),
          datasets: [
            {
              data: datosVio.map((d) => d.valor),
              backgroundColor: ['#5c1d68', '#0097d8', '#d32f2f', '#f59e0b', '#10b981']
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 12, padding: 10 }
            }
          }
        }
      });
    }
  }

  async exportarPDF(): Promise<void> {
    if (!this.resumen) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const fecha = new Date().toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const hora = new Date().toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });

    let logoBase64 = await this.cargarImagenBase64('/demiLOGO.png');
    if (!logoBase64) {
      logoBase64 = await this.cargarImagenBase64('/demiLOGO.PNG');
    }
    if (!logoBase64) {
      logoBase64 = await this.cargarImagenBase64('assets/img/demiLOGO.png');
    }

    doc.setFillColor(27, 54, 93);
    doc.rect(0, 0, 210, 28, 'F');

    doc.setFillColor(0, 151, 216);
    doc.rect(0, 28, 210, 2.5, 'F');

    let textoInicioX = 14;

    if (logoBase64) {
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(14, 4, 38, 20, 2, 2, 'F');
      doc.addImage(logoBase64, 'PNG', 15, 5, 36, 18);
      textoInicioX = 57;
    }

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('DEFENSORÍA DE LA MUJER INDÍGENA — DEMI', textoInicioX, 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Sede Regional de Totonicapán | Sistema de Registro y Control de Casos', textoInicioX, 17);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORME ESTADÍSTICO CONSOLIDADO', textoInicioX, 23);

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`Fecha de emisión: ${fecha} (${hora})`, 14, 37);
    doc.text('Carácter del informe: Oficial / Administrativo', 14, 42);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, 46, 182, 17, 2, 2, 'FD');

    doc.setFillColor(92, 29, 104);
    doc.rect(14, 46, 3.5, 17, 'F');

    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('TOTAL DE EXPEDIENTES Y CASOS REGISTRADOS:', 22, 57);

    doc.setFontSize(14);
    doc.setTextColor(92, 29, 104);
    doc.text(`${this.resumen.totalCasos} casos`, 190, 57, { align: 'right' });

    let posFin = 70;

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
      headStyles: {
        fillColor: [27, 54, 93],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8.5
      },
      styles: {
        fontSize: 8,
        cellPadding: 2.5,
        lineColor: [226, 232, 240],
        lineWidth: 0.2
      },
      columnStyles: {
        1: { halign: 'center', fontStyle: 'bold' },
        2: { halign: 'right' }
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      }
    });

    posFin = (doc as any).lastAutoTable.finalY + 10;

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
      headStyles: {
        fillColor: [92, 29, 104],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8.5
      },
      styles: {
        fontSize: 8,
        cellPadding: 2.5,
        lineColor: [226, 232, 240],
        lineWidth: 0.2
      },
      columnStyles: {
        1: { halign: 'center', fontStyle: 'bold' },
        2: { halign: 'right' }
      },
      alternateRowStyles: {
        fillColor: [253, 244, 255]
      }
    });

    posFin = (doc as any).lastAutoTable.finalY + 10;

    const tablaEstados = this.obtenerEntradas(this.resumen.casosPorEstado).map((i) => [
      i.clave,
      i.valor
    ]);

    autoTable(doc, {
      startY: posFin,
      head: [['Estado Procesal', 'Total de Expedientes']],
      body: tablaEstados,
      theme: 'plain',
      headStyles: {
        fillColor: [51, 65, 85],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8.5
      },
      styles: {
        fontSize: 8,
        cellPadding: 2.5,
        lineColor: [226, 232, 240],
        lineWidth: 0.2
      },
      columnStyles: {
        1: { halign: 'center', fontStyle: 'bold' }
      },
      alternateRowStyles: {
        fillColor: [241, 245, 249]
      }
    });

    const totalPaginas = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
      doc.setPage(i);
      doc.setDrawColor(203, 213, 225);
      doc.line(14, 283, 196, 283);

      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'Documento de uso confidencial e institucional — Defensoría de la Mujer Indígena (DEMI)',
        14,
        288
      );
      doc.text(`Página ${i} de ${totalPaginas}`, 196, 288, { align: 'right' });
    }

    doc.save(`Reporte_DEMI_Casos_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  exportarExcel(): void {
    if (!this.resumen) return;

    const fecha = new Date().toLocaleDateString('es-GT');
    const libro = XLSX.utils.book_new();

    const filas = [
      ['REPORTE ESTADÍSTICO DE CASOS - DEMI TOTONICAPÁN'],
      ['Fecha de generación:', fecha],
      ['Total general de casos:', this.resumen.totalCasos],
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
    XLSX.utils.book_append_sheet(libro, hoja, 'Resumen Estadístico');
    XLSX.writeFile(libro, `Resumen_DEMI_${fecha.replace(/\//g, '-')}.xlsx`);
  }
}