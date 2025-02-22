import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader"></div>
      <p className="loading-text">Processing Audio...</p>
    </div>
  );
};

export default Loader;
