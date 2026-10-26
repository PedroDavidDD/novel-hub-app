# Catálogo de Formularios y Validaciones — Frontend Angular 19

Este catálogo documenta las convenciones para la construcción de formularios en la aplicación.

---

## 1. Stack de Formularios

- **Librería**: Angular Reactive Forms (`FormBuilder`, `FormGroup`, `FormControl`, `Validators`).
- **Inputs Reutilizables**: `CustomInputComponent` (`app-input`) implementa `ControlValueAccessor`.
- **Manejo de Respuestas / Feedback**: `ActionHandler` (`src/app/shared/utils/action-handler.ts`).

---

## 2. Patrón de Implementación Canónico (`LoginPageComponent`)

- **Ruta de referencia**: `src/app/features/auth/pages/login-page/login-page.component.ts`

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFacade } from '../../../../core/services/auth.facade';
import { ToastService } from '../../../../shared/services/toast.service';
import { ActionHandler } from '../../../../shared/utils/action-handler';

@Component({
  selector: 'auth-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, ...],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private authFacade = inject(AuthFacade);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private actionHandler = new ActionHandler(this.toastService);

  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  public isLoading = false;

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.actionHandler.execute({
      action: this.authFacade.login(this.loginForm.value),
      successMessage: 'Bienvenido a NovelHub',
      onSuccess: () => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      onError: (err) => {
        this.isLoading = false;
      },
    });
  }
}
```

---

## 3. Helpers de Validación de Campos

Para formularios que no usan directamente `app-input`:
```typescript
isValidField(field: string): boolean | null {
  return this.form.controls[field].errors && this.form.controls[field].touched;
}

getFieldError(field: string): string | null {
  if (!this.form.controls[field]) return null;
  const errors = this.form.controls[field].errors || {};
  for (const key of Object.keys(errors)) {
    switch (key) {
      case 'required': return 'Este campo es requerido';
      case 'email': return 'Formato de correo inválido';
      case 'minlength': return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    }
  }
  return null;
}
```

---

## 4. Reglas Inmutables

1. **Siempre marcar campos antes de abortar**: Si el formulario es inválido al presionar Submit, ejecutar `this.form.markAllAsTouched()`.
2. **Siempre usar `ActionHandler` para la ejecución**: Automatiza los toasts de éxito/error y desacopla la vista del resultado RxJS.
3. **Regla de Oro N° 11 — Contador de Caracteres y Límites Estándar**: Todo input y textarea reutilizable (`app-input`) renderiza su contador `actual / maximo` (ej: `0 / 250`) con badge color primary translúcido (`bg-[var(--color-primary)]/20` con `backdrop-blur-[2px]`), centrado a la derecha en inputs y al pie derecho en textareas, asegurando que el contenido nunca se solape. Los límites se consultan obligatoriamente en [`INPUT_LIMITS`](file:///E:/Cursos%20Por%20Aprender%20Udemy/Angular/novel-hub/novel-hub-app/src/app/core/constants/input-limits.constant.ts).
