import * as d3 from "d3";
import "./css/style.css";

export function figureUpdate(stepNumber) {
  console.log(stepNumber);
  d3.select("figure").selectAll("*").remove();

  if (stepNumber === 0) {
    changeBackgroundImage('chicken-1.png');
  }
  if (stepNumber === 1) {
    changeBackgroundImage('chicken-1000.png');
  }
  if (stepNumber === 2) {
    changeBackgroundImage('chicken-10000.png');
  }
  if (stepNumber === 3) {
    changeBackgroundImage('chicken-100000.png');
  }

  if (stepNumber === 4) {
    changeBackgroundImage('squares-100000.png');
  }
  if (stepNumber === 5) {
    let emojiString = "🏠";
    var emoji = d3
      .select("figure")
      .append("span")
      .attr("class", "emoji")
      .text(emojiString) // your emoji here
      .style("position", "absolute");
      emoji
      .style("opacity", 0) // Start with the emoji being invisible
      .transition() // Start the transition
      .duration(3000) // Set the duration to 3000 milliseconds
      .style("opacity", 1) // Fade in to fully opaque
      .style("font-size", "8rem")
      .style("left", "46%");
  }
  if (stepNumber === 6) {
  }
}


export function changeBackgroundImage(newImageUrl) {
  var figure = document.querySelector('figure');
  
  // Step 1: Apply transition and initial transform
  figure.style.transition = 'transform 1s ease-in-out';
  figure.style.transform = 'translate3d(-100%, 0, 0)';

  // Step 2: After the slide-out transition, change the background and slide in
  setTimeout(function() {
      figure.style.backgroundImage = 'url(' + newImageUrl + ')';
      figure.style.transform = 'translate3d(0, 0, 0)';
  }, 1000); // 1000 ms for the transition to complete
}
