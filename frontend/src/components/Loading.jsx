// Loading spinner component
export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-3xl">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-md font-body-sm text-body-sm text-secondary">{message}</p>
    </div>
  );
}
