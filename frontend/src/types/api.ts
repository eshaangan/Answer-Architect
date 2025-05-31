export interface PromptRequest {
  text: string;
  style?: string;
  skip_refinement?: boolean;
}

export interface PromptResponse {
  response: string;
  processing_time_ms?: number;
  model_used?: string;
}

export interface DebugPromptResponse {
  raw_input: string;
  refined_prompt: string;
  final_response: string;
  model_used: string;
  processing_time_ms?: number;
  refinement_time_ms?: number;
  generation_time_ms?: number;
}

export interface HealthResponse {
  status: string;
  message: string;
  uptime_seconds?: number;
}

export interface ApiError {
  detail: string;
} 