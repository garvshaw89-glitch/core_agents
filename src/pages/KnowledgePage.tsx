import React, { useState, useEffect } from 'react';
import { PageHeader } from '../design-system/PageHeader';
import { Button } from '../design-system/Button';
import { SearchField } from '../design-system/SearchField';
import { StatusBadge } from '../design-system/StatusBadge';
import { EmptyState } from '../design-system/EmptyState';
import { ConfirmationDialog } from '../design-system/ConfirmationDialog';
import { Dialog } from '../design-system/Dialog';
import { Input } from '../design-system/Input';
import { useToast } from '../design-system/Toast';
import { appStateService } from '../services/appStateService';
import { KnowledgeItem, KnowledgeType } from '../types/app';
import {
  Upload,
  FileText,
  FileCode,
  Link,
  Trash2,
  ExternalLink,
  Search,
  CheckCircle2,
  Loader2,
  Database,
} from 'lucide-react';

export const KnowledgePage: React.FC = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [itemToDelete, setItemToDelete] = useState<KnowledgeItem | null>(null);

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadType, setUploadType] = useState<KnowledgeType>('document');
  const [uploadUrl, setUploadUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const loadData = () => {
    setItems(appStateService.getKnowledge());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.sourceUrl && item.sourceUrl.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      appStateService.deleteKnowledge(itemToDelete.id);
      showToast({
        type: 'info',
        title: 'Document Removed',
        message: `${itemToDelete.name} was removed from the agent knowledge base.`,
      });
      setItemToDelete(null);
      loadData();
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName.trim()) return;

    setIsUploading(true);

    // Simulate multi-stage document parsing & indexing
    setTimeout(() => {
      const newItem: KnowledgeItem = {
        id: `k-${Math.random().toString(36).substring(2, 9)}`,
        name: uploadName.trim(),
        type: uploadType,
        sizeBytes: 154000,
        status: 'ready',
        updatedAt: new Date().toISOString(),
        sourceUrl: uploadType === 'source' ? uploadUrl : undefined,
        tokensCount: 3420,
      };

      appStateService.addKnowledge(newItem);
      setIsUploading(false);
      setIsUploadOpen(false);
      setUploadName('');
      setUploadUrl('');
      loadData();

      showToast({
        type: 'success',
        title: 'Source Ingested',
        message: `${newItem.name} indexed and ready for agent retrieval.`,
      });
    }, 800);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
    return `${Math.round(bytes / 1000)} KB`;
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-150">
      <PageHeader
        title="Knowledge"
        description="Curated documents, reference notes, and verified data sources available for bounded agent context."
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Upload size={14} />}
            onClick={() => setIsUploadOpen(true)}
          >
            Add source
          </Button>
        }
      />

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchField
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            placeholder="Search documents, notes, or source URLs..."
          />
        </div>

        <div className="w-36">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-[#111827] text-[#F4F7FC] text-xs rounded-xl border border-slate-700/60 px-3 py-2 focus:outline-none focus:border-[#38D9FF] focus:ring-1 focus:ring-[#38D9FF] cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="document">Documents</option>
            <option value="source">Data Sources</option>
            <option value="note">Notes</option>
          </select>
        </div>
      </div>

      {/* Knowledge Item Table / List */}
      {items.length === 0 ? (
        <EmptyState
          icon={<Database size={24} />}
          title="No knowledge sources connected"
          description="Upload architectural documents, API notes, or URL manifests to provide bounded grounding for your agents."
          primaryAction={{
            label: 'Add first knowledge source',
            onClick: () => setIsUploadOpen(true),
            icon: <Upload size={14} />,
          }}
        />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title="No matching knowledge items"
          description={`No sources match "${searchQuery}".`}
          secondaryAction={{
            label: 'Clear search',
            onClick: () => setSearchQuery(''),
          }}
        />
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-[#0D1220]/90 border border-slate-800/70 hover:border-[#38D9FF]/40 hover:bg-[#111827] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#151D2E] border border-slate-700/60 text-[#38D9FF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {item.type === 'document' ? (
                    <FileText size={18} />
                  ) : item.type === 'source' ? (
                    <Link size={18} />
                  ) : (
                    <FileCode size={18} />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[#F4F7FC] truncate group-hover:text-white">{item.name}</h3>
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#64748B] mt-0.5">
                    <span>{formatFileSize(item.sizeBytes)}</span>
                    {item.tokensCount && <span>· ~{item.tokensCount.toLocaleString()} tokens</span>}
                    {item.sourceUrl && (
                      <span className="truncate max-w-xs font-mono text-[11px] text-[#9AA7BC]">
                        · {item.sourceUrl}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                <span className="text-[11px] text-[#64748B] font-mono">
                  {new Date(item.updatedAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <Button
                  variant="outline"
                  size="xs"
                  leftIcon={<Trash2 size={12} />}
                  onClick={() => setItemToDelete(item)}
                  className="hover:text-[#FB7185] hover:border-[#FB7185]/40"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload / Ingest Modal */}
      <Dialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Add Knowledge Source"
        description="Provide structured documents or public URLs for bounded agent retrieval."
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#A5A2B4]">Source Category</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setUploadType('document')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                  uploadType === 'document'
                    ? 'bg-[#171720] border-[#A78BFA] text-[#F4F2FA]'
                    : 'bg-[#09090D] border-[#292936] text-[#777487]'
                }`}
              >
                <FileText size={14} className="mb-1 text-[#A78BFA]" />
                <div className="font-semibold">Document</div>
                <div className="text-[10px]">PDF, Markdown</div>
              </button>
              <button
                type="button"
                onClick={() => setUploadType('source')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                  uploadType === 'source'
                    ? 'bg-[#171720] border-[#A78BFA] text-[#F4F2FA]'
                    : 'bg-[#09090D] border-[#292936] text-[#777487]'
                }`}
              >
                <Link size={14} className="mb-1 text-[#65D6A3]" />
                <div className="font-semibold">Public URL</div>
                <div className="text-[10px]">Changelog, Feed</div>
              </button>
              <button
                type="button"
                onClick={() => setUploadType('note')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                  uploadType === 'note'
                    ? 'bg-[#171720] border-[#A78BFA] text-[#F4F2FA]'
                    : 'bg-[#09090D] border-[#292936] text-[#777487]'
                }`}
              >
                <FileCode size={14} className="mb-1 text-[#F2C879]" />
                <div className="font-semibold">Project Note</div>
                <div className="text-[10px]">Instructions</div>
              </button>
            </div>
          </div>

          <Input
            label="Source Identifier / Name"
            placeholder="e.g. competitor-pricing-structure-q4.md"
            value={uploadName}
            onChange={(e) => setUploadName(e.target.value)}
            required
          />

          {uploadType === 'source' && (
            <Input
              label="Public Source URL"
              placeholder="https://example.com/changelog.json"
              value={uploadUrl}
              onChange={(e) => setUploadUrl(e.target.value)}
              required
            />
          )}

          <div className="p-3 bg-[#09090D] rounded-xl border border-[#292936] text-[11px] text-[#777487] flex items-center gap-2">
            <CheckCircle2 size={13} className="text-[#65D6A3]" />
            <span>Parsed locally and assigned token chunks prior to indexing.</span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isUploading}>
              Index Source
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Knowledge Source?"
        message={`Are you sure you want to remove "${itemToDelete?.name}"? Agents referencing this document will no longer have access to its retrieval chunks.`}
        confirmLabel="Delete Source"
        variant="danger"
      />
    </div>
  );
};
