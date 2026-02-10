export interface Game {
  id: string;
  title: string;
  iframeUrl: string;
  thumbnail: string;
  category: string;
  sourceUrl?: string;
}

export type ViewState = 'grid' | 'player';