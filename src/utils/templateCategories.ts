/**
 * Central source of truth for template categories
 * Used consistently across all pages and components
 */

export type CategoryColor = 'green' | 'blue' | 'purple' | 'amber' | 'slate' | 'orange';

export interface TemplateCategory {
  name: string;
  color: CategoryColor;
}

// Standard template categories - use these everywhere
export const TEMPLATE_CATEGORIES: Record<string, TemplateCategory> = {
  STRATEGISTS: {
    name: 'Strategists',
    color: 'amber',
  },
  CUSTOMER_SUPPORT: {
    name: 'Customer Support Heroes',
    color: 'purple',
  },
  DEVELOPERS: {
    name: 'Developers & Launchers',
    color: 'green',
  },
  PLANNERS: {
    name: 'Planners',
    color: 'blue',
  },
  MANAGERS: {
    name: 'Managers',
    color: 'slate',
  },
  ADMINS: {
    name: 'Admins',
    color: 'orange',
  },
} as const;

// Helper to get category by name (case-insensitive)
export const getCategoryByName = (name: string): TemplateCategory | undefined => {
  const key = Object.keys(TEMPLATE_CATEGORIES).find(
    k => TEMPLATE_CATEGORIES[k as keyof typeof TEMPLATE_CATEGORIES].name.toLowerCase() === name.toLowerCase()
  );
  return key ? TEMPLATE_CATEGORIES[key as keyof typeof TEMPLATE_CATEGORIES] : undefined;
};
