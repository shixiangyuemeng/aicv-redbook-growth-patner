export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  promptContext: string;
}

export interface GeneratedContent {
  title: string;
  body: string;
  hashtags: string[];
}

export enum ImageRatio {
  PORTRAIT = '3:4', // Best for RED
  LANDSCAPE = '4:3',
  SQUARE = '1:1'
}

export enum ImageStyle {
  MINIMALIST = 'Minimalist clean design, pastel colors, high quality, professional',
  ILLUSTRATION_FLAT = 'Flat vector illustration, corporate memphis style, colorful, trendy',
  PHOTOREALISTIC = 'Cinematic workspace photography, soft lighting, macbook, coffee, resume paper, cozy',
  POP_ART = 'Bold pop art, bright colors, comic style, energetic, high contrast',
  ACADEMIC = 'Academic aesthetic, library background, books, serious, muted tones'
}

export interface AppState {
  step: number;
  selectedTopic: Topic | null;
  generatedContent: GeneratedContent;
  isGeneratingText: boolean;
  imageRatio: ImageRatio;
  imageStyle: ImageStyle;
  generatedImageBase64: string | null;
  isGeneratingImage: boolean;
}