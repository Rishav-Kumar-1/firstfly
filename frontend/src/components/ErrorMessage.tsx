// ErrorMessage.tsx
// Displays user-friendly error messages across the app.
// Never shows raw server errors to users.

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void; // Optional retry button
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-5xl mb-4">⚠️</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h3>
      <p className="text-gray-500 text-center max-w-md mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
