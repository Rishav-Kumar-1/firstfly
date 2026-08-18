// Loading.tsx
// A reusable loading spinner shown while API requests are in progress.
// Prevents the page from looking broken while data loads.

interface LoadingProps {
  message?: string;   // Optional custom message
  fullScreen?: boolean; // Cover the whole screen or just inline
}

export default function Loading({ message = 'Loading...', fullScreen = false }: LoadingProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500">{message}</p>
    </div>
  );
}
