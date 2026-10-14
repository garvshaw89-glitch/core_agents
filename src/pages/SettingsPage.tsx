import React, { useState, useEffect } from 'react';
import { PageHeader } from '../design-system/PageHeader';
import { Tabs } from '../design-system/Tabs';
import { Button } from '../design-system/Button';
import { Input } from '../design-system/Input';
import { useToast } from '../design-system/Toast';
import { appStateService } from '../services/appStateService';
import { UserProfile } from '../types/app';
import {
  User,
  Building,
  Palette,
  Bell,
  Shield,
  Gauge,
  CheckCircle2,
  Lock,
  Key,
  RotateCcw,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile form state
  const [profile, setProfile] = useState<UserProfile>(appStateService.getUserProfile());
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [workspaceName, setWorkspaceName] = useState(profile.workspaceName);

  // Notifications state
  const [notifyOnApproval, setNotifyOnApproval] = useState(true);
  const [notifyOnFailure, setNotifyOnFailure] = useState(true);
  const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(false);

  // Security state
  const [require2FA, setRequire2FA] = useState(true);
  const [auditLogRetentionDays, setAuditLogRetentionDays] = useState('30');

  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={13} /> },
    { id: 'workspace', label: 'Workspace', icon: <Building size={13} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={13} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={13} /> },
    { id: 'security', label: 'Security & Auth', icon: <Shield size={13} /> },
    { id: 'usage', label: 'Usage & Limits', icon: <Gauge size={13} /> },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      const updated: UserProfile = {
        ...profile,
        name: name.trim(),
        email: email.trim(),
        workspaceName: workspaceName.trim(),
      };
      appStateService.saveUserProfile(updated);
      setProfile(updated);
      setIsSaving(false);
      showToast({
        type: 'success',
        title: 'Settings Saved',
        message: 'Your profile and workspace details have been updated.',
      });
    }, 400);
  };

  const handleResetWorkspace = () => {
    appStateService.resetAll();
    setProfile(appStateService.getUserProfile());
    setName(appStateService.getUserProfile().name);
    setEmail(appStateService.getUserProfile().email);
    setWorkspaceName(appStateService.getUserProfile().workspaceName);
    showToast({
      type: 'info',
      title: 'Workspace Reset',
      message: 'Workspace restored to default test fixtures.',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-150">
      <PageHeader
        title="Settings"
        description="Manage your account profile, workspace security, notifications, and execution limits."
      />

      {/* Tabs */}
      <Tabs items={tabs} activeId={activeTab} onChange={setActiveTab} />

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="max-w-xl space-y-6 p-6 rounded-2xl bg-[#111118] border border-[#292936] text-left">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#F4F2FA]">Personal Profile</h3>
            <p className="text-xs text-[#777487]">Your identity across workspace approvals and audit logs.</p>
          </div>

          <div className="space-y-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Role & Permissions"
              value={profile.role}
              disabled
              helperText="Managed by workspace organization policy."
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="sm" type="submit" isLoading={isSaving}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      )}

      {/* Workspace Tab */}
      {activeTab === 'workspace' && (
        <form onSubmit={handleSaveProfile} className="max-w-xl space-y-6 p-6 rounded-2xl bg-[#111118] border border-[#292936] text-left">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#F4F2FA]">Workspace Settings</h3>
            <p className="text-xs text-[#777487]">Organization name, isolation tier, and member policies.</p>
          </div>

          <div className="space-y-4">
            <Input
              label="Workspace Name"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              required
            />
            <div className="p-3.5 rounded-xl bg-[#09090D] border border-[#292936] space-y-1 text-xs">
              <span className="text-[#777487] block text-[11px]">Active Plan:</span>
              <span className="text-[#A78BFA] font-semibold block">Team Pilot · Bounded Execution</span>
              <span className="text-[#A5A2B4] text-[11px] block mt-1">Multi-seat approval workflow active.</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#292936] flex items-center justify-between">
            <Button
              variant="outline"
              size="xs"
              leftIcon={<RotateCcw size={12} />}
              onClick={handleResetWorkspace}
            >
              Reset to Initial Fixtures
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSaving}>
              Update Workspace
            </Button>
          </div>
        </form>
      )}

      {/* Appearance Tab */}
      {activeTab === 'appearance' && (
        <div className="max-w-xl space-y-6 p-6 rounded-2xl bg-[#111118] border border-[#292936] text-left">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#F4F2FA]">Appearance & Theme</h3>
            <p className="text-xs text-[#777487]">Curated palette crafted for high focus and zero visual fatigue.</p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-[#09090D] border border-[#A78BFA] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#F4F2FA]">Obsidian Violet (Default)</div>
                <div className="text-[11px] text-[#777487]">#09090D canvas with restrained #A78BFA accents</div>
              </div>
              <CheckCircle2 size={16} className="text-[#A78BFA]" />
            </div>

            <div className="p-3.5 rounded-xl bg-[#09090D] border border-[#292936] opacity-60 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#F4F2FA]">High-Contrast Monochrome</div>
                <div className="text-[11px] text-[#777487]">Zero tint contrast for terminal environments (Coming Soon)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="max-w-xl space-y-6 p-6 rounded-2xl bg-[#111118] border border-[#292936] text-left">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#F4F2FA]">Notification Preferences</h3>
            <p className="text-xs text-[#777487]">Manage alert routing for pending approval barriers and errors.</p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-[#09090D] border border-[#292936] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#F4F2FA]">Pending Consequential Approval Alerts</div>
                <div className="text-[11px] text-[#777487]">Instant notification when an agent halts for human review</div>
              </div>
              <input
                type="checkbox"
                checked={notifyOnApproval}
                onChange={(e) => setNotifyOnApproval(e.target.checked)}
                className="w-4 h-4 accent-[#A78BFA] cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#09090D] border border-[#292936] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#F4F2FA]">Execution Failure & Rate Limit Alerts</div>
                <div className="text-[11px] text-[#777487]">Notify immediately when an external endpoint returns an error</div>
              </div>
              <input
                type="checkbox"
                checked={notifyOnFailure}
                onChange={(e) => setNotifyOnFailure(e.target.checked)}
                className="w-4 h-4 accent-[#A78BFA] cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#09090D] border border-[#292936] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#F4F2FA]">Weekly Intelligence Summary Email</div>
                <div className="text-[11px] text-[#777487]">Consolidated activity report every Monday morning</div>
              </div>
              <input
                type="checkbox"
                checked={notifyWeeklyDigest}
                onChange={(e) => setNotifyWeeklyDigest(e.target.checked)}
                className="w-4 h-4 accent-[#A78BFA] cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Security & Auth Tab */}
      {activeTab === 'security' && (
        <div className="max-w-xl space-y-6 p-6 rounded-2xl bg-[#111118] border border-[#292936] text-left">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#F4F2FA]">Security & Access Governance</h3>
            <p className="text-xs text-[#777487]">Mandatory 2FA, session timeout, and cryptographic trace policies.</p>
          </div>

          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[#09090D] border border-[#292936] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#F4F2FA]">Two-Factor Authentication (TOTP)</div>
                <div className="text-[11px] text-[#65D6A3]">Enforced for all workspace operators</div>
              </div>
              <span className="text-xs font-mono text-[#65D6A3] bg-[#65D6A3]/10 px-2 py-0.5 rounded">Active</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#09090D] border border-[#292936] space-y-2">
              <div className="text-xs font-semibold text-[#F4F2FA]">Cryptographic Audit Log Retention</div>
              <div className="text-[11px] text-[#777487]">Trace records are signed and retained in immutable storage.</div>
              <select
                value={auditLogRetentionDays}
                onChange={(e) => setAuditLogRetentionDays(e.target.value)}
                className="w-full bg-[#171720] text-[#F4F2FA] text-xs rounded-lg border border-[#292936] p-2 mt-2 cursor-pointer"
              >
                <option value="30">30 Days (Standard Team)</option>
                <option value="90">90 Days (Enterprise Compliance)</option>
                <option value="365">365 Days (Regulatory Archive)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Usage & Limits Tab */}
      {activeTab === 'usage' && (
        <div className="max-w-xl space-y-6 p-6 rounded-2xl bg-[#111118] border border-[#292936] text-left">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#F4F2FA]">Usage & Operational Ceilings</h3>
            <p className="text-xs text-[#777487]">Deterministic limits ensure predictable workloads and bounded costs.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-[#09090D] border border-[#292936] space-y-2">
              <div className="flex justify-between font-medium">
                <span className="text-[#F4F2FA]">Active Specialist Agents</span>
                <span className="font-mono text-[#A78BFA]">4 / 15 configured</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#171720] overflow-hidden">
                <div className="w-[26%] h-full bg-[#A78BFA] rounded-full" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#09090D] border border-[#292936] space-y-2">
              <div className="flex justify-between font-medium">
                <span className="text-[#F4F2FA]">Scheduled Trigger Invocations</span>
                <span className="font-mono text-[#65D6A3]">128 / 5,000 monthly</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#171720] overflow-hidden">
                <div className="w-[3%] h-full bg-[#65D6A3] rounded-full" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#09090D] border border-[#292936] space-y-2">
              <div className="flex justify-between font-medium">
                <span className="text-[#F4F2FA]">Ingested Knowledge Volume</span>
                <span className="font-mono text-[#F4F2FA]">1.8 MB / 50 MB</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#171720] overflow-hidden">
                <div className="w-[4%] h-full bg-[#A78BFA] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
