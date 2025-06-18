const Tooltip = ({ message, show, position = "right" }) => {
  if (!show) return null;

  const positionClasses = {
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  };

  return (
    <div
      className={`absolute z-50 px-3 py-1 bg-[#C88000] text-white font-bold text-sm rounded shadow-lg whitespace-nowrap ${positionClasses[position]}`}
      style={{ pointerEvents: "none" }}
    >
      {message}
    </div>
  );
};

export default Tooltip;
