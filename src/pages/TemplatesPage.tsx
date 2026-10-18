import React, { useState, useMemo } from 'react';
import { STARTER_TEMPLATES, MarketplaceTemplate, SetupComplexity } from '../data/templates';
import { TemplateCard } from '../components/marketplace/TemplateCard';
import { FeaturedTemplates } from '../components/marketplace/FeaturedTemplates';
import { SearchField } from '../design-system/SearchField';
import { Button } from '../design-system/Button';
import { EmptyState } from '../design-system/EmptyState';
import { appStateService } from '../services/appStateService';
import { TemplateDetailView } from '../components/marketplace/TemplateDetailView';
import {
  Plus,
  LayoutGrid,
  List,
  Sparkles,
  SlidersHorizontal,
  X,
  Bot,
  Filter,
} from 'lucide-react';

interface TemplatesPageProps {
  onSelectTemplateToCreate: (template: MarketplaceTemplate) => void;
  onViewTemplateDetails?: (template: MarketplaceTemplate) => void;
  onCreateCustomAgent?: () => void;
  onNavigateToAgent?: (agentId: string) => void;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({
  onSelectTemplateToCreate,
  onViewTemplateDetails,
  onCreateCustomAgent,
  onNavigateToAgent,
}) => {
  const [selectedTemplateForDetail, setSelectedTemplateForDetail] = useState<MarketplaceTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'name' | 'category' | 'recent'>('recommended');
  const [complexityFilter, setComplexityFilter] = useState<string>('all');
  const [integrationFilter, setIntegrationFilter] = useState<string>('all');
  const [originFilter, setOriginFilter] = useState<'all' | 'builtin' | 'custom'>('all');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const userAgents = appStateService.getAgents();

  const categories = [
    { id: 'all', label: 'All agents' },
    { id: 'research', label: 'Research' },
    { id: 'development', label: 'Development' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'education', label: 'Education' },
    { id: 'business', label: 'Business' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'operations', label: 'Operations' },
    { id: 'custom', label: 'Custom' },
  ];

  // Calculate live counts for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: STARTER_TEMPLATES.length };
    STARTER_TEMPLATES.forEach((tpl) => {
      counts[tpl.category] = (counts[tpl.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered and sorted templates
  const filteredTemplates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return STARTER_TEMPLATES.filter((tpl) => {
      // Search matching across name, summary, detailed description, category, tags, capabilities, use cases
      const matchesSearch =
        !query ||
        tpl.name.toLowerCase().includes(query) ||
        tpl.summary.toLowerCase().includes(query) ||
        tpl.detailedDescription.toLowerCase().includes(query) ||
        tpl.category.toLowerCase().includes(query) ||
        tpl.categoryLabel.toLowerCase().includes(query) ||
        tpl.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        tpl.capabilities.some(
          (c) => c.name.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)
        ) ||
        tpl.relevantUseCases.some((uc) => uc.toLowerCase().includes(query));

      // Category filter
      const matchesCategory =
        activeCategory === 'all' ||
        tpl.category === activeCategory ||
        (activeCategory === 'development' && tpl.category === 'coding') ||
        (activeCategory === 'education' && tpl.category === 'learning');

      // Complexity filter
      const matchesComplexity = complexityFilter === 'all' || tpl.setupComplexity === complexityFilter;

      // Integration filter
      const matchesIntegration =
        integrationFilter === 'all' ||
        (integrationFilter === 'none' && tpl.requiredIntegrations.length === 0) ||
        (integrationFilter === 'required' && tpl.requiredIntegrations.length > 0);

      // Origin filter (builtin vs custom)
      const matchesOrigin =
        originFilter === 'all' ||
        (originFilter === 'builtin' && !tpl.isCustom) ||
        (originFilter === 'custom' && Boolean(tpl.isCustom));

      return matchesSearch && matchesCategory && matchesComplexity && matchesIntegration && matchesOrigin;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'category') return a.categoryLabel.localeCompare(b.categoryLabel);
      if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return a.curatedRank - b.curatedRank;
    });
  }, [searchQuery, activeCategory, complexityFilter, integrationFilter, originFilter, sortBy]);

  const featuredTemplates = useMemo(() => {
    return STARTER_TEMPLATES.filter((t) => t.featured);
  }, []);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    activeCategory !== 'all' ||
    complexityFilter !== 'all' ||
    integrationFilter !== 'all' ||
    originFilter !== 'all';

  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setComplexityFilter('all');
    setIntegrationFilter('all');
    setOriginFilter('all');
    setSortBy('recommended');
  };

