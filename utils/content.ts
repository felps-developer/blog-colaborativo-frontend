/**
 * Converte HTML para o formato JSON esperado pelo backend
 * @param html - String HTML do editor
 * @returns Objeto JSON no formato esperado pelo backend
 */
export function convertHtmlToJson(html: string): { version: string; content: string } {
  return {
    version: '1.0',
    content: html,
  };
}

/**
 * Extrai HTML do formato JSON retornado pelo backend
 * @param content - Conteúdo do backend (pode ser string JSON, objeto ou HTML direto)
 * @returns String HTML para exibição no editor
 */
export function extractHtmlFromJson(content: string | object): string {
  if (typeof content === 'string') {
    try {
      // Tenta fazer parse se for uma string JSON
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === 'object' && 'content' in parsed) {
        return parsed.content as string;
      }
      // Se não conseguir fazer parse ou não tiver a estrutura esperada, retorna como está
      return content;
    } catch {
      // Se não for JSON válido, retorna como está (pode ser HTML direto)
      return content;
    }
  } else if (content && typeof content === 'object' && 'content' in content) {
    return (content as { content: string }).content;
  }
  return '';
}

