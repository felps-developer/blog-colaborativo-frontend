'use client';

import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-4 pt-8 border-t border-gray-200">
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Anterior
      </Button>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">
          Página
        </span>
        <span className="px-3 py-1 bg-[#0052A5] text-white rounded-md font-semibold text-sm">
          {currentPage}
        </span>
        <span className="text-sm font-medium text-gray-700">
          de {totalPages}
        </span>
      </div>
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Próxima
      </Button>
    </div>
  );
}

