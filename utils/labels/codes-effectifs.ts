export const codesEffectifsOptions = [
  {
    label:
      "Unité non employeuse (pas de salarié au cours de l'année de référence et pas d'effectif au 31/12)",
    value: 'NN',
  },
  {
    label:
      "0 salarié (n'ayant pas d'effectif au 31/12 mais ayant employé des salariés au cours de l'année de référence)",
    value: '00',
  },
  { label: '1 ou 2 salariés', value: '01' },
  { label: '3 à 5 salariés', value: '02' },
  { label: '6 à 9 salariés', value: '03' },
  { label: '10 à 19 salariés', value: '11' },
  { label: '20 à 49 salariés', value: '12' },
  { label: '50 à 99 salariés', value: '21' },
  { label: '100 à 199 salariés', value: '22' },
  { label: '200 à 249 salariés', value: '31' },
  { label: '250 à 499 salariés', value: '32' },
  { label: '500 à 999 salariés', value: '41' },
  { label: '1 000 à 1 999 salariés', value: '42' },
  { label: '2 000 à 4 999 salariés', value: '51' },
  { label: '5 000 à 9 999 salariés', value: '52' },
  { label: '10 000 salariés et plus', value: '53' },
];

const formatAsMap = () => {
  return codesEffectifsOptions.reduce((aggregator, code) => {
    //@ts-ignore
    aggregator[code.value] = code.label;
    return aggregator;
  }, {});
};

export const codesEffectifs = formatAsMap();
