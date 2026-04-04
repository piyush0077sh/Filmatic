export default function ProfileTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={[
                'rounded-2xl px-4 py-3 text-sm font-semibold transition',
                isActive
                  ? 'bg-white text-slate-950 shadow-lg shadow-black/20'
                  : 'text-film-300 hover:bg-white/5 hover:text-white',
              ].join(' ')}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}