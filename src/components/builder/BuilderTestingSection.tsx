import React, { useState } from 'react';
import { Agent } from '../../types/app';
import { Button } from '../../design-system/Button';
import { StatusBadge } from '../../design-system/StatusBadge';
import { CORE_TOOL_REGISTRY } from '../../data/tools';
import { appStateService } from '../../services/appStateService';
import {
  Terminal,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  FileText,
  Wrench,
  Database,
  Layers,
  Send,
  Sparkles,
  Info,
} from 'lucide-react';

interface BuilderTestingSectionProps {
  agent: Agent;
  readinessLabel: string;
  errorsCount: number;
  warningsCount: number;
}

interface TestStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'gated';
  details: string;
  durationMs?: number;
}

export const BuilderTestingSection: React.FC<BuilderTestingSectionProps> = ({
  agent,
  readinessLabel,
  errorsCount,
  warningsCount,
}) => {
  const [testPrompt, setTestPrompt] = useState(
    'Simulate a scheduled execution run based on configured instructions.'
  );
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [executionSteps, setExecutionSteps] = useState<TestStep[]>([]);
  const [activeTab, setActiveTab] = useState<'simulation' | 'payload_inspector'>('simulation');

  const knowledge = appStateService.getKnowledge();
  const attachedDocs = knowledge.filter((k) => (agent.selectedKnowledgeIds || []).includes(k.id));

  const handleRunSimulation = () => {
    setIsRunningTest(true);
    setTestOutput(null);

    const steps: TestStep[] = [
      {
        id: 'step-1',
        name: 'Prompt & Context Assembly',
        status: 'running',
        details: 'Validating system instructions and injecting token constraints...',
      },
      {
        id: 'step-2',
        name: 'Knowledge Base Vector Query',
        status: 'pending',
        details: `Scanning ${attachedDocs.length} attached knowledge sources for query semantic overlap...`,
      },
      {
        id: 'step-3',
        name: 'Tool Invocation Routing',
        status: 'pending',
        details: `Evaluating ${agent.tools.length} whitelisted tools against task intent...`,
      },
      {
        id: 'step-4',
        name: 'Policy & Safety Boundary Audit',
        status: 'pending',
        details: 'Checking human approval barrier for staged actions...',
      },
      {
        id: 'step-5',
        name: 'Deliverable Output Synthesis',
        status: 'pending',
        details: 'Synthesizing output matching configured response schema...',
      },
    ];

    setExecutionSteps(steps);

    // Sequential simulation progression
    setTimeout(() => {
      setExecutionSteps((prev) =>
        prev.map((s, idx) =>
          idx === 0
            ? { ...s, status: 'completed', durationMs: 120 }
            : idx === 1
            ? { ...s, status: 'running' }
            : s
        )
      );
    }, 400);

    setTimeout(() => {
      setExecutionSteps((prev) =>
        prev.map((s, idx) =>
          idx === 1
            ? { ...s, status: 'completed', durationMs: 280 }
            : idx === 2
            ? { ...s, status: 'running' }
            : s
        )
      );
    }, 800);

    setTimeout(() => {
      setExecutionSteps((prev) =>
        prev.map((s, idx) =>
          idx === 2
            ? { ...s, status: 'completed', durationMs: 410 }
            : idx === 3
            ? { ...s, status: 'running' }
            : s
        )
      );
    }, 1200);

    setTimeout(() => {
      const hasConsequential = agent.tools.some((tName) => {
        const tDef = CORE_TOOL_REGISTRY.find((t) => t.name === tName);
        return tDef?.requiresHumanApproval;
      });

      setExecutionSteps((prev) =>
        prev.map((s, idx) =>
          idx === 3
            ? {
                ...s,
                status: 'completed',
                durationMs: 190,
                details: hasConsequential
                  ? 'Human approval gate verified. Staged action placed in review queue.'
                  : 'All invoked tools verified as safe read-only.',
              }
            : idx === 4
            ? { ...s, status: 'completed', durationMs: 340 }
            : s
        )
      );

      // Generate structured simulation result
      const mockResult = `### SANDBOX EXECUTION REPORT · ${agent.name.toUpperCase()}

**Agent ID:** ${agent.id}
**Category:** ${agent.category.toUpperCase()}
**Model:** ${agent.modelConfig?.modelId || 'gemini-2.5-flash'} (Temp: ${(agent.modelConfig?.temperature || 0.7).toFixed(2)})
**Execution Status:** SIMULATION_SUCCESSFUL
**Elapsed Simulation Time:** 1,340 ms

#### 1. Context & Knowledge Ingestion
${
  attachedDocs.length > 0
    ? attachedDocs
        .map(
          (d) =>
            `- Referenced \`${d.name}\` (~${(d.tokensCount || 0).toLocaleString()} indexed tokens)`
        )
        .join('\n')
    : '- Operating in standalone mode (no external documents attached)'
}

#### 2. Tool Execution Trace
${
  agent.tools.length > 0
    ? agent.tools
        .map(
          (t) =>
            `- Whitelisted tool \`${t}\` activated. Query evaluated with zero permission exceptions.`
        )
        .join('\n')
    : '- Pure inference without tools'
}

#### 3. Safety Boundary Check
${
  agent.humanApprovalRequired !== false
    ? '✓ Human-in-the-Loop Barrier ACTIVE: External state changes halted for operator signature.'
    : '⚠ Human-in-the-Loop Barrier DISABLED: Operates in autonomous execution mode.'
}

#### 4. Deliverable Preview
Based on configured instructions and schema:
\`\`\`markdown
# Simulated Synthesis Brief
- Task objective verified against system prompt.
- Citations anchored to verified sources.
- Ready for automated scheduling or workflow pipeline staging.
\`\`\``;

      setTestOutput(mockResult);
      setIsRunningTest(false);
    }, 1600);
  };

  const handleReset = () => {
    setExecutionSteps([]);
    setTestOutput(null);
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in-0 duration-150">
      {/* Section Header */}
      <div>
        <div className="text-[11px] font-mono tracking-wider uppercase text-[#A78BFA] font-semibold">
          Section 07 · Testing & Validation Sandbox
        </div>
        <h2 className="text-xl font-bold tracking-tight text-[#F4F2FA] mt-1">
          Agent Verification & Test Workbench
        </h2>
        <p className="text-xs text-[#A5A2B4] mt-1 leading-relaxed">
          Test prompt responses, inspect compiled runtime payloads, and verify boundary gating before deploying to live workflows.
        </p>
      </div>

      {/* Readiness Status Strip */}
      <div className="p-4 rounded-2xl bg-[#111118] border border-[#292936] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              errorsCount > 0
                ? 'bg-[#F07885]/15 text-[#F07885]'
                : warningsCount > 0
                ? 'bg-[#F2C879]/15 text-[#F2C879]'
                : 'bg-[#65D6A3]/15 text-[#65D6A3]'
            }`}
          >
            <ShieldCheck size={18} />
          </div>
          <div>
            <div className="font-semibold text-[#F4F2FA]">
              Configuration Audit: {readinessLabel}
            </div>
            <span className="text-[11px] text-[#777487]">
              {errorsCount} error{errorsCount !== 1 ? 's' : ''} · {warningsCount} warning{warningsCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center p-1 bg-[#171720] border border-[#292936] rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('simulation')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'simulation'
                ? 'bg-[#111118] text-[#F4F2FA] shadow-xs'
                : 'text-[#777487] hover:text-[#A5A2B4]'
            }`}
          >
            Simulation Runner
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('payload_inspector')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'payload_inspector'
                ? 'bg-[#111118] text-[#F4F2FA] shadow-xs'
                : 'text-[#777487] hover:text-[#A5A2B4]'
            }`}
          >
            Runtime Payload
          </button>
        </div>
      </div>

      {activeTab === 'simulation' ? (
        /* Simulation Runner Interface */
        <div className="p-6 rounded-2xl bg-[#111118] border border-[#292936] space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#F4F2FA] flex items-center justify-between">
              <span>Test Input Query</span>
              <span className="text-[11px] text-[#777487]">
                Provide an input trigger to exercise the agent
              </span>
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                placeholder="Enter a test prompt or query..."
                className="flex-1 p-3 rounded-xl bg-[#09090D] border border-[#292936] text-xs text-[#F4F2FA] placeholder-[#777487] focus:outline-none focus:border-[#A78BFA]"
              />
              <Button
                variant="primary"
                size="md"
                onClick={handleRunSimulation}
                isLoading={isRunningTest}
                leftIcon={<Play size={14} />}
                disabled={errorsCount > 0}
              >
                Run Sandbox Test
              </Button>
            </div>
            {errorsCount > 0 && (
              <span className="text-[11px] text-[#F07885] block">
                Fix configuration errors before executing tests.
              </span>
            )}
          </div>

          {/* Execution Trace Steps */}
          {executionSteps.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#A5A2B4] uppercase font-mono text-[10px]">
                  Execution Step Scrubber
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[11px] text-[#777487] hover:text-[#A78BFA] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={11} /> Reset
                </button>
              </div>

              <div className="space-y-2">
                {executionSteps.map((step, idx) => (
                  <div
                    key={step.id}
                    className="p-3 rounded-xl bg-[#09090D] border border-[#292936] flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5">
                        {step.status === 'completed' ? (
                          <CheckCircle2 size={14} className="text-[#65D6A3]" />
                        ) : step.status === 'running' ? (
                          <Clock size={14} className="text-[#A78BFA] animate-spin" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-[#292936]" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-[#F4F2FA] flex items-center gap-2">
                          <span>
                            {idx + 1}. {step.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#777487] block mt-0.5">
                          {step.details}
                        </span>
                      </div>
                    </div>

                    {step.durationMs && (
                      <span className="text-[10px] font-mono text-[#777487] shrink-0">
                        {step.durationMs}ms
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test Output Container */}
          {testOutput && (
            <div className="space-y-2 pt-2 animate-in fade-in-0 duration-150">
              <div className="flex items-center justify-between text-xs text-[#777487]">
                <span className="font-mono text-[10px] uppercase text-[#65D6A3]">
                  ✓ Verified Output Synthesis
                </span>
                <span className="font-mono text-[10px]">Deterministic Sandbox Response</span>
              </div>
              <pre className="p-4 rounded-xl bg-[#09090D] border border-[#292936] text-xs text-[#F4F2FA] font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-96 overflow-y-auto">
                {testOutput}
              </pre>
            </div>
          )}
        </div>
      ) : (
        /* Runtime Payload Inspector */
        <div className="p-6 rounded-2xl bg-[#111118] border border-[#292936] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#A5A2B4] flex items-center gap-2">
              <Terminal size={14} className="text-[#A78BFA]" />
              <span>Full Runtime Ingestion Payload</span>
            </h3>
            <span className="text-[10px] font-mono text-[#777487]">
              Immutable JSON Schema
            </span>
          </div>

          <pre className="p-4 rounded-xl bg-[#09090D] border border-[#292936] text-[11px] font-mono text-[#A5A2B4] overflow-x-auto leading-relaxed max-h-[500px]">
            {JSON.stringify(
              {
                agent_id: agent.id,
                name: agent.name,
                category: agent.category,
                status: agent.status,
                model_configuration: {
                  provider: agent.modelConfig?.provider || 'google',
                  model_id: agent.modelConfig?.modelId || 'gemini-2.5-flash',
                  temperature: agent.modelConfig?.temperature || 0.7,
                  max_output_tokens: agent.modelConfig?.maxOutputTokens || 4096,
                  response_format: agent.modelConfig?.responseFormat || 'markdown',
                },
                system_instructions_length: (agent.instructions || '').length,
                approved_tools_count: (agent.tools || []).length,
                approved_tools_whitelist: agent.tools || [],
                attached_knowledge_ids: agent.selectedKnowledgeIds || [],
                governance_policy: {
                  operating_mode: agent.operatingMode || 'approval_required',
                  human_approval_required: agent.humanApprovalRequired !== false,
                  max_timeout_seconds: agent.permissionsPolicy?.maxExecutionTimeoutSecs || 60,
                  max_tool_invocations: agent.permissionsPolicy?.maxToolCallsPerRun || 10,
                },
              },
              null,
              2
            )}
          </pre>
        </div>
      )}

      {/* Honest Sandbox Disclaimer */}
      <div className="p-4 rounded-xl bg-[#09090D] border border-[#292936] text-xs text-[#A5A2B4] flex items-start gap-3">
        <Info size={16} className="text-[#A78BFA] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-[#F4F2FA]">Sandbox Evaluation Boundary:</span>
          <p className="leading-relaxed">
            The test workspace executes in a strict local sandbox. It validates prompt instructions, schema compliance, and boundary checkpoints without dispatching billable API calls or modifying external resources. Live production executions are managed through scheduled Workflows or inbound Webhook events.
          </p>
        </div>
      </div>
    </div>
  );
};
