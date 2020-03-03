
let input = document.querySelector(".input");
let container = document.getElementById("container");
let icon = document.getElementById("icon");
let message = document.getElementById("message");
input.addEventListener("input", (e) => {
    if (input.value == "delete" || input.value == "Delete" || input.value == "DELETE"){
        message.innerText = input.value = "";
    } 
});

input.addEventListener("keydown", (e) => {
    if (e.key == "Enter"){
        if (message.innerText == "DAY" || message.innerText == "NIGHT") message.innerText = " ";
         message.innerText += ` ${input.value}`;
         input.value = "";
         //input.style.focus = false;
    }
}) 

document.addEventListener("keydown", (e) => {
    if (e.key == "Alt"){
        if (container.style.backgroundColor !== "lightgrey"){ //onsole.log(container.style.bac
            container.style.backgroundColor = "lightgrey";
            icon.style.color = "yellow";
        }
        else if (container.style.backgroundColor == "lightgrey"){
            container.style.backgroundColor = "grey";
            icon.style.color = "lightgrey";
        }
    }
})


icon.addEventListener('click', () => {
    input.value += message.innerText;
    message.innerText = "";
});

// document.addEventListener('keydown', (e) => {
//     if (e.key == "ArrowRight"){
//         newItem = '<H1 class="header"> Hello guys!</H1>';
//         container.innerHTML += newItem;
//         console.log(container);
//     }
// })