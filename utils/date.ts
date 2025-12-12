/**
 * Formata uma data string para o formato brasileiro (dd/mm/yyyy, hh:mm)
 * @param dateString - String da data no formato ISO ou qualquer formato válido
 * @returns String formatada no padrão brasileiro
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

