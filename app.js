const canvas = document.getElementById('myCanvas');
const colorField = document.querySelectorAll('.color-field');
const colorPicker = document.querySelector('.color-picker');
const penRange = document.querySelector('.pen-range');

const ctx = canvas.getContext('2d');
var rect = canvas.getBoundingClientRect();
// console.log(ctx);
console.log(rect);

let drawColor = colorPicker.value;
let drawWidth = penRange.value;
let is_drawing = false;
let restoreArray = [];
let index = -1;

for (let i = 0; i < colorField.length; i++) {
    colorField[i].addEventListener('click', function () {
        drawColor = this.id;
    })
}

colorPicker.addEventListener('change', () => {
    drawColor = colorPicker.value;
})
penRange.addEventListener('change', () => {
    drawWidth = penRange.value;
})

canvas.addEventListener('mousedown', start);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stop);
canvas.addEventListener('mouseout', stop);

canvas.addEventListener('touchstart', start);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stop);

function draw(e) {
    if (is_drawing) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctx.lineTo(x, y);
        ctx.lineWidth = drawWidth;
        ctx.strokeStyle = drawColor;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

    }
    e.preventDefault()
}

function start(e) {
    is_drawing = true;
    ctx.beginPath();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.moveTo(x, y);
    e.preventDefault()
}

function stop(e) {
    if (is_drawing) {
        ctx.stroke();
        ctx.closePath();
        is_drawing = false;
    }
    e.preventDefault();
    if (e.type != 'mouseout') {
        restoreArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        index += 1;
    }
}

function clearCanvas() {
    ctx.fillStyle = '#ffffff';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    restoreArray = [];
    index = -1;
}

function undo() {
    if (index <= 0) {
        clearCanvas();
    } else {
        index -= 1;
        restoreArray.pop();
        ctx.putImageData(restoreArray[index], 0, 0);
    }

}