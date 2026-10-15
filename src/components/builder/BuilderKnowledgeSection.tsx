import React from 'react';
import { Agent, KnowledgeItem } from '../../types/app';
import { appStateService } from '../../services/appStateService';
import { Button } from '../../design-system/Button';
import {
  Database,
  FileText,
  FileCode,
  Check,
  Plus,
  ExternalLink,
  AlertCircle,
  Clock,
  CheckCircle2,
  Layers,
  Info,
} from 'lucide-react';

interface BuilderKnowledgeSectionProps {
  agent: Agent;
  onChange: (updates: Partial<Agent>) => void;
  onNavigateToKnowledge?: () => void;
}

export const BuilderKnowledgeSection: React.FC<BuilderKnowledgeSectionProps> = ({
  agent,
  onChange,
  onNavigateToKnowledge,
}) => {
  const allKnowledgeItems = appStateService.getKnowledge();
  const selectedIds = agent.selectedKnowledgeIds || [];

  const handleToggleKnowledge = (id: string) => {
    let updated: string[];
    if (selectedIds.includes(id)) {
      updated = selectedIds.filter((item) => item !== id);
    } else {
      updated = [...selectedIds, id];
    }
    onChange({ selectedKnowledgeIds: updated });
  };

  const handleSelectAll = () => {
    const allReadyIds = allKnowledgeItems.filter((k) => k.status === 'ready').map((k) => k.id);
    onChange({ selectedKnowledgeIds: allReadyIds });
  };

  const handleClearAll = () => {
    onChange({ selectedKnowledgeIds: [] });
  };

  // Calculate attached token metrics
  const attachedItems = allKnowledgeItems.filter((k) => selectedIds.includes(k.id));
  const totalAttachedTokens = attachedItems.reduce((acc, curr) => acc + (curr.tokensCount || 0), 0);

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in-0 duration-150">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono tracking-wider uppercase text-[#A78BFA] font-semibold">
            Section 05 · Domain Knowledge & Context
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#F4F2FA] mt-1">
            Attached Knowledge & Reference Data
          </h2>
          <p className="text-xs text-[#A5A2B4] mt-1 leading-relaxed">
            Attach verified workspace specifications, architecture guidelines, or notes to ground agent reasoning.
          </p>
        </div>

        {/* Quick Batch Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleClearAll}>
            Deselect All
          </Button>
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            Select All Ready
          </Button>
          {onNavigateToKnowledge && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onNavigateToKnowledge}
              leftIcon={<Plus size={13} />}
            >
              Upload Knowledge
            </Button>
          )}
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="p-4 rounded-2xl bg-[#111118] border border-[#292936] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#A78BFA]/15 text-[#A78BFA] flex items-center justify-center shrink-0">
            <Database size={16} />
          </div>
          <div>
            <div className="font-semibold text-[#F4F2FA]">
              Attached Sources: <strong className="font-mono text-[#A78BFA]">{selectedIds.length}</strong> of{' '}
              {allKnowledgeItems.length} available
            </div>
            <span className="text-[11px] text-[#777487]">
              Indexed Token Footprint: ~{totalAttachedTokens.toLocaleString()} tokens
            </span>
          </div>
        </div>

        <div className="text-[11px] font-mono text-[#65D6A3] bg-[#65D6A3]/10 border border-[#65D6A3]/20 px-2.5 py-1 rounded-lg">
          Zero Hallucination Grounding
        </div>
      </div>

      {/* Knowledge Item Cards */}
      {allKnowledgeItems.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#111118] border border-[#292936] text-center space-y-3">
          <Database size={24} className="mx-auto text-[#777487]" />
          <h3 className="text-sm font-semibold text-[#F4F2FA]">No Knowledge Items in Workspace</h3>
          <p className="text-xs text-[#A5A2B4] max-w-sm mx-auto">
            Upload PDFs, Markdown documentation, or API schemas to ground this agent in proprietary company context.
          </p>
          {onNavigateToKnowledge && (
            <Button variant="primary" size="sm" onClick={onNavigateToKnowledge}>
              Go to Knowledge Base
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {allKnowledgeItems.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const isReady = item.status === 'ready';

            return (
              <div
                key={item.id}
                onClick={() => handleToggleKnowledge(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 text-left ${
                  isSelected
                    ? 'bg-[#171720] border-[#A78BFA] shadow-xs'
                    : 'bg-[#111118] border-[#292936] hover:border-[#3D3D4E]'
                }`}
              >
                {/* Left: Icon & Name */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-[#A78BFA]/20 text-[#A78BFA]'
                        : 'bg-[#09090D] text-[#777487] border border-[#292936]'
                    }`}
                  >
                    {item.type === 'document' ? (
                      <FileText size={16} />
                    ) : item.type === 'source' ? (
                      <FileCode size={16} />
                    ) : (
                      <Database size={16} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#F4F2FA] truncate flex items-center gap-2">
                      <span className="truncate">{item.name}</span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#09090D] text-[#777487] border border-[#292936]">
                        {item.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-[#777487] mt-0.5">
                      <span>{(item.sizeBytes / 1024).toFixed(0)} KB</span>
                      {item.tokensCount && (
                        <span>• {item.tokensCount.toLocaleString()} tokens</span>
                      )}
                      <span>• Updated {new Date(item.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Status badge & Checkbox */}
                <div className="flex items-center gap-3 shrink-0">
                  {item.status === 'ready' ? (
                    <span className="text-[10px] font-mono text-[#65D6A3] bg-[#65D6A3]/10 border border-[#65D6A3]/20 px-2 py-0.5 rounded hidden sm:inline-block">
                      Ready
                    </span>
                  ) : item.status === 'indexing' ? (
                    <span className="text-[10px] font-mono text-[#A78BFA] bg-[#A78BFA]/10 border border-[#A78BFA]/20 px-2 py-0.5 rounded flex items-center gap-1">
                      <Clock size={10} className="animate-spin" /> Indexing
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[#F07885] bg-[#F07885]/10 border border-[#F07885]/20 px-2 py-0.5 rounded">
                      Ingestion Error
                    </span>
                  )}

                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors border ${
                      isSelected
                        ? 'bg-[#A78BFA] border-[#A78BFA] text-[#09090D]'
                        : 'border-[#292936] bg-[#09090D]'
                    }`}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Honest RAG Retrieval Policy Callout */}
      <div className="p-4 rounded-xl bg-[#09090D] border border-[#292936] text-xs text-[#A5A2B4] flex items-start gap-3">
        <Info size={16} className="text-[#A78BFA] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-[#F4F2FA]">Retrieval Architecture Contract:</span>
          <p className="leading-relaxed">
            Attaching documents stages them in the agent’s context catalog. When the agent is executed, the runtime chunking and semantic vector retrieval extracts only the most relevant passages matching the agent prompt, conserving model token context and maintaining audit citations.
          </p>
        </div>
      </div>
    </div>
  );
};
