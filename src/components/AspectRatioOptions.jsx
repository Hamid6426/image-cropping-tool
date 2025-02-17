const AspectRatioOptions = ({ options, onSelect }) => {
  return (
    <div className="flex gap-4">
      {options.map((option) => (
        <button
          key={option.value}
          className="p-1 bg-blue-500 hover:bg-blue-700 text-white transition-all rounded-md"
          onClick={() => onSelect(option.value)}
        >
          <div className="relative group">
            <div className="">{option.icon}</div>
            <div className="bottom-4 group-hover:flex absolute hidden bg-white border border-black text-black px-2 py-1 z-5">{option.label}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default AspectRatioOptions;
