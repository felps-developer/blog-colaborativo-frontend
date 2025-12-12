/**
 * Exibe um diálogo de confirmação e retorna uma Promise
 * @param message - Mensagem a ser exibida no diálogo
 * @returns Promise que resolve para true se confirmado, false caso contrário
 */
export function confirmAction(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const result = window.confirm(message);
    resolve(result);
  });
}

/**
 * Confirmação padrão para exclusão de posts
 * @returns Promise que resolve para true se confirmado, false caso contrário
 */
export function confirmDeletePost(): Promise<boolean> {
  return confirmAction('Tem certeza que deseja excluir este post?');
}

