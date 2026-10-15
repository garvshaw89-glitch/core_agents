import React from 'react';
import { Agent, AgentModelConfig } from '../../types/app';
import { SUPPORTED_MODELS, MODEL_PROVIDERS, ModelDefinition } from '../../data/models';
import { Button } from '../../design-system/Button';
import {
  Cpu,
  Sliders,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Sparkles,
  Zap,
  Shield,
  Layers,
  ExternalLink,
  Info,
} from 'lucide-react';

interface BuilderModelSectionProps {
  agent: Agent;
  onChange: (updates: Partial<Agent>) => void;
  onNavigateToSettings?: () => void;
}

export const BuilderModelSection: React.FC<BuilderModelSectionProps> = ({
  agent,
  onChange,
  onNavigateToSettings,
}) => {
  const currentModelConfig: AgentModelConfig = agent.modelConfig || {
    provider: 'google',
    modelId: 'gemini-2.5-flash',
    temperature: 0.7,
    maxOutputTokens: 4096,
    responseFormat: 'markdown',
  };

  const selectedModel =
    SUPPORTED_MODELS.find((m) => m.id === currentModelConfig.modelId) || SUPPORTED_MODELS[0];

  const handleSelectModel = (model: ModelDefinition) => {
    onChange({
      modelConfig: {
        ...currentModelConfig,
        provider: model.providerId,
        modelId: model.id,
        temperature: model.defaultTemperature,
        maxOutputTokens: model.defaultMaxTokens,
      },
    });
  };

  const handleUpdateConfig = (updates: Partial<AgentModelConfig>) => {
    onChange({
      modelConfig: {
        ...currentModelConfig,
        ...updates,
      },
    });
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in-0 duration-150">
      {/* Section Header */}
      <div>
        <div className="text-[11px] font-mono tracking-wider uppercase text-[#A78BFA] font-semibold">
          Section 03 · Model Engine & Generation
        </div>
        <h2 className="text-xl font-bold tracking-tight text-[#F4F2FA] mt-1">
          Model Selection & Inference Calibration
        </h2>
        <p className="text-xs text-[#A5A2B4] mt-1 leading-relaxed">
          Configure the AI foundation model, reasoning temperature, and token ceilings for this specialist agent.
        </p>
      </div>

      {/* Model Selection Cards */}
      <div className="space-y-4">
        <label className="text-xs font-semibold text-[#A5A2B4] block uppercase tracking-wider font-mono">
          Available Foundation Models
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SUPPORTED_MODELS.map((model) => {
            const isSelected = currentModelConfig.modelId === model.id;
            const isReady = model.status === 'ready';

            return (
              <div
                key={model.id}
                onClick={() => handleSelectModel(model)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#171720] border-[#A78BFA] shadow-lg shadow-[#A78BFA]/5'
                    : 'bg-[#111118] border-[#292936] hover:border-[#3D3D4E]'
                }`}
              >
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#A78BFA]/20 text-[#A78BFA]'
                            : 'bg-[#171720] text-[#777487]'
                        }`}
                      >
                        <Cpu size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#F4F2FA] flex items-center gap-2">
                          <span>{model.name}</span>
                          {model.isDefault && (
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#65D6A3]/15 text-[#65D6A3] border border-[#65D6A3]/30">
                              Default
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#777487]">{model.providerName}</span>
                      </div>
                    </div>

                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-[#A78BFA] text-[#09090D] flex items-center justify-center shrink-0">
                        <CheckCircle2 size={13} />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-[#292936] shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-[#A5A2B4] leading-relaxed line-clamp-2">
                    {model.description}
                  </p>
                </div>

                {/* Capabilities & Badges */}
                <div className="space-y-3 pt-4 mt-3 border-t border-[#292936]/60">
                  <div className="flex flex-wrap gap-1.5">
                    {model.capabilities.map((cap) => (
                      <span
                        key={cap}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#09090D] border border-[#292936] text-[#A5A2B4]"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#777487]">Context window:</span>
                    <span className="font-mono text-[#F4F2FA]">{model.contextWindowFormatted}</span>
                  </div>

                  {!isReady && (
                    <div className="p-2 rounded-lg bg-[#F2C879]/10 border border-[#F2C879]/20 text-[11px] text-[#F2C879] flex items-center gap-1.5">
                      <AlertCircle size={12} className="shrink-0" />
                      <span>External model: requires API key in Settings</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inference Hyperparameters */}
      <div className="p-6 rounded-2xl bg-[#111118] border border-[#292936] space-y-6">
        <h3 className="text-sm font-bold text-[#F4F2FA] flex items-center gap-2">
          <Sliders size={15} className="text-[#A78BFA]" />
          <span>Inference Settings for {selectedModel.name}</span>
        </h3>

        {/* Temperature */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-[#F4F2FA] flex items-center gap-2">
              <span>Sampling Temperature</span>
              <span className="text-[11px] font-mono text-[#A78BFA] bg-[#171720] border border-[#292936] px-2 py-0.5 rounded">
                {currentModelConfig.temperature.toFixed(2)}
              </span>
            </label>
            <span className="text-[#777487] text-[11px]">
              {currentModelConfig.temperature <= 0.3
                ? 'Strict / Deterministic'
                : currentModelConfig.temperature <= 0.8
                ? 'Balanced Reasoning'
                : 'Creative / Exploratory'}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="1.5"
            step="0.05"
            value={currentModelConfig.temperature}
            onChange={(e) => handleUpdateConfig({ temperature: parseFloat(e.target.value) })}
            className="w-full accent-[#A78BFA] bg-[#171720] h-2 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-[#777487] font-mono">
            <span>0.0 (Code / Factual)</span>
            <span>0.7 (Default)</span>
            <span>1.5 (High Variance)</span>
          </div>
        </div>

        {/* Max Tokens & Response Format */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#292936]/60">
          {/* Max Output Tokens */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#A5A2B4] block">
              Max Generation Output Tokens
            </label>
            <select
              value={currentModelConfig.maxOutputTokens}
              onChange={(e) => handleUpdateConfig({ maxOutputTokens: parseInt(e.target.value) })}
              className="w-full bg-[#09090D] border border-[#292936] rounded-xl px-3 py-2.5 text-xs text-[#F4F2FA] focus:outline-none focus:border-[#A78BFA] cursor-pointer"
            >
              <option value={1024}>1,024 tokens (~750 words)</option>
              <option value={2048}>2,048 tokens (~1,500 words)</option>
              <option value={4096}>4,096 tokens (Standard default)</option>
              <option value={8192}>8,192 tokens (Extended output)</option>
            </select>
            <span className="text-[11px] text-[#777487] block">
              Ceiling on the total tokens generated in a single agent step.
            </span>
          </div>

          {/* Response Format */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#A5A2B4] block">
              Enforced Response Format
            </label>
            <select
              value={currentModelConfig.responseFormat}
              onChange={(e) =>
                handleUpdateConfig({
                  responseFormat: e.target.value as 'text' | 'json' | 'markdown',
                })
              }
              className="w-full bg-[#09090D] border border-[#292936] rounded-xl px-3 py-2.5 text-xs text-[#F4F2FA] focus:outline-none focus:border-[#A78BFA] cursor-pointer"
            >
              <option value="markdown">Markdown Document (Headers, tables, lists)</option>
              <option value="json">Structured JSON (Schema-constrained payload)</option>
              <option value="text">Raw Plain Text (Unformatted)</option>
            </select>
            <span className="text-[11px] text-[#777487] block">
              Constrains model output decoding format.
            </span>
          </div>
        </div>
      </div>

      {/* Honest Provider Status Callout */}
      <div className="p-4 rounded-xl bg-[#09090D] border border-[#292936] text-xs text-[#A5A2B4] flex items-start gap-3">
        <Info size={16} className="text-[#A78BFA] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-[#F4F2FA]">Execution & Secrets Policy:</span>
          <p className="leading-relaxed">
            API secrets are never stored in agent definitions or exposed to client-side code. First-party Google Gemini execution is orchestrated by the platform engine, while external BYOK providers connect through secure server-side credentials configured in Workspace Settings.
          </p>
        </div>
      </div>
    </div>
  );
};
