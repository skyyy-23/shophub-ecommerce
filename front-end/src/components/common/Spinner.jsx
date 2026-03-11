function Spinner({ sizeClass = "h-4 w-4", className = "" }) {
  return (
    <span
      className={`inline-block ${sizeClass} animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      aria-hidden="true"
    />
  );
}

export default Spinner;