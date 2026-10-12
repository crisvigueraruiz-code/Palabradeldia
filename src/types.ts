export type CategoryType = 'geopolitica' | 'tecnologia' | 'economia' | 'clima' | 'sociedad';
export type RegionType = 'Europa' | 'América' | 'Asia-Pacífico' | 'Oriente Medio' | 'África' | 'Global';

export interface CartoonBrief {
  visualIdea: string;
  charactersOrElements: string;
  punchlineOrIrony: string;
  setting: string;
  spainContext: string; // Vínculo con la realidad cotidiana de España
}

export interface WordOfTheDay {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  etymology: string;
  definition: string;
  whyToday: string;
  globalHeadline: string;
  contextQuote: string;
  synonyms: string[];
  antonyms: string[];
  citizenImpact: string;
  category: CategoryType;
  academicInsight?: string;
  historicalPrecedent?: string;
  cartoonBrief?: CartoonBrief; // Propuesta de viñeta para el ilustrador
}

export interface GlobalNewsItem {
  id: string;
  title: string;
  category: CategoryType;
  region: RegionType;
  country: string;
  coordinates: [number, number]; // [lat, lng]
  summary: string;
  keyPoints: string[];
  whyItMatters: string;
  relatedConcept: string;
  impactScore: number; // 1 to 5
  sources: string[];
  readTimeMinutes: number;
  detailedAnalysis?: string;
}

export interface DailyEdition {
  date: string; // YYYY-MM-DD
  formattedDate: string; // e.g. "8 de Octubre, 2026"
  editionNumber: number;
  wordOfTheDay: WordOfTheDay;
  summaryLead: string;
  newsItems: GlobalNewsItem[];
  worldTensionIndex: number; // 0 to 100
  dominantTheme: string;
  generatedByAi?: boolean;
}

export interface SavedWordItem {
  id: string;
  word: string;
  dateAdded: string;
  definition: string;
  category: CategoryType;
  notes?: string;
}

export interface GeneratedCaptions {
  visualAnalysis: string;
  instagram: {
    hook: string;
    body: string;
    whyWord: string;
    cta: string;
    hashtags: string[];
    fullText: string;
  };
  tiktok: {
    hookOnScreen: string;
    voiceoverScript: string;
    videoDescription: string;
    suggestedAudioStyle: string;
    hashtags: string[];
    fullText: string;
  };
  stories: {
    text: string;
    pollQuestion: string;
    pollOptions: [string, string];
  };
}

export interface PublishedCartoon {
  id: string;
  date: string;
  word: string;
  imageDataUrl: string;
  captions: GeneratedCaptions;
  authorSignature?: string;
}
