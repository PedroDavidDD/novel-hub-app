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
