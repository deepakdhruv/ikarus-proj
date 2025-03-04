import PropTypes from "prop-types";
import { saveToFirebase, loadFromFirebase } from "../firebaseConfig";

const UIControls = ({ planets, setPlanets }) => {
  const handleSave = () => {
    if (!planets || planets.length === 0) {
      console.warn("No planets to save!");
      return;
    }
    saveToFirebase(planets);
  };

  const handleLoad = async () => {
    const savedConfigs = await loadFromFirebase();
    if (savedConfigs.length > 0 && savedConfigs[0].planets) {
      setPlanets(savedConfigs[0].planets);
    } else {
      console.warn("No saved configurations found.");
    }
  };

  return (
    <div>
      <button onClick={handleSave}>Save to Firebase</button>
      <button onClick={handleLoad}>Load from Firebase</button>
    </div>
  );
};

// ✅ Add PropTypes validation
UIControls.propTypes = {
  planets: PropTypes.array.isRequired,
  setPlanets: PropTypes.func.isRequired,
};

export default UIControls;
