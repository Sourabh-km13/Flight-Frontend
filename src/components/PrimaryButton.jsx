function PrimaryButton({ children, type = 'button', ...props }) {
  return (
    <button
      type={type}
      className="gradient-button w-full px-5 py-4 text-sm font-black"
      {...props}
    >
      {children}
    </button>
  )
}

export default PrimaryButton
