// EmptyState component
export default function EmptyState({ icon = 'inbox', title = 'Nothing here', description = 'No items to display.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-3xl text-center">
      <span className="material-symbols-outlined text-outline" style={{ fontSize: '48px' }}>{icon}</span>
      <h3 className="mt-md font-headline-md text-headline-md text-on-surface">{title}</h3>
      <p className="mt-xs font-body-md text-body-md text-secondary max-w-xs">{description}</p>
    </div>
  );
}
