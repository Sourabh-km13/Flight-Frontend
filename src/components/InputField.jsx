function InputField({ label, type = 'text', name, value, onChange, placeholder }) {
  return (
    <label className="block text-sm text-slate-300">
      <span className="mb-3 block text-sm font-semibold text-slate-200">{label}</span>
      <input
        className="w-full rounded-[1.5rem] border border-slate-700 bg-slate-950/90 px-4 py-4 text-white shadow-sm shadow-slate-950/20 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </label>
  )
}

export default InputField
