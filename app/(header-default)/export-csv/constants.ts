export const EFFECTIF_STEPS = [
  { value: 0, label: '0 salarié', code: '00' },
  { value: 1, label: '1 ou 2 salariés', code: '01' },
  { value: 2, label: '3 à 5 salariés', code: '02' },
  { value: 3, label: '6 à 9 salariés', code: '03' },
  { value: 4, label: '10 à 19 salariés', code: '11' },
  { value: 5, label: '20 à 49 salariés', code: '12' },
  { value: 6, label: '50 à 99 salariés', code: '21' },
  { value: 7, label: '100 à 199 salariés', code: '22' },
  { value: 8, label: '200 à 249 salariés', code: '31' },
  { value: 9, label: '250 à 499 salariés', code: '32' },
  { value: 10, label: '500 à 999 salariés', code: '41' },
  { value: 11, label: '1 000 à 1 999 salariés', code: '42' },
  { value: 12, label: '2 000 à 4 999 salariés', code: '51' },
  { value: 13, label: '5 000 à 9 999 salariés', code: '52' },
  { value: 14, label: '10 000 salariés et plus', code: '53' },
];

export const getEffectifLabel = (value: number) => {
  return EFFECTIF_STEPS[value]?.label || '';
};

export const getEffectifCode = (value: number) => {
  return EFFECTIF_STEPS[value]?.code || '00';
};
