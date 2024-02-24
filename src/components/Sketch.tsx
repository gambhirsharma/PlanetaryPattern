import space from "../assets/stars-1654074_1920.jpg";
// import sun from '../assets/';
// import earth from '../assets/';
// import mars from '../assets/';

import "./Sketch.css";
import { useEffect, useRef } from "react";
import p5 from "p5";

function Sketch() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  let sunX, sunY; // Position of the sun
  const earthRadius = 150; // Radius of Earth's orbit
  const marsRadius = 250; // Radius of Mars' orbit
  let lineHistory = []; // Array to store the positions of the line
  let lastTime = 0; // Variable to track the last time the line was drawn
  const p5Ref = useRef(null);

  useEffect(() => {
    const sketch = new p5((p) => {
      let bg;

      p.preload = () => {
        bg = p.loadImage(space);
      };

      p.setup = () => {
        p.createCanvas(windowWidth, windowHeight -100);
        sunX = p.width / 2;
        sunY = p.height / 2;
      };

      p.draw = () => {
        // p.image(bg, 0, 0, windowWidth, windowHeight);
        p.image(bg, 0, 0, p.width, p.height);

        // Draw the lines from history
        for (let i = 0; i < lineHistory.length; i++) {
          let linePos = lineHistory[i];
          p.stroke(250);
          p.strokeWeight(0.3);
          p.line(linePos.x1, linePos.y1, linePos.x2, linePos.y2);
        }

        // Calculate the positions of Earth and Mars
        let earthX = sunX + p.cos(p.frameCount * 0.1) * earthRadius;
        let earthY = sunY + p.sin(p.frameCount * 0.1) * earthRadius;
        let marsX = sunX + p.cos(p.frameCount * 0.08) * marsRadius;
        let marsY = sunY + p.sin(p.frameCount * 0.08) * marsRadius;

        // Draw the sun
        p.fill(255, 255, 0);
        p.ellipse(sunX, sunY, 50, 50);

        // Draw Earth's path
        p.noFill();
        p.stroke(255, 255); // Semi-transparent blue
        p.ellipse(sunX, sunY, earthRadius * 2);

        // Draw Mars's path
        p.stroke(255, 255); // Semi-transparent red
        p.ellipse(sunX, sunY, marsRadius * 2);

        // Draw Earth
        p.fill(0, 191, 255);
        p.ellipse(earthX, earthY, 20, 20);

        // Draw Mars
        p.fill(255, 0, 0);
        p.ellipse(marsX, marsY, 15, 15);

        // Update the angles for the next frame

        if (p.millis() - lastTime >= 30) {
          // Add the current line position to the history after 2 seconds
          let currentLine = {
            x1: earthX,
            y1: earthY,
            x2: marsX,
            y2: marsY,
          };
          lineHistory.push(currentLine);
          lastTime = p.millis();
        }
      };

      // Expose the clearLineHistory function to the global scope
      window.clearLineHistory = () => {
        lineHistory = [];
      };
    });

    p5Ref.current = sketch;

    // Clean up the sketch when the component unmounts
    return () => {
      p5Ref.current.remove();
    };
  }, []);

  return (
    <div className="sketch-div">
      <button onClick={() => window.clearLineHistory()}>Restart</button>
      <div ref={p5Ref}></div>
    </div>
  );
}

export default Sketch;
