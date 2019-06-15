'use strict';

// Global variable to store the answer
var answer = "0";

function start_app() {
    getRandomColor();
}

// Function to call the noopbot API
const getRandomColor = () => {
    document.querySelector("button.check").disabled = false;
    document.querySelector(".solution").innerHTML = "";
    NOOPBOT_FETCH({
        API: 'hexbot'
    }, runFunction);
}

// Function to get and parse the response
const runFunction = response => {
    // Getting a random color
    let color = response.colors[0].value;
    let clean = color.slice(1);
    document.querySelector(".question").style.backgroundColor = color;
    // Getting the name of the color
    window.answer = getName(clean);

    // Generating other options
    let lighten = 5,
        brighten = 5,
        darken = 5;
    let tc = tinycolor(color);
    let op1 = getName(tc.lighten().toHex());
    let op2 = getName(tc.brighten(15).toHex());
    let op3 = getName(tc.darken().toHex());
    while (op1 == answer) {
        op1 = getName(tc.lighten(lighten).toHex());
        lighten += 3;
    }
    while (op2 == answer || op2 == op1) {
        op2 = getName(tc.brighten(brighten).toHex());
        brighten += 3;
    }
    while (op3 == answer || op3 == op1 || op3 == op2) {
        let op3 = getName(tc.darken(darken).toHex());
        darken += 3

    }
    let options = [answer, op1, op2, op3];
    options.sort(() => Math.random() - 0.5); // Randamizing the options array
    // console.log(options);

    // Adding options to the page
    let html = '';
    options.forEach((item, index) => {
        html += `<li data-option="${item}">
                <input type = "radio"
                name = "option"
                id = "op${index}"
                value = "${item}" >
                <div class = "check"> 
                <span class = "no">&nbsp;</span><span class="yes">&#10003;</span>
                </div>${item}
            </li>`
    })
    document.querySelector(".options").innerHTML = html;

    // Adding click event to all options
    let el = document.querySelectorAll(".options li");
    el.forEach((item) => {
        item.addEventListener("click", clicked);
    });

    // Function to add checked class to selected option
    function clicked() {
        el.forEach(item => {
            item.classList.remove("checked");
        })
        this.classList.add("checked");
    }

}

// Function to get the name of the color
const getName = hex => {
    let name = ntc.name(hex);
    return name[1];
}

document.querySelector(".next").addEventListener("click", getRandomColor);
document.querySelector("button.check").addEventListener("click", checkAns);

// Function to validate the answer
function checkAns() {
    try {
        document.querySelector("button.check").disabled = true;
        let selected = document.querySelector(".options li.checked").getAttribute("data-option");
        // console.log(selected);
        if (selected == window.answer) {
            document.querySelector(".solution").innerHTML = `<span style='color:green'>Correct</span>`;
        } else {
            document.querySelector(".solution").innerHTML = `<span style='color:red'>The correct answer is ${window.answer}</span>`;
        }
        document.querySelector(`[data-option="${window.answer}"]`).style.backgroundColor = "green";
        document.querySelector(`[data-option="${window.answer}"]`).style.color = "white";
    } catch (err) {
        document.querySelector(".solution").innerHTML = `<span style='color:red'>Please select an answer!</span>`;
        console.error(err);
    }
}