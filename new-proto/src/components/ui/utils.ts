/**
 * Utility function to merge classNames (similar to clsx or cn from shadcn/ui)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

