function InputField({ label, type = 'text', name, value, onChange, placeholder }) {
  return (
    <label className="block text-sm text-slate-700">
      <span className="mb-3 block text-sm font-bold text-slate-800">{label}</span>
      <input
        className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-slate-950 shadow-sm shadow-slate-200/60 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />
    </label>
  )
}

export default InputField
