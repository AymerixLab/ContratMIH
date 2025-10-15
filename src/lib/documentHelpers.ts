export function generateStandTypeName(standType: string): string {
  const names = {
    'equipped': 'STAND ÉQUIPÉ',
    'ready': 'PRÊT À EXPOSER',
    'bare': 'STAND NU'
  };
  return names[standType as keyof typeof names] || '';
}