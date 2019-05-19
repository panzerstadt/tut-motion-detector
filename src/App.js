import React from "react";
import logo from "./logo.svg";
import "./App.css";

import MotionDetector from "./components/MotionDetector";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <MotionDetector />
      </header>
    </div>
  );
}

export default App;
