import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MultimediaStorageService {
  private readonly dbName = 'DemiMultimediaDB';
  private readonly dbVersion = 1;
  private db!: IDBDatabase;

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event: any) => {
        const db: IDBDatabase = event.target.result;
        if (!db.objectStoreNames.contains('recursos_multimedia')) {
          const store = db.createObjectStore('recursos_multimedia', { keyPath: 'id' });
          store.createIndex('modulo_pwa', 'modulo_pwa', { unique: false });
          store.createIndex('tipo_recurso', 'tipo_recurso', { unique: false });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onerror = () => reject('Error al inicializar IndexedDB');
    });
  }

  async guardarRecurso(recurso: any): Promise<void> {
    await this.asegurarDB();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('recursos_multimedia', 'readwrite');
      const store = tx.objectStore('recursos_multimedia');
      store.put(recurso);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async obtenerRecursoPorModuloYTipo(modulo: string, tipo: 'AUDIO' | 'IMAGEN'): Promise<any | null> {
    await this.asegurarDB();
    return new Promise((resolve) => {
      const tx = this.db.transaction('recursos_multimedia', 'readonly');
      const store = tx.objectStore('recursos_multimedia');
      const request = store.getAll();

      request.onsuccess = () => {
        const lista = request.result || [];
        const encontrado = lista.find((r: any) => r.modulo_pwa === modulo && r.tipo_recurso === tipo && r.activo);
        resolve(encontrado || null);
      };
      request.onerror = () => resolve(null);
    });
  }

  private async asegurarDB(): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
  }
}