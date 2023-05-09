"use client";
import React, { useState } from "react";
import Input from "../components/Input";
import Buttons from "../components/Buttons";
import "./style.css";

export default function App() {
  const [state, setState] = useState({
    attributes: [
      {
        trait_type: "",
        traits: [
          {
            img: "",
            value: "",
            rarity: "",
          },
        ],
      },
    ],
    supply: "10000",
  });

  return (
    <div>
      <nav id="navbar">
        <div class="mixer">
          <h2>MIXER</h2>
        </div>
      </nav>
      <div class="big-container">
        <Input state={state} setState={setState} />
        <Buttons state={state} setState={setState} />
      </div>
    </div>
  );
}
