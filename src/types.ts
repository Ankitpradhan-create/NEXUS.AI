export enum MainView {
  History = "history",
  Models = "models",
  Workspace = "workspace",
  Settings = "settings",
  Help = "help"
}

export enum ModelsSubView {
  Comparison = "comparison",
  Generation = "generation"
}

export interface ModelResponse {
  text: string;
  latency: number;
  model: string;
  provider: string;
  temperature: number;
}

export interface AnalyticsData {
  similarity: number;
  toxicity: number;
}

export interface CompareResult {
  gpt: ModelResponse;
  claude: ModelResponse;
  analytics: AnalyticsData;
  prompt: string;
  isSimulated?: boolean;
}

export interface GenerationParams {
  aspectRatio: string;
  stylize: number;
  stylePreset: string;
}

export interface ImageGenerationItem {
  id: string;
  prompt: string;
  imageUrl: string;
  variations: string[];
  timestamp: string;
  params: GenerationParams;
}

export interface ApiProvider {
  id: string;
  code: string;
  name: string;
  status: "Active" | "Quota Exceeded" | "Inactive";
  keyIdentifier: string;
  limitTotal: number;
  limitUsed: number;
}

export interface FineTuneJob {
  id: string;
  name: string;
  baseModel: string;
  status: "Completed" | "Processing" | "Failed";
  trainingSet: string;
  loss?: number;
  progress?: number;
  estimated?: string;
}

export interface HistorySession {
  id: string;
  prompt: string;
  timestamp: string;
  view: MainView;
  subView?: ModelsSubView;
  data: any; // Saves CompareResult, MultiPaneSession, or ImageGenerationItem
}
