export const sizeOptionsFormSchema = [
  { label: '长', value: 'length' },
  { label: '宽', value: 'width' },
  { label: '高', value: 'height' },
];
export const flexibleSizeOptionFormSchema = [
  { label: '长', value: 'length' },
  { label: '宽', value: 'width' },
  { label: '深', value: 'height' },
];
export const sizeUnitMap = {
  1: 'mm',
  2: 'cm',
  3: 'dm',
  4: 'm',
};
export enum PackagingType {
  CONVENTIONAL_PAPER_PACKAGING = 1,
  FLEXIBLE_PACKAGING = 2,
  PUBLIC_PACKAGING = 3,
}
