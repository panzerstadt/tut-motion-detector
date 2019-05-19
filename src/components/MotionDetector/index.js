import React, { useRef, useState } from "react";
import { Inspector, useRangeKnob, useBooleanKnob, useLog } from "retoggle";

import Webcam from "../Camera";
import Canvas from "../Canvas";
import useInterval from "../useInterval";

import styles from "./index.module.css";

const MotionDetector = () => {
  // knobs
  const [pixelSize, setPixelSize] = useRangeKnob("Pixel Size", {
    initialValue: 50,
    min: 10,
    max: 200
  });
  const [range, setRange] = useRangeKnob("Range", {
    initialValue: 100,
    min: 1,
    max: 300
  });
  const [isRunning, setIsRunning] = useBooleanKnob("Motion Detect Mode", false);
  useLog("Value", range);
  useLog("Pixel Size", pixelSize);
  useLog("Motion Detection", isRunning);

  // the logic stuff
  const [webcamRef, setWebcamRef] = useState();
  const [ctx, setCtx] = useState();
  const drawPixelated = (e, sampleSize) => {
    function rgb(r, g, b) {
      if (g == undefined) g = r;
      if (b == undefined) b = r;
      return (
        "rgb(" +
        clamp(Math.round(r), 0, 255) +
        ", " +
        clamp(Math.round(g), 0, 255) +
        ", " +
        clamp(Math.round(b), 0, 255) +
        ")"
      );
    }

    function clamp(value, min, max) {
      return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
    }

    const video = e.current.video;
    //const ctx = canvasRef.current.getContext("2d");
    let w = window.innerWidth;
    let h = window.innerHeight;
    w = 640;
    h = 480;

    ctx.canvas.height = h;
    ctx.canvas.width = w;

    ctx.drawImage(video, 0, 0, w, h);

    const data = ctx.getImageData(0, 0, w, h).data;

    for (let y = 0; y < h; y += sampleSize) {
      for (let x = 0; x < w; x += sampleSize) {
        // the data array is a continuous array of red, blue, green
        // and alpha values, so each pixel takes up four values
        // in the array
        var pos = (x + y * w) * 4;

        const r = data[pos];
        const g = data[pos + 1];
        const b = data[pos + 2];

        ctx.fillStyle = rgb(r, g, b);
        ctx.fillRect(x, y, sampleSize, sampleSize);
      }
    }
  };

  useInterval(() => {
    if (webcamRef) {
      requestAnimationFrame(() => drawPixelated(webcamRef, pixelSize));
    }
  }, range);

  return (
    <div>
      <p>Motion detector</p>
      <Inspector usePortal={true} />
      <Canvas className={styles.canvas} onContext={setCtx} mirrored />
      <Webcam onRef={setWebcamRef} hide />
    </div>
  );
};

export default MotionDetector;
