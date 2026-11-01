export const NOVEL_PAGE_TEXTS = {
  loading: 'Cargando novela...',
  notFoundTitle: 'Novela no encontrada',
  notFoundMessage: 'La novela que buscas no existe o ha sido movida.',
  authorPrefix: 'by',
  authorUnknown: 'Autor Desconocido',
  stats: {
    chapters: 'Capítulos',
    views: 'Opiniones / Vistas',
    free: 'Gratis',
    premium: 'Premium',
  },
  releases: {
    title: 'Lanzamientos',
  },
  statuses: {
    ongoing: 'Vigente',
    completed: 'Completada',
    hiatus: 'En pausa',
    dropped: 'Dropeada',
    inactive: 'Inactiva',
  },
  actions: {
    firstChapter: 'Primer capítulo',
    lastRead: 'Último leído',
    readMore: 'Leer más',
    readLess: 'Leer menos',
    startReading: 'Primer capítulo',
    signInForPass: 'Último leído',
    epub: 'Sign in to buy EPUB',
    addToLibrary: 'Añadir a Biblioteca',
    chaptersBtn: 'Capítulos',
  },
  chaptersSection: {
    title: 'Capítulos',
    shownSuffix: 'mostrado',
    tabFree: 'Gratis',
    tabPremium: 'Premium',
    tabImages: 'Imágenes',
    noChapters: 'No hay capítulos disponibles en esta categoría.',
    noImages: 'No hay imágenes disponibles para esta novela.',
  },
} as const;

export interface NovelStatusUI {
  label: string;
  badgeClass: string;
  dotClass: string;
}

export function resolveNovelStatusUI(rawStatus: string | undefined): NovelStatusUI {
  const status = (rawStatus || 'Ongoing').trim().toLowerCase();

  if (status === 'ongoing' || status === 'activa' || status === 'vigente') {
    return {
      label: NOVEL_PAGE_TEXTS.statuses.ongoing,
      badgeClass: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
      dotClass: 'bg-emerald-500',
    };
  }
  if (status === 'completed' || status === 'completada') {
    return {
      label: NOVEL_PAGE_TEXTS.statuses.completed,
      badgeClass: 'bg-sky-500/15 text-sky-500 border-sky-500/30',
      dotClass: 'bg-sky-500',
    };
  }
  if (status === 'hiatus' || status === 'en pausa' || status === 'pausa') {
    return {
      label: NOVEL_PAGE_TEXTS.statuses.hiatus,
      badgeClass: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
      dotClass: 'bg-amber-500',
    };
  }
  if (status === 'dropped' || status === 'dropeada' || status === 'cancelada') {
    return {
      label: NOVEL_PAGE_TEXTS.statuses.dropped,
      badgeClass: 'bg-rose-500/15 text-rose-500 border-rose-500/30',
      dotClass: 'bg-rose-500',
    };
  }
  return {
    label: rawStatus || NOVEL_PAGE_TEXTS.statuses.ongoing,
    badgeClass: 'bg-[var(--color-primary)]/15 text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] border-[var(--color-primary)]/30',
    dotClass: 'bg-[var(--color-primary)]',
  };
}

export interface ScheduleDayItem {
  key: string;
  label: string;
  fullName: string;
  isActive: boolean;
}

export const DAYS_OF_WEEK_DEF = [
  { key: 'lun', label: 'Lun', fullName: 'Lunes', aliases: ['lun', 'lunes', 'mon', 'monday'] },
  { key: 'mar', label: 'Mar', fullName: 'Martes', aliases: ['mar', 'martes', 'tue', 'tuesday'] },
  { key: 'mie', label: 'Mié', fullName: 'Miércoles', aliases: ['mié', 'mie', 'miercoles', 'miércoles', 'wed', 'wednesday'] },
  { key: 'jue', label: 'Jue', fullName: 'Jueves', aliases: ['jue', 'jueves', 'thu', 'thursday'] },
  { key: 'vie', label: 'Vie', fullName: 'Viernes', aliases: ['vie', 'viernes', 'fri', 'friday'] },
  { key: 'sab', label: 'Sáb', fullName: 'Sábado', aliases: ['sáb', 'sab', 'sabado', 'sábado', 'sat', 'saturday'] },
  { key: 'dom', label: 'Dom', fullName: 'Domingo', aliases: ['dom', 'domingo', 'sun', 'sunday'] },
];

export function resolveWeeklySchedule(scheduledDays: string[] | undefined): ScheduleDayItem[] {
  const normalizedScheduled = (scheduledDays || []).map(d => d.trim().toLowerCase());

  return DAYS_OF_WEEK_DEF.map(dayDef => {
    const match = normalizedScheduled.find(sch =>
      dayDef.aliases.some(alias => sch.startsWith(alias) || sch === alias)
    );

    if (match) {
      const multiplierMatch = match.match(/x\s*\d+/i);
      const label = multiplierMatch ? `${dayDef.label} ${multiplierMatch[0]}` : dayDef.label;
      return {
        key: dayDef.key,
        label,
        fullName: dayDef.fullName,
        isActive: true,
      };
    }

    return {
      key: dayDef.key,
      label: dayDef.label,
      fullName: dayDef.fullName,
      isActive: false,
    };
  });
}
