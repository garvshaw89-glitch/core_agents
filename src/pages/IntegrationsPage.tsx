import React, { useState, useEffect } from 'react';
import { PageHeader } from '../design-system/PageHeader';
import { Button } from '../design-system/Button';
import { StatusBadge } from '../design-system/StatusBadge';
import { Dialog } from '../design-system/Dialog';
import { ConfirmationDialog } from '../design-system/ConfirmationDialog';
import { useToast } from '../design-system/Toast';
import { appStateService } from '../services/appStateService';
import { Integration } from '../types/app';
import {
  GitBranch,
  MessageSquare,
  Calendar,
  Mail,
  Webhook,
  ShieldCheck,
  ExternalLink,
  Check,
  AlertCircle,
  Lock,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  GitBranch,
  MessageSquare,
  Calendar,
  Mail,
  Webhook,
};

export const IntegrationsPage: React.FC = () => {
  const { showToast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [configuringIntegration, setConfiguringIntegration] = useState<Integration | null>(null);
  const [disconnectingIntegration, setDisconnectingIntegration] = useState<Integration | null>(null);

  const loadData = () => {
    setIntegrations(appStateService.getIntegrations());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleConnectToggle = (integration: Integration) => {
    if (integration.status === 'connected') {
      setDisconnectingIntegration(integration);
    } else {
      setConfiguringIntegration(integration);
    }
  };

  const handleConfirmDisconnect = () => {
    if (disconnectingIntegration) {
      appStateService.toggleIntegration(disconnectingIntegration.id);
      loadData();
      showToast({
        type: 'info',
        title: 'Integration Disconnected',
        message: `${disconnectingIntegration.name} authorization tokens revoked.`,
      });
      setDisconnectingIntegration(null);
    }
  };

  const handleConfirmConnect = () => {
    if (configuringIntegration) {
      appStateService.toggleIntegration(configuringIntegration.id);
      loadData();
      showToast({
        type: 'success',
        title: 'Integration Connected',
        message: `${configuringIntegration.name} connected with bounded scopes.`,
      });
      setConfiguringIntegration(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-150">
      <PageHeader
        title="Integrations"
        description="Connect authorized developer tools, notifications, and webhook endpoints with strict permission scoping."
      />

      {/* Security Contract Notice */}
      <div className="p-4 rounded-xl bg-[#0D1220]/90 border border-slate-800/70 backdrop-blur-md flex items-start gap-3 text-xs">
        <Lock size={16} className="text-[#38D9FF] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-[#F4F7FC]">Strict Boundary & Secret Security</div>
          <p className="text-[#9AA7BC] leading-relaxed">
            CORE Agents never stores or exposes unencrypted OAuth client secrets or database passwords in client bundles.
            External tool connections operate with scoped, least-privilege tokens.
          </p>
        </div>
      </div>

      {/* Integrations Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {integrations.map((item) => {
          const IconComponent = iconMap[item.icon] || Webhook;
          const isConnected = item.status === 'connected';

          return (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-[#0D1220]/90 border border-slate-800/70 hover:border-[#38D9FF]/40 hover:bg-[#111827] transition-all flex flex-col justify-between text-left space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[#151D2E] border border-slate-700/60 text-[#38D9FF] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <IconComponent size={20} />
                  </div>
                  <StatusBadge status={item.status} size="sm" />
                </div>

                <h3 className="text-base font-semibold text-[#F4F7FC] mb-1 group-hover:text-white">{item.name}</h3>
                <p className="text-xs text-[#9AA7BC] leading-relaxed mb-4">{item.description}</p>

                {/* Scopes Whitelist */}
                <div className="space-y-1.5">
                  <div className="text-[11px] text-[#64748B] flex items-center gap-1 font-mono">
                    <ShieldCheck size={12} className="text-[#38D9FF]" />
                    <span>Required scopes:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.scopes.map((scope) => (
                      <span
                        key={scope}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#111827] border border-slate-800 text-[#9AA7BC]"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between">
                <span className="text-[11px] text-[#64748B] font-mono">
                  {isConnected && item.connectedAt ? (
                    <>Connected on {new Date(item.connectedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</>
                  ) : (
                    <>Requires OAuth / Token</>
                  )}
                </span>

                <Button
                  variant={isConnected ? 'outline' : 'primary'}
                  size="xs"
                  onClick={() => handleConnectToggle(item)}
                >
                  {isConnected ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connect Configuration Dialog */}
      <Dialog
        isOpen={configuringIntegration !== null}
        onClose={() => setConfiguringIntegration(null)}
        title={`Connect ${configuringIntegration?.name}`}
        description="Review the permission scopes and authorize bounded agent access."
      >
        <div className="space-y-4 pt-2">
          <div className="p-3.5 rounded-xl bg-[#111827] border border-slate-700/60 space-y-2 text-xs">
            <div className="text-xs font-semibold text-[#F4F7FC]">Requested Least-Privilege Scopes:</div>
            <ul className="space-y-1 text-[#9AA7BC]">
              {configuringIntegration?.scopes.map((scope) => (
                <li key={scope} className="font-mono text-[11px] flex items-center gap-1.5">
                  <Check size={12} className="text-[#34D399]" />
                  <span>{scope}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-[#64748B] leading-relaxed">
            By connecting this provider, agents granted explicit tool entitlements will be allowed to invoke
            authorized endpoints within these bounded permissions.
          </p>

          <div className="pt-3 flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setConfiguringIntegration(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleConfirmConnect}>
              Authorize & Connect
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Disconnect Confirmation */}
      <ConfirmationDialog
        isOpen={disconnectingIntegration !== null}
        onClose={() => setDisconnectingIntegration(null)}
        onConfirm={handleConfirmDisconnect}
        title={`Disconnect ${disconnectingIntegration?.name}?`}
        message={`Are you sure you want to disconnect ${disconnectingIntegration?.name}? Any active agents relying on this integration's tools will pause execution.`}
        confirmLabel="Disconnect Provider"
        variant="danger"
      />
    </div>
  );
};
