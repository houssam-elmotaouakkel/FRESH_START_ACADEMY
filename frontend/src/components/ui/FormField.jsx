const FormField = ({ label, required, error, hint, htmlFor, children }) => {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-gray-700">
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </label>
      {children}
      {hint ? <p className="mt-2 text-xs text-gray-500">{hint}</p> : null}
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
};

export default FormField;
