function Button({ children, variant = 'primary', type = 'button', ...props }) {
  const className = `auth-button ${variant}`

  return (
    <button type={type} className={className} {...props}>
      {children}
    </button>
  )
}

export default Button
