export interface ModelProvider {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'requires_key' | 'coming_soon';
  requiresCustomKey: boolean;
}

export interface ModelDefinition {
  id: string;
  name: string;
  providerId: string;
  providerName: string;
  description: string;
  contextWindowTokens: number;
  contextWindowFormatted: string;
  defaultTemperature: number;
  defaultMaxTokens: number;
  maxTokensLimit: number;
  supportedFormats: ('text' | 'json' | 'markdown')[];
  capabilities: string[];
  recommendedFor: string;
  isDefault?: boolean;
  status: 'ready' | 'requires_key';
}

export const MODEL_PROVIDERS: ModelProvider[] = [
  {
    id: 'google',
    name: 'Google Gemini (Native Engine)',
    description: 'First-party model provider with native multimodal grounding and structured outputs.',
    status: 'active',
    requiresCustomKey: false,
  },
  {
    id: 'anthropic',
    name: 'Anthropic (External BYOK)',
    description: 'Requires an operator-provided Anthropic API secret in Workspace Settings.',
    status: 'requires_key',
    requiresCustomKey: true,
  },
  {
    id: 'openai',
    name: 'OpenAI (External BYOK)',
    description: 'Requires an operator-provided OpenAI API secret in Workspace Settings.',
    status: 'requires_key',
    requiresCustomKey: true,
  },
];

export const SUPPORTED_MODELS: ModelDefinition[] = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    providerId: 'google',
    providerName: 'Google DeepMind',
    description: 'High-throughput reasoning model optimized for sub-second agent routing, structured schemas, and multi-turn workflows.',
    contextWindowTokens: 1048576,
    contextWindowFormatted: '1,048,576 tokens (1M)',
    defaultTemperature: 0.7,
    defaultMaxTokens: 4096,
    maxTokensLimit: 8192,
    supportedFormats: ['text', 'json', 'markdown'],
    capabilities: ['Structured JSON Schema', 'Tool Calling', 'Multimodal Inputs', 'Fast Inference'],
    recommendedFor: 'Recommended for 90% of automated background research and triaging agents.',
    isDefault: true,
    status: 'ready',
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    providerId: 'google',
    providerName: 'Google DeepMind',
    description: 'Flagship reasoning engine for multi-step dependency analysis, intricate coding refactors, and complex synthesis.',
    contextWindowTokens: 2097152,
    contextWindowFormatted: '2,097,152 tokens (2M)',
    defaultTemperature: 0.4,
    defaultMaxTokens: 8192,
    maxTokensLimit: 16384,
    supportedFormats: ['text', 'json', 'markdown'],
    capabilities: ['Deep Code Reasoning', 'Extensive 2M Context', 'Complex Planning', 'Formal Logic'],
    recommendedFor: 'Best for AST codebase mapping, complex curriculum generation, and high-stakes operations.',
    status: 'ready',
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    providerId: 'google',
    providerName: 'Google DeepMind',
    description: 'Cost-efficient and rapid latency profile for lightweight classifying, ping evaluations, and keyword extraction.',
    contextWindowTokens: 1048576,
    contextWindowFormatted: '1,048,576 tokens (1M)',
    defaultTemperature: 0.2,
    defaultMaxTokens: 2048,
    maxTokensLimit: 8192,
    supportedFormats: ['text', 'json', 'markdown'],
    capabilities: ['Sub-second Response', 'Lightweight Triage', 'Low Token Footprint'],
    recommendedFor: 'Ideal for frequent cron pings, status categorizations, and prompt filters.',
    status: 'ready',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    providerId: 'anthropic',
    providerName: 'Anthropic',
    description: 'External frontier model for nuanced literary prose and algorithmic code analysis.',
    contextWindowTokens: 200000,
    contextWindowFormatted: '200,000 tokens',
    defaultTemperature: 0.5,
    defaultMaxTokens: 4096,
    maxTokensLimit: 8192,
    supportedFormats: ['text', 'json', 'markdown'],
    capabilities: ['Nuanced Coding', 'Artifacts Formatting', 'Prose Synthesis'],
    recommendedFor: 'Available when Anthropic API key is configured in Workspace Settings.',
    status: 'requires_key',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    providerId: 'openai',
    providerName: 'OpenAI',
    description: 'External multimodal model for cross-domain reasoning and tool routing.',
    contextWindowTokens: 128000,
    contextWindowFormatted: '128,000 tokens',
    defaultTemperature: 0.7,
    defaultMaxTokens: 4096,
    maxTokensLimit: 4096,
    supportedFormats: ['text', 'json', 'markdown'],
    capabilities: ['Function Calling', 'Multimodal Vision', 'JSON Mode'],
    recommendedFor: 'Available when OpenAI API key is configured in Workspace Settings.',
    status: 'requires_key',
  },
];
