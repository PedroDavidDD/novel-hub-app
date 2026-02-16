import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { UserRole } from '../models/user.model';

const MOCK_USERS = [
  { 
    email: 'home@test.com', 
    pass: '123', 
    role: UserRole.USER_HOME, 
    name: 'Home User',
    token: 'mock-token-home' 
  },
  { 
    email: 'novels@test.com', 
    pass: '123', 
    role: UserRole.USER_NOVELS, 
    name: 'Novels User',
    token: 'mock-token-novels' 
  },
  { 
    email: 'admin@test.com', 
    pass: '123', 
    role: UserRole.ADMIN, 
    name: 'Admin User',
    token: 'mock-token-admin' 
  },
];

export const mockAuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  if (req.url.endsWith('/auth/login') && req.method === 'POST') {
    const { username, password } = req.body as any;
    const user = MOCK_USERS.find(u => u.email === username && u.pass === password);

    if (user) {
      return of(new HttpResponse({
        status: 200,
        body: {
          access_token: user.token,
          refresh_token: 'mock-refresh-' + user.token,
          user_info: {
            uid: user.token,
            mail: user.email,
            display_name: user.name,
            user_roles: [user.role]
          }
        }
      })).pipe(delay(800)); // Simulamos latencia de red
    }
  }
  return next(req);
};
