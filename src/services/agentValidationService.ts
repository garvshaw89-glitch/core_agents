import { Agent, AgentValidationIssue } from '../types/app';
import { CORE_TOOL_REGISTRY } from '../data/tools';
import { SUPPORTED_MODELS } from '../data/models';
import { appStateService } from './appStateService';

export type AgentReadinessStage = 'invalid' | 'draft_valid' | 'ready_for_testing' | 'ready_for_execution';

export interface ValidationResult {
  issues: AgentValidationIssue[];
  errorsCount: number;
  warningsCount: number;
  infoCount: number;
  readinessStage: AgentReadinessStage;
  readinessLabel: string;
}

export function validateAgentConfiguration(agent: Partial<Agent>): ValidationResult {
  const issues: AgentValidationIssue[] = [];
  const integrations = appStateService.getIntegrations();
  const knowledge = appStateService.getKnowledge();

  // --- 1. Overview Checks ---
  const trimmedName = (agent.name || '').trim();
  if (!trimmedName) {
    issues.push({
      id: 'err-name-empty',
      section: 'overview',
      severity: 'error',
      message: 'Agent name is required.',
      field: 'name',
    });
  } else if (trimmedName.length < 3) {
    issues.push({
      id: 'warn-name-short',
      section: 'overview',
      severity: 'warning',
      message: 'Agent name is very short (under 3 characters).',
      field: 'name',
    });
  } else if (trimmedName.length > 80) {
    issues.push({
      id: 'err-name-long',
      section: 'overview',
      severity: 'error',
      message: 'Agent name must not exceed 80 characters.',
      field: 'name',
    });
  }

  const trimmedDesc = (agent.description || '').trim();
  if (!trimmedDesc) {
    issues.push({
      id: 'warn-desc-empty',
      section: 'overview',
      severity: 'warning',
      message: 'Agent description is empty. Add a concise summary of the agent’s objective.',
      field: 'description',
    });
  } else if (trimmedDesc.length > 320) {
    issues.push({
      id: 'warn-desc-long',
      section: 'overview',
      severity: 'warning',
      message: 'Description exceeds 320 characters.',
      field: 'description',
    });
  }

  // --- 2. Instructions Checks ---
  const hasFlatInstructions = (agent.instructions || '').trim().length > 0;
  const hasStructured =
    agent.structuredInstructions &&
    ((agent.structuredInstructions.role || '').trim() ||
      (agent.structuredInstructions.operatingProcedure || '').trim() ||
      (agent.structuredInstructions.primaryObjective || '').trim());

  if (!hasFlatInstructions && !hasStructured) {
    issues.push({
      id: 'err-instructions-empty',
      section: 'instructions',
      severity: 'error',
      message: 'System instructions are empty. An agent requires operating guidance.',
      field: 'instructions',
    });
  } else {
    const totalInstructionLen =
      (agent.instructions || '').length +
      (agent.structuredInstructions
        ? (agent.structuredInstructions.role || '').length +
          (agent.structuredInstructions.operatingProcedure || '').length +
          (agent.structuredInstructions.constraints || '').length
        : 0);

    if (totalInstructionLen < 40) {
      issues.push({
        id: 'warn-instructions-brief',
        section: 'instructions',
        severity: 'warning',
        message: 'Instructions are quite brief. Consider adding step-by-step operating procedures or constraints.',
        field: 'instructions',
      });
    }

    if (
      agent.structuredInstructions &&
      !agent.structuredInstructions.constraints &&
      !(agent.instructions || '').toLowerCase().includes('prohibit') &&
      !(agent.instructions || '').toLowerCase().includes('constraint')
    ) {
      issues.push({
        id: 'info-constraints-suggested',
        section: 'instructions',
        severity: 'info',
        message: 'No safety constraints defined. Specifying explicit prohibitions reduces hallucinations.',
        field: 'constraints',
      });
    }
  }

  // --- 3. Model Checks ---
  const selectedModelId = agent.modelConfig?.modelId || 'gemini-2.5-flash';
  const modelDef = SUPPORTED_MODELS.find((m) => m.id === selectedModelId);
  if (!modelDef) {
    issues.push({
      id: 'err-model-unsupported',
      section: 'model',
      severity: 'error',
      message: `Selected model ID "${selectedModelId}" is not in the supported model registry.`,
      field: 'modelId',
    });
  } else if (modelDef.status === 'requires_key') {
    issues.push({
      id: 'warn-model-key-needed',
      section: 'model',
      severity: 'warning',
      message: `${modelDef.name} requires an external API key in Workspace Settings before live execution.`,
      field: 'modelId',
    });
  }

  if (agent.modelConfig && agent.modelConfig.temperature > 1.4) {
    issues.push({
      id: 'info-temp-high',
      section: 'model',
      severity: 'info',
      message: `Temperature is set to ${agent.modelConfig.temperature.toFixed(2)}. High temperature increases creativity but may increase hallucination risks in factual tasks.`,
      field: 'temperature',
    });
  }

  // --- 4. Tools & Integration Checks ---
  const enabledTools = agent.tools || [];
  if (enabledTools.length === 0) {
    issues.push({
      id: 'info-no-tools',
      section: 'tools',
      severity: 'info',
      message: 'No tools enabled. The agent will operate purely on internal model weights without external data fetching.',
    });
  } else {
    enabledTools.forEach((toolName) => {
      const toolDef = CORE_TOOL_REGISTRY.find((t) => t.name.toLowerCase() === toolName.toLowerCase());
      if (!toolDef) {
        issues.push({
          id: `warn-unknown-tool-${toolName}`,
          section: 'tools',
          severity: 'warning',
          message: `Tool "${toolName}" is not registered in the verified CORE tool registry.`,
        });
      } else if (toolDef.requiredIntegrationId) {
        const requiredInt = integrations.find((i) => i.id === toolDef.requiredIntegrationId);
        if (!requiredInt || requiredInt.status !== 'connected') {
          issues.push({
            id: `warn-tool-integration-${toolDef.id}`,
            section: 'tools',
            severity: 'warning',
            message: `Tool "${toolDef.name}" requires the "${toolDef.requiredIntegrationName || 'External'}" integration, which is currently disconnected.`,
          });
        }
      }
    });
  }

  // --- 5. Knowledge Checks ---
  const attachedKnowledgeIds = agent.selectedKnowledgeIds || [];
  if (attachedKnowledgeIds.length > 0) {
    attachedKnowledgeIds.forEach((kid) => {
      const kitem = knowledge.find((k) => k.id === kid);
      if (!kitem) {
        issues.push({
          id: `warn-missing-k-${kid}`,
          section: 'knowledge',
          severity: 'warning',
          message: `Attached knowledge source ID "${kid}" no longer exists in the workspace repository.`,
        });
      } else if (kitem.status === 'indexing') {
        issues.push({
          id: `info-k-indexing-${kid}`,
          section: 'knowledge',
          severity: 'info',
          message: `Knowledge source "${kitem.name}" is still indexing chunks.`,
        });
      } else if (kitem.status === 'error') {
        issues.push({
          id: `warn-k-error-${kid}`,
          section: 'knowledge',
          severity: 'warning',
          message: `Knowledge source "${kitem.name}" has an ingestion error and cannot be queried.`,
        });
      }
    });
  }

  // --- 6. Permissions & Policy Checks ---
  const hasConsequentialTool = enabledTools.some((tName) => {
    const tDef = CORE_TOOL_REGISTRY.find((t) => t.name.toLowerCase() === tName.toLowerCase());
    return tDef?.riskLevel === 'consequential' || tDef?.requiresHumanApproval;
  });

  const approvalEnforced = agent.humanApprovalRequired !== false && agent.permissionsPolicy?.requireApprovalForConsequential !== false;

  if (hasConsequentialTool && !approvalEnforced) {
    issues.push({
      id: 'warn-consequential-unprotected',
      section: 'permissions',
      severity: 'warning',
      message: 'State-changing tools are enabled without the human approval gate. It is strongly recommended to enforce human sign-off for consequential actions.',
      field: 'humanApprovalRequired',
    });
  }

  // --- Calculate Overall Readiness Stage ---
  const errorsCount = issues.filter((i) => i.severity === 'error').length;
  const warningsCount = issues.filter((i) => i.severity === 'warning').length;
  const infoCount = issues.filter((i) => i.severity === 'info').length;

  let readinessStage: AgentReadinessStage = 'ready_for_execution';
  let readinessLabel = 'Ready for Execution';

  if (errorsCount > 0) {
    readinessStage = 'invalid';
    readinessLabel = `${errorsCount} Error${errorsCount > 1 ? 's' : ''} Must Be Fixed`;
  } else if (warningsCount > 0) {
    readinessStage = 'draft_valid';
    readinessLabel = `Valid Draft (${warningsCount} Warning${warningsCount > 1 ? 's' : ''})`;
  } else if (enabledTools.length === 0 && attachedKnowledgeIds.length === 0) {
    readinessStage = 'ready_for_testing';
    readinessLabel = 'Ready for Testing (Standalone)';
  }

  return {
    issues,
    errorsCount,
    warningsCount,
    infoCount,
    readinessStage,
    readinessLabel,
  };
}
