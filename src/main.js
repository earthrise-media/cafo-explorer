import "./css/style.css";
import * as d3 from "d3";
import scrollama from "scrollama";

document.querySelector("#app").innerHTML = `
    <main>
        <a href="map/" class="button-link">
            <button class="button-2" id="button-2" type="button">Jump to Map</button>
        </a>
        <section id="intro">
            <div class="background-image"></div>
            <p class="intro">
                There are millions of chickens in the United States...
            </p>
            <br></br>
            <p class="intro">
                We just found them.
            </p>
            <br></br>
            <button id="scroll-button" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="128" height="52" viewBox="0 0 128 52" fill="none">
                    <path
                        d="M33.7945 14.7931L64 37.2069L94.2055 14.7931M25.1644 51H102.836C116.181 51 127 40.1931 127 26.8621V25.1379C127 11.8069 116.181 1 102.836 1H25.1644C11.8188 1 1 11.8069 1 25.1379V26.8621C1 40.1931 11.8188 51 25.1644 51Z"
                        stroke="#F5C53B" stroke-width="2" />
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
                    <h1>THERE ARE 10 BILLION CHICKENS RAISED IN THE UNITED STATES EVERY YEAR</h1>
                </div>
                <div class="step" data-step="6">
                    <h1>SO WHERE DO THEY ALL LIVE?</h1>
                </div>
                <div class="step" data-step="7">
                    <p>Chickens in the United States are raised in factory farms called concentrated animal feeding
                        operations (CAFOs). We at Earth Genome used our proprietery machine learning tool called Earth
                        Index, to find these CAFOs across the Southern United States. We found thousands of previously
                        undocumented sites housing millions of chickens.</p>
                    <a href="map/" class="button-link">
                        <button type="button" class="button-1">Explore the Map</button>
                    </a>
                </div>
            </article>
        </section>
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

    var figureHeight = window.innerHeight;
    var figureMarginTop = (window.innerHeight - figureHeight) / 1;

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
    // eventually I should set progress to true and connect this value to the background images coming in and out.
    scroller
        .setup({
            step: "#scrolly article .step",
            offset: 0.9,
            // debug: true,
            // progress: true,
        })
        .onStepEnter(handleStepEnter);
        
    window.addEventListener("resize", handleResize);
}

function figureUpdate(stepNumber) {
    console.log(stepNumber);
    d3.select("figure").selectAll("*").remove();

    if (stepNumber === 0) {
        // if the width is 767px or less, then we want to change the background image to the mobile version
        if (window.innerWidth <= 767) {
            changeBackgroundImage("chicken-1-mobile.png", true);
        } else {
            changeBackgroundImage("chicken-1.png", true);
        }
    }
    if (stepNumber === 1) {
        if (window.innerWidth <= 767) {
            changeBackgroundImage("chicken-1000-mobile.png", true);
        } else {
            changeBackgroundImage("chicken-1000.png", true);
        }
    }
    if (stepNumber === 2) {
        if (window.innerWidth <= 767) {
            changeBackgroundImage("chicken-10000-mobile.png", true);
        } else {
            changeBackgroundImage("chicken-10000.png", true);
        }
    }
    if (stepNumber === 3) {
        if (window.innerWidth <= 767) {
            changeBackgroundImage("chicken-100000-mobile.png", true);
        } else {
            changeBackgroundImage("chicken-100000.png", true);
        }
    }

    if (stepNumber === 4) {
        if (window.innerWidth <= 767) {
            changeBackgroundImage("squares-100000-mobile.png", true);
        } else {
            changeBackgroundImage("squares-100000.png", true);
        }
    }
    if (stepNumber === 5) {
        document.querySelector("figure").style.backgroundRepeat = "no-repeat";
        if (window.innerWidth <= 767) {
            document.querySelector("figure").style.backgroundImage = "url(squares-100000-mobile.png)";
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
                .style("font-size", "100px") // Grow the font size
                .style("position", "absolute")
                .style("text-align", "center")
                .style("left", "37%");
        } else {
            document.querySelector("figure").style.backgroundImage = "url(squares-100000.png)";
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
                .style("font-size", "100px") // Grow the font size
                .style("position", "absolute")
                .style("text-align", "center")
                .style("left", "45%");
        }
    }
    if (stepNumber === 6) {
        if (window.innerWidth <= 767) {
            document.querySelector("figure").style.backgroundImage = "url(tiled-cafos-mobile.png)";
            document.querySelector("figure").style.backgroundRepeat = "tile";
        } else {
            document.querySelector("figure").style.backgroundImage = "url(tiled-cafos.png)";
            document.querySelector("figure").style.backgroundRepeat = "tile";
        }
    }
}

// eventually I should set progress to true and connect this value to the background images coming in and out.
function changeBackgroundImage(newImageUrl) {
    var figure = document.querySelector("figure");

    // Step 1: Slide out the current image to the right
    figure.style.transition = "transform 1s ease-in-out";
    figure.style.transform = "translate3d(100%, 0, 0)"; // Slide to the right

    // Step 2: After the slide-out transition, change the background and position it to the left
    setTimeout(function () {
        figure.style.backgroundImage = "url(" + newImageUrl + ")";
        figure.style.transition = "none";
        figure.style.transform = "translate3d(-100%, 0, 0)";

        // Step 3: Slide the new image into view from the left
        setTimeout(function () {
            figure.style.transition = "transform 1s ease-in-out";
            figure.style.transform = "translate3d(0, 0, 0)"; // Slide into view from the left
        }, 50);
    }, 1000);
}

init();
