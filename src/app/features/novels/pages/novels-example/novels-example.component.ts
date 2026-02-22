import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionService } from '../../../../core/services/permission.service';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';

/**
 * Ejemplo de componente con autorización por página/action
 * Muestra cómo usar el sistema de permisos
 */
@Component({
  selector: 'app-novels-example',
  standalone: true,
  imports: [CommonModule, HasPermissionDirective],
  template: `
    <div class="container p-8">
      <h1 class="text-2xl font-bold mb-6">Gestión de Novelas</h1>

      <!-- Botón visible solo si tiene permiso de crear -->
      <button
        *hasPermission="'novels.create'"
        class="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        + Crear Nueva Novela
      </button>

      <!-- Lista de novelas (visible para todos) -->
      <div class="space-y-4">
        <div class="border p-4 rounded flex justify-between items-center">
          <div>
            <h3 class="font-bold">El Señor de los Anillos</h3>
            <p class="text-gray-600">J.R.R. Tolkien</p>
          </div>

          <div class="space-x-2">
            <!-- Botón Editar: solo con novels.edit -->
            <button
              *hasPermission="'novels.edit'"
              class="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Editar
            </button>

            <!-- Botón Eliminar: solo con novels.delete -->
            <button
              *hasPermission="'novels.delete'"
              class="bg-red-500 text-white px-3 py-1 rounded"
            >
              Eliminar
            </button>

            <!-- Botón Ver: visible para todos con novels.read -->
            <button
              *hasPermission="'novels.read'"
              class="bg-gray-500 text-white px-3 py-1 rounded"
            >
              Ver
            </button>
          </div>
        </div>
      </div>

      <!-- Mensaje para usuarios sin permisos -->
      <div *ngIf="!canCreateNovels()" class="mt-4 p-4 bg-yellow-100 rounded">
        <p class="text-yellow-800">
          No tienes permisos para crear novelas. Contacta al administrador.
        </p>
      </div>
    </div>
  `
})
export class NovelsExampleComponent {
  private permissionService = inject(PermissionService);

  // Método para verificar permiso en el componente
  canCreateNovels(): boolean {
    return this.permissionService.hasPermission('novels.create');
  }

  // Método para verificar múltiples permisos
  canManageNovels(): boolean {
    return this.permissionService.hasAnyPermission([
      'novels.create',
      'novels.edit',
      'novels.delete'
    ]);
  }
}
