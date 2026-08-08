const Input = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-secondary">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`
          w-full rounded-lg border border-gray-300
          px-4 py-3 outline-none
          transition-all duration-300
          focus:border-primary
          focus:ring-2 focus:ring-primary/20
          ${className}
        `}
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;