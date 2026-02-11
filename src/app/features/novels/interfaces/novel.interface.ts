export interface Novel {
  id: string;
  title: string;
  image: string;
  description: string;
  genres: string[];
  tags?: string[];
  associatedNames?: string[];
}

export type SortOption = 'Name' | 'Popular' | 'Chapters' | 'New' | 'Rating';