  const handleViewDetails = (template: MarketplaceTemplate) => {
    if (onViewTemplateDetails) {
      onViewTemplateDetails(template);
    } else {
      setSelectedTemplateForDetail(template);
    }
  };

  const handleCreateCustom = () => {
    if (onCreateCustomAgent) {
      onCreateCustomAgent();
    } else {
      onSelectTemplateToCreate(null as any);
    }
  };

  if (selectedTemplateForDetail) {
    return (
      <TemplateDetailView
        template={selectedTemplateForDetail}
        onBack={() => setSelectedTemplateForDetail(null)}
        onUseTemplate={(template) => {
          setSelectedTemplateForDetail(null);
          onSelectTemplateToCreate(template);
        }}
        onViewMyAgent={onNavigateToAgent}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-150 text-left">
      {/* 4.1 Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#292936]/60">
        <div className="space-y-1">
          <div className="text-[11px] font-mono tracking-wider uppercase text-[#A78BFA] font-semibold">
            CORE LIBRARY
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F2FA]">
            Find your next AI agent.
          </h1>
          <p className="text-xs sm:text-sm text-[#A5A2B4] max-w-2xl leading-relaxed">
            Discover specialized agents for research, development, learning, operations, and the work only you can define.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus size={14} />}
          onClick={handleCreateCustom}
        >
          Create custom agent
        </Button>
      </div>

      {/* 4.4 Featured Collection (Shown when browsing all or when no search is active) */}
      {!hasActiveFilters && (
        <FeaturedTemplates
          featuredTemplates={featuredTemplates}
          userAgents={userAgents}
          onViewDetails={handleViewDetails}
          onUseTemplate={onSelectTemplateToCreate}
        />
      )}

      {/* Discovery Controls Bar */}
      <div className="space-y-4">
        {/* 4.2 Search & Additional Filter Trigger */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1">
            <SearchField
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search agents, capabilities, or use cases..."
              shortcut="/"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={showAdvancedFilters ? 'secondary' : 'outline'}
              size="sm"
              leftIcon={<SlidersHorizontal size={13} />}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <span>Filters</span>
              {(complexityFilter !== 'all' || integrationFilter !== 'all' || originFilter !== 'all') && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]" />
              )}
            </Button>

            {/* 4.5 Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#111827] text-[#F4F7FC] text-xs rounded-xl border border-slate-700/60 px-3 py-2.5 focus:outline-none focus:border-[#38D9FF] focus:ring-1 focus:ring-[#38D9FF] cursor-pointer"
            >
              <option value="recommended">Curated Rank</option>
              <option value="name">Name: A–Z</option>
              <option value="category">Category</option>
              <option value="recent">Recently Added</option>
            </select>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center p-1 bg-[#111827] border border-slate-800/80 rounded-xl">
              <button
                type="button"
                onClick={() => setLayout('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  layout === 'grid' ? 'bg-[#151D2E] text-[#38D9FF] shadow-xs' : 'text-[#64748B] hover:text-[#F4F7FC]'
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setLayout('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  layout === 'list' ? 'bg-[#151D2E] text-[#38D9FF] shadow-xs' : 'text-[#64748B] hover:text-[#F4F7FC]'
                }`}
                aria-label="List view"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* 4.3 Category Navigation Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#38D9FF]/15 text-[#38D9FF] font-semibold border border-[#38D9FF]/40'
                    : 'bg-[#0D1220] text-[#9AA7BC] hover:text-[#F4F7FC] border border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-[#38D9FF]/20 text-[#38D9FF]' : 'bg-[#111827] text-[#64748B]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 4.6 Collapsible Advanced Filter Drawer */}
        {showAdvancedFilters && (
          <div className="p-4 rounded-2xl bg-[#0D1220]/95 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in-0 duration-100">
            <div>
              <label className="block text-[11px] font-medium text-[#64748B] mb-1 font-mono">
                Setup Complexity
              </label>
              <select
                value={complexityFilter}
                onChange={(e) => setComplexityFilter(e.target.value)}
                className="w-full bg-[#111827] text-[#F4F7FC] text-xs rounded-xl border border-slate-700/60 p-2 focus:outline-none focus:border-[#38D9FF]"
              >
                <option value="all">All Complexities</option>
                <option value="Minimal">Minimal (&lt;1 min)</option>
                <option value="Standard">Standard</option>
                <option value="Advanced">Advanced Setup</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#64748B] mb-1 font-mono">
                Integration Requirements
              </label>
              <select
                value={integrationFilter}
                onChange={(e) => setIntegrationFilter(e.target.value)}
                className="w-full bg-[#111827] text-[#F4F7FC] text-xs rounded-xl border border-slate-700/60 p-2 focus:outline-none focus:border-[#38D9FF]"
              >
                <option value="all">All Integration Types</option>
                <option value="none">Zero External OAuth Required</option>
                <option value="required">External Integration Required</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#64748B] mb-1 font-mono">
                Template Origin
              </label>
              <select
                value={originFilter}
                onChange={(e) => setOriginFilter(e.target.value as any)}
                className="w-full bg-[#111827] text-[#F4F7FC] text-xs rounded-xl border border-slate-700/60 p-2 focus:outline-none focus:border-[#38D9FF]"
              >
                <option value="all">All Blueprints</option>
                <option value="builtin">Curated Built-in</option>
                <option value="custom">Custom Scratch Templates</option>
              </select>
            </div>
          </div>
        )}

        {/* 4.7 Results Header Bar */}
        <div className="flex items-center justify-between text-xs text-[#777487] pt-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#F4F2FA]">
              {filteredTemplates.length} {filteredTemplates.length === 1 ? 'agent blueprint' : 'agent blueprints'}
            </span>
            {hasActiveFilters && (
              <>
                <span>·</span>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-[#A78BFA] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <X size={12} />
                  <span>Clear active filters</span>
                </button>
              </>
            )}
          </div>

          <div className="hidden sm:block text-[11px] font-mono">
            Category: {activeCategory === 'all' ? 'All' : activeCategory}
          </div>
        </div>
      </div>

      {/* 4.8 Template Grid / List or Empty Search Results State */}
      {filteredTemplates.length === 0 ? (
        <EmptyState
          icon={<Bot size={24} />}
          title="No agents match your search."
          description={`We couldn't find any specialist agent templates matching "${searchQuery}" with the selected filters.`}
          primaryAction={{
            label: 'Create custom agent',
            onClick: handleCreateCustom,
            icon: <Plus size={14} />,
          }}
          secondaryAction={{
            label: 'Reset all filters',
            onClick: handleClearFilters,
          }}
        />
      ) : (
        <div
          className={
            layout === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
              : 'space-y-3'
          }
        >
          {filteredTemplates.map((template) => {
            const addedAgents = userAgents.filter((a) => a.sourceTemplateId === template.id);
            const isAdded = addedAgents.length > 0;

            return (
              <TemplateCard
                key={template.id}
                template={template}
                layout={layout}
                isAlreadyAdded={isAdded}
                addedCount={addedAgents.length}
                onViewDetails={handleViewDetails}
                onUseTemplate={onSelectTemplateToCreate}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
