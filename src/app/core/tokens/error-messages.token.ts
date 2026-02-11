import { InjectionToken } from '@angular/core';

export const FORM_ERRORS = new InjectionToken<Record<string, string>>('FORM_ERRORS', {
  factory: () => ({
    required: 'Este campo es obligatorio',
    email: 'Formato de email inválido',
    minlength: 'Mínimo de caracteres no alcanzado',
    maxlength: 'Máximo de caracteres alcanzado',
    pattern: 'El formato no es válido',
    min: 'El valor mínimo es',
    max: 'El valor máximo es',
    confirmPassword: 'Las contraseñas no coinciden',
    usernameTaken: 'El nombre de usuario ya está en uso',
    emailTaken: 'El correo electrónico ya está registrado',
    invalidCredentials: 'Usuario o contraseña incorrectos',    
  })
});