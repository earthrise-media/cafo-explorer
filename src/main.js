import "./style.css";
// import javascriptLogo from '@/javascript.svg'
import { setupCounter } from "@/counter.js";
import * as d3 from "d3";
import scrollama from "scrollama";
import { figureUpdate } from "@/figure-update.js";

document.querySelector("#app").innerHTML = `
	<main>
		<section id="intro">
            <div class="background-image"></div>
			<p class="intro__dek">
                There are millions of undocumented chickens in the United States...
			</p>
            <br></br>
            <p class="intro__dek">
                We just found them.
			</p>
            
		</section>

		<section id="scrolly">
			<figure>
			</figure>

			<article>
				<div class="step" data-step="1">
					<h1>THIS IS A CHICKEN</h1>
				</div>
				<div class="step" data-step="2">
					<h1>THESE ARE 1,000 CHICKENS</h1>
				</div>
				<div class="step" data-step="3">
					<h1>THESE ARE 10,000 CHICKENS</h1>
				</div>
				<div class="step" data-step="4">
					<h1 class="highlight">THESE ARE 100,000 CHICKENS</h1>
				</div>
                <div class="step" data-step="5">
					<h1>There are 10 Billion Chickens raised in the United States every year</h1>
				</div>
                <div class="step" data-step="6">
					<h1>SO WHERE DO THEY ALL LIVE?</h1>
				</div>
                <div class="step" data-step="7">
                    <p>Chickens in the United States are raised in factory farms called concentrated animal feeding operations (CAFOs). We at Earth Genome used our proprietery machine learning tool called Earth Index, to find these CAFOs across the Southern United States. We found hundreds of previously undocumented sites housing thousands of chickens.</p>
                    <a href="https://felt.com/map/Poultry-CAFOs-Earth-Index-LWP9AUPxOQcWVBgPXYSZolC?loc=33.447,-85.396,6.38z" class="button-link">
                        <button class="button-1" role="button">Explore the Map</button>
                    </a>
				</div>
			</article>
		</section>

		<section id="outro"></section>
    </main>

`;

var main = d3.select("main");
var scrolly = main.select("#scrolly");
var figure = scrolly.select("figure");
var article = scrolly.select("article");
var step = article.selectAll(".step");

// initialize the scrollama
var scroller = scrollama();

// generic window resize listener event
function handleResize() {
  // 1. update height of step elements
  var stepH = Math.floor(window.innerHeight * 1);
  step.style("height", stepH + "px");

  var figureHeight = window.innerHeight / 1;
  var figureMarginTop = (window.innerHeight - figureHeight) / 5;

  figure.style("height", figureHeight + "px").style("top", figureMarginTop + "px");

  // 3. tell scrollama to update new element dimensions
  scroller.resize();
}

// scrollama event handlers
function handleStepEnter(response) {
  console.log(response);
  // response = { element, direction, index }

  // add color to current step only
  step.classed("is-active", function (d, i) {
    return i === response.index;
  });
  figureUpdate(response.index);

  // update graphic based on step
  //   figure.select("p").text(response.index + 1);
  //   run a function here that will update the figure based on the index
}

function init() {
  // 1. force a resize on load to ensure proper dimensions are sent to scrollama
  handleResize();

  // 2. setup the scroller passing options
  // 		this will also initialize trigger observations
  // 3. bind scrollama event handlers (this can be chained like below)
  scroller
    .setup({
      step: "#scrolly article .step",
      offset: 0.9,
      debug: false,
    })
    .onStepEnter(handleStepEnter);
}

// kick things off
init();

// let emojiString = "🐓".repeat(1000);

// var emoji = d3
//   .select("#app")
//   .append("span")
//   .attr("class", "emoji")
//   .text(emojiString) // your emoji here
//   .style("position", "absolute");

// function animateEmoji() {
//   emoji.style("left", "100%").transition().duration(3000).style("left", "0%");
//   //  .on("end", animateEmoji);
// }

// animateEmoji();
// setupCounter(document.querySelector('#counter'))
