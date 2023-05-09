import React from "react";

function Supply(props) {
  const { state, setState } = props;

  function updateSupply(event) {
    return setState({
      ...state,
      supply: event.target.value,
    });
  }

  return (
    <div id="input-supply">
      Choose your collection's supply:
      <div>
        <input
          type="number"
          className="textinput"
          value={state.supply}
          onChange={updateSupply}
          placeholder="Enter Supply"
        />
      </div>
    </div>
  );
}

export default Supply;
