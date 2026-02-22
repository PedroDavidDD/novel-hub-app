import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { PermissionService } from '../../core/services/permission.service';

/**
 * Directiva estructural para mostrar/ocultar elementos basado en permisos
 * 
 * Uso:
 * <button *hasPermission="'novels.delete'">Eliminar</button>
 * <div *hasPermission="'novels.edit'">Editar Novela</div>
 */
@Directive({
  selector: '[hasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  private permissionService = inject(PermissionService);
  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);

  private hasView = false;

  @Input({ required: true }) set hasPermission(permission: string) {
    this.updateView(permission);
  }

  private updateView(permission: string): void {
    const hasPermission = this.permissionService.hasPermission(permission);

    if (hasPermission && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
