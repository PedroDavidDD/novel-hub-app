import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MessageMock {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  date: string;
  isUnread: boolean;
}

@Component({
  selector: 'app-inbox-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inbox-tab.component.html',
  styleUrls: ['./inbox-tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxTabComponent {
  readonly messages: MessageMock[] = [
    {
      id: 'm1',
      sender: 'Sistema NovelHub',
      subject: '¡Bienvenido a NovelHub!',
      preview: 'Gracias por unirte a nuestra plataforma. Explora nuestras novelas traducidas y participa en la comunidad.',
      date: 'Hoy, 10:30',
      isUnread: true,
    },
    {
      id: 'm2',
      sender: 'Actualizaciones de Novelas',
      subject: 'Nuevo capítulo publicado: Shadow Slave #121',
      preview: 'El autor ha liberado un nuevo capítulo de Shadow Slave. ¡Haz clic para leerlo ahora!',
      date: 'Ayer',
      isUnread: false,
    },
    {
      id: 'm3',
      sender: 'DukeTranslation',
      subject: 'Mantenimiento programado de servidores',
      preview: 'Estimado lector, realizaremos un breve mantenimiento este fin de semana a las 02:00 UTC.',
      date: 'Hace 3 días',
      isUnread: false,
    },
  ];
}
