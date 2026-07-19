
const myButton = document.getElementById('action-btn');


function changeStyle() {
    myButton.style.backgroundColor = 'red';
    myButton.textContent = 'Clicked!';
}


myButton.addEventListener('click', changeStyle);
