function CitySearchInput({ label, value, selectedOption, options, placeholder, onChange, onSelect }) {
  const query = value.trim().toLowerCase()
  const matches = query
    ? options
        .filter((option) =>
          [option.label, option.cityName, option.airportName, option.code]
            .filter(Boolean)
            .some((field) => field.toLowerCase().includes(query)),
        )
        .slice(0, 6)
    : options.slice(0, 6)

  return (
    <label className="relative block">
      <span className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="mt-3 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-lg font-black text-white outline-none placeholder:text-slate-500 focus:border-sky-300"
      />
      {selectedOption ? (
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-sky-200">{selectedOption.code}</p>
      ) : null}
      {value && !selectedOption && matches.length > 0 ? (
        <div className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 p-2 shadow-2xl shadow-slate-950/40">
          {matches.map((option) => (
            <button
              key={`${option.code}-${option.label}`}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault()
                onSelect(option)
              }}
              className="block w-full rounded-xl px-3 py-3 text-left transition hover:bg-white/10"
            >
              <span className="block text-sm font-black text-white">{option.label}</span>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{option.code}</span>
            </button>
          ))}
        </div>
      ) : null}
    </label>
  )
}

export default CitySearchInput
