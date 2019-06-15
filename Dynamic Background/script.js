let body, hex, rgb, hsl;

const hexToRGB = hex => {
    let r = 0,
        g = 0,
        b = 0;

    // 3 digits
    if (hex.length == 4) {
        r = "0x" + hex[1] + hex[1];
        g = "0x" + hex[2] + hex[2];
        b = "0x" + hex[3] + hex[3];
    }
    // 6 digits 
    else if (hex.length == 7) {
        r = "0x" + hex[1] + hex[2];
        g = "0x" + hex[3] + hex[4];
        b = "0x" + hex[5] + hex[6];
    }

    // unary + is used to convert hex to decimal
    return `${+r}, ${+g}, ${+b}`;
}

const hexToRGBP = hex => {
    let result = hexToRGB(hex);
    let [r, b, g] = result.split(",");
    r = +(r / 255 * 100).toFixed(1);
    g = +(g / 255 * 100).toFixed(1);
    b = +(b / 255 * 100).toFixed(1);
    return `${r}%, ${g}%, ${b}%`;
}

const RGBToHSL = (rgb) => {

    let [r, g, b] = rgb.split(",");
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    // Calculate hue
    // No difference
    if (delta == 0)
        h = 0;
    // Red is max
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
        h = (b - r) / delta + 2;
    // Blue is max
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0)
        h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return `${h}deg, ${s}%, ${l}%`;
}

function start_app() {
    getRandomColor();
    body = document.querySelector("body");
    hex = document.querySelector(".hex");
    rgb = document.querySelector(".rgb");
    hsl = document.querySelector(".hsl");
}

const getRandomColor = () => {
    NOOPBOT_FETCH({
        API: 'hexbot'
    }, runFunction);
}

const runFunction = responseJson => {
    let color = responseJson.colors[0].value;
    console.log(color);
    body.style.backgroundColor = color;
    hex.innerHTML = color;
    hex.style.color = color;
    let rgbColor = hexToRGB(color);
    rgb.innerHTML = `rgb(${rgbColor}) or rgb(${hexToRGBP(color)})`;
    rgb.style.color = `rgb(${rgbColor})`;
    let HSLcolor = RGBToHSL(rgbColor);
    hsl.innerHTML = `hsl(${HSLcolor})`;
    hsl.style.color = `hsl(${HSLcolor})`;
}

document.querySelector(".btn").addEventListener("click", getRandomColor);