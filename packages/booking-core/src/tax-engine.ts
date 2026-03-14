import type { TaxComputationResult, TaxRuleInput } from './types.js';

export const calculateTaxes = (subtotal: number, taxRules: TaxRuleInput[]): TaxComputationResult => {
  const taxLines = taxRules
    .filter((rule) => rule.active)
    .map((rule) => {
      const amount = rule.type === 'percent' ? (subtotal * rule.value) / 100 : rule.value;
      return {
        name: rule.name,
        amount
      };
    });

  return {
    taxLines,
    taxesTotal: taxLines.reduce((sum, line) => sum + line.amount, 0)
  };
};
