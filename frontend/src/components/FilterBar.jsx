// FilterBar: row of filter controls (dropdowns + icon buttons)
export default function FilterBar({ filters = [], onFilter }) {
  return (
    <div className="flex flex-wrap items-center gap-sm">
      {filters.map((f) => (
        <div key={f.name} className="relative">
          <select
            className="appearance-none bg-surface border border-outline-variant rounded pl-sm pr-lg py-xs font-label-md text-label-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary h-8"
            value={f.value !== undefined ? f.value : f.defaultValue}
            onChange={(e) => f.onChange && f.onChange(e.target.value)}
          >
            {f.options.map((opt) => (
              <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-[16px] text-secondary pointer-events-none">
            arrow_drop_down
          </span>
        </div>
      ))}
      <button className="bg-surface border border-outline-variant text-secondary p-xs rounded hover:bg-surface-container transition-colors h-8 w-8 flex items-center justify-center" title="More filters">
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>filter_list</span>
      </button>
    </div>
  );
}
