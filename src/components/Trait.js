import React from "react";
import Dropzone from "./Dropzone";

function Trait(props) {
  const { state, setState, typeIndex, traitIndex } = props;

  function updateValue(event) {
    const stateObject = { ...state };
    stateObject.attributes[typeIndex].traits[traitIndex].value =
      event.target.value;
    return setState(stateObject);
  }

  function updateRarity(event) {
    const stateObject = { ...state };
    stateObject.attributes[typeIndex].traits[traitIndex].rarity =
      event.target.value;
    return setState(stateObject);
  }

  function removeTrait() {
    const stateObject = { ...state };
    stateObject.attributes[typeIndex].traits.splice(traitIndex, 1);
    return setState(stateObject);
  }

  return (
    <div className="traits" key={traitIndex}>
      <div className="traitinputs">
        <div>
          <Dropzone
            key={traitIndex}
            state={state}
            setState={setState}
            typeIndex={typeIndex}
            traitIndex={traitIndex}
          />
        </div>
        <div className="removetrait">
          <button
            name="removetrait"
            className="removebtn"
            onClick={removeTrait}
          >
            ✕
          </button>
        </div>
        <div>
          <input
            className="textinput"
            value={state.attributes[typeIndex].traits[traitIndex].value}
            onChange={updateValue}
            placeholder="Trait Value"
          />
        </div>
        <div>
          <input
            type="number"
            className="textinput"
            value={state.attributes[typeIndex].traits[traitIndex].rarity}
            onChange={updateRarity}
            placeholder="Trait Rarity %"
          />
        </div>
      </div>
    </div>
  );
}

export default Trait;
