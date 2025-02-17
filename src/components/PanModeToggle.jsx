import { FaHandPaper } from "react-icons/fa";

const PanModeToggle = ({ isPanning, togglePanMode }) => {
  return (
    <button className="p-2 bg-blue-500" onClick={togglePanMode}>
      {isPanning ? (
        <FaHandPaper className="text-2xl text-red-500" />
      ) : (
        <FaHandPaper className="text-2xl text-white" />
      )}
    </button>
  );
};

export default PanModeToggle;
