interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export function Loading({ 
  message = 'Carregando...', 
  size = 'md',
  fullScreen = false 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 border-2',
    md: 'h-12 w-12 border-4',
    lg: 'h-16 w-16 border-4',
  };

  const containerClasses = fullScreen
    ? 'min-h-screen flex items-center justify-center bg-gray-50'
    : 'text-center py-20';

  return (
    <div className={containerClasses}>
      <div className={`animate-spin rounded-full border-[#0052A5] border-t-transparent mx-auto ${sizeClasses[size]}`}></div>
      <p className="mt-6 text-gray-600 font-medium">{message}</p>
    </div>
  );
}

