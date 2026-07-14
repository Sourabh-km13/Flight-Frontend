function PrimaryButton({ children, type = 'button', ...props }) {
  return (
    <button
      type={type}
      className="inline-flex w-full justify-center rounded-[1.75rem] bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-500 px-5 py-4 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      {...props}
    >
      {children}
    </button>
  )
}

export default PrimaryButton
