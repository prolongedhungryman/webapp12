export const CAMP_CLASSES = ['Class 6', 'Class 7', 'Class 8', 'Class 9'] as const;
export const CAMP_SECTIONS = ['Orange', 'Pink', 'Red', 'Purple', 'Blue', 'Green', 'Yellow'] as const;

export type CampClass = (typeof CAMP_CLASSES)[number];
export type CampSection = (typeof CAMP_SECTIONS)[number];

export const DEFAULT_CAMP_CLASS: CampClass = 'Class 6';
export const DEFAULT_CAMP_SECTION: CampSection = 'Orange';

export const addDays = (isoDate: string, days: number): string => {
  const d = new Date(`${isoDate}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};
