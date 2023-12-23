import * as d3 from "d3";
export function figureUpdate(stepNumber) {
  console.log(stepNumber);
  d3.select("figure").selectAll("*").remove();

  if (stepNumber === 0) {
    let emojiString = "🐓";
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
      .style("font-size", "8rem") // Apply any additional style changes
      .style("left", "46%");
  }
  if (stepNumber === 1) {
    let emojiString = "🐓".repeat(1000);
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
      .style("font-size", "1.7rem")
    //   .style("left", "0%");
  }
  if (stepNumber === 2) {
    let emojiString = "🐓".repeat(10000);
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
      .style("font-size", "0.5rem");
  }
  if (stepNumber === 3) {
    let emojiString = "🐓".repeat(100000);
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
      .style("font-size", "0.15rem");  }

  if (stepNumber === 4) {
    let emojiString = "🟨 ".repeat(10000);
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
      .style("font-size", "0.5rem");
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
