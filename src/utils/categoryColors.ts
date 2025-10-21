// Centralized category color mapping for all templates
export const categoryColors: Record<string, { bg: string; text: string; badge: string }> = {
  'Strategists': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700'
  },
  'Strategists With Data': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700'
  },
  'Customer Support Heroes': {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-700'
  },
  'Customer Satisfaction Heroes': {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-700'
  },
  'Managers With An Edge': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700'
  },
  'Developers & Launchers': {
    bg: 'bg-green-50',
    text: 'text-green-700',
    badge: 'bg-green-100 text-green-700'
  },
  'Effective Planners': {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    badge: 'bg-indigo-100 text-indigo-700'
  },
  'Planners': {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    badge: 'bg-indigo-100 text-indigo-700'
  },
  'Deployment Artifacts': {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    badge: 'bg-slate-100 text-slate-700'
  },
  'Deployment Fixes': {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    badge: 'bg-slate-100 text-slate-700'
  },
  'Admins': {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    badge: 'bg-orange-100 text-orange-700'
  },
};

export const getCategoryColor = (category: string) => {
  return categoryColors[category] || {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    badge: 'bg-slate-100 text-slate-700'
  };
};

// Get TopNav badge color variant based on category
export const getCategoryBadgeColor = (category: string): 'green' | 'blue' | 'purple' | 'amber' | 'slate' | 'orange' => {
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes('strateg')) return 'amber';
  if (lowerCategory.includes('support') || lowerCategory.includes('satisfaction')) return 'purple';
  if (lowerCategory.includes('manager') || lowerCategory.includes('edge')) return 'blue';
  if (lowerCategory.includes('develop') || lowerCategory.includes('launch')) return 'green';
  if (lowerCategory.includes('admin')) return 'orange';
  if (lowerCategory.includes('plan')) return 'amber'; // Changed from indigo to amber for consistency
  return 'slate';
};
