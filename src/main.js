import "./css/style.css";
// import javascriptLogo from '@/javascript.svg'
import { setupCounter } from "@/counter.js";
import * as d3 from "d3";
import scrollama from "scrollama";
import { figureUpdate } from "@/figure-update.js";
// import 'bootswatch/dist/flatly/bootstrap.min.css';

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
            <br></br>
            <button id="scroll-button" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="128" height="52" viewBox="0 0 128 52" fill="none">
                    <path d="M33.7945 14.7931L64 37.2069L94.2055 14.7931M25.1644 51H102.836C116.181 51 127 40.1931 127 26.8621V25.1379C127 11.8069 116.181 1 102.836 1H25.1644C11.8188 1 1 11.8069 1 25.1379V26.8621C1 40.1931 11.8188 51 25.1644 51Z" stroke="#F5C53B" stroke-width="2"/>
                </svg>
            </button>
            <div id="scroll-text">SCROLL DOWN</div>
		</section>

		<section id="scrolly">
			<figure>
			</figure>

			<article>
				<div class="step" data-step="1">
					<h1 id="1-chicken">THIS IS A CHICKEN</h1>
				</div>
				<div class="step" data-step="2">
					<h1>THIS IS 1,000 CHICKENS</h1>
				</div>
				<div class="step" data-step="3">
					<h1>THIS IS 10,000 CHICKENS</h1>
				</div>
				<div class="step" data-step="4">
					<h1>THIS 🟨 IS 100,000 CHICKENS</h1>
				</div>
                <div class="step" data-step="5">
					<h1>There are 10 Billion Chickens raised in the United States every year</h1>
				</div>
                <div class="step" data-step="6">
					<h1>SO WHERE DO THEY ALL LIVE?</h1>
				</div>
                <div class="step" data-step="7">
                    <p>Chickens in the United States are raised in factory farms called concentrated animal feeding operations (CAFOs). We at Earth Genome used our proprietery machine learning tool called Earth Index, to find these CAFOs across the Southern United States. We found thousands of previously undocumented sites housing millions of chickens.</p>
                    <a href="map/" class="button-link">
                      <button type="button" class="button-1 btn-warning">Explore the Map</button>
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
var scrollButton = document.getElementById("scroll-button");
scrollButton.addEventListener("click", function () {
    window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
    });
}); 

// generic window resize listener event
function handleResize() {
    // 1. update height of step elements
    var stepH = Math.floor(window.innerHeight * 1);
    step.style("height", stepH + "px");

    var figureHeight = window.innerHeight / 4;
    var figureMarginTop = (window.innerHeight - figureHeight) / 2;

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

init();
