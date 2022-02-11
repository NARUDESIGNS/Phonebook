
//COLLECT NECESSARY DOM ELEMENTS TO BE USED FOR APPLICATION FUNCTIONALITY
let msgAlert = document.getElementById('msg-alert');
let noResult = document.getElementById('no-result');
let noResultMsg = document.getElementById('no-result-msg');

let contactsContainer = document.getElementById('house-main');
let dimBackground = document.getElementById('dim'); //this container dims the background
let addEditDeleteContainer = document.getElementById('add-edit-delete'); //this container was used to house the add|edit|delete confirmation view in order to align them properly

let nameInitials = document.getElementById('name-initials');
let nameInitialsContainer = document.getElementById('name-initials-container');
let contactName = document.getElementsByClassName('contact-name');

let searchInput = document.getElementById('search');

let editButtons = document.getElementsByClassName('edit-icon');
let editNameInput = document.getElementById('edit-name');
let editNumberInput = document.getElementById('edit-number');

let deleteButtons = document.getElementsByClassName('trash-icon');

let newContactButton = document.getElementById('new-contact');
let addNameInput = document.getElementById('input-name');
let addNumberInput = document.getElementById('input-number');

let addView = document.getElementById('add-view');
let editView = document.getElementById('edit-view');
let deleteView = document.getElementById('delete-view');

let confirmAdd = document.getElementById('confirm-add');
let discardAdd = document.getElementById('discard-add');

let confirmEdit = document.getElementById('confirm-edit');
let discardEdit = document.getElementById('discard-edit');

let confirmDelete = document.getElementById('confirm-delete');
let discardDelete = document.getElementById('discard-delete');

// //restore contacts saved before application was quit ...in progress
contactBase = [];

if(localStorage.getItem('contacts')){
    contactBaseUpdate = JSON.parse(localStorage.getItem('contacts'));
    for(let contact of contactBaseUpdate){
        renderContacts(contact[0], contact[1]);
    }
}

//Store contact in local storage
updateContacts = () => localStorage.setItem('contacts', JSON.stringify(contactBase));

// display "NO CONTACTS" when theres no contact
function displayNoResult(){
    noResultMsg.innerText = "NO CONTACTS!"
    noResult.style.fontSize = "20px";     
    noResult.style.display = "block";   
}

// hide "NO CONTACTS" when theres are contacts
function hideNoResult(){
    noResult.style.display = "none";
}

//Make sure name initials takes the first letter of the name and surname if surname is available
function getNameInitials(element, name){
    //assign a background color from the random colors array
    let color = ["#78C0FF", "#FFABAB", "#FFBC78", "#3FC77A", "#FF7474", "#96BC92", "#FFDC2D", "#89A9F3", "#BE9068", "#9DC0C2"];
    name = name.split(" ");
    element.style.backgroundColor = color[Math.floor(Math.random() * color.length)];
    element.firstElementChild.innerText = name[0][0].toUpperCase(); //first letter of the name;
}

//create new contact element
function createNewContact(name, number){
    contactsContainer.innerHTML += 
        `<div class="contact-details" id="contact-details">
            <section class="name-initials" id="name-initials-container">
                <p  id="name-intials">AK</p>  
            </section>
            <section>
                <p class="contact-name" id="contact-name">${name}</p>
                <p class="contact-number" id="contact-number">${number}</p>
            </section>
            <section class="edit-delete">
                <span class="edit-icon"  id="edit-icon"><i class="fa fa-edit"></i></span>
                <span class="trash-icon" id="delete-icon"><i class="fa fa-trash"></i></span>                    
            </section>
        </div>`;
}

//display a particular view
function displayContainer(type){
    dimBackground.style.visibility = "visible";
    addEditDeleteContainer.style.visibility = "visible";
    type.style.display = "block";
}

//hide a particular view
function hideContainer(type){
    dimBackground.style.visibility = "hidden";
    addEditDeleteContainer.style.visibility = "hidden";
    type.style.display = "none";
}

//if there are no contact element on the screen, display no contact
if(contactsContainer.childElementCount == 1){ //1 because the noResult element is still a present child even tho hidden
    displayNoResult();
}

//ADD NEW CONTACT
//new contact button is clicked
newContactButton.addEventListener('click', () =>  {
    displayContainer(addView);
})

//user discards add
discardAdd.addEventListener('click', () => {
    hideContainer(addView);
    //reset input values for addView incase the user already typed in values before discarding
    addNameInput.value = "";
    addNumberInput.value = "";
});

//add contact function
function renderContacts(name, number){
    if(name && number) contactBase.push([`${name}`,`${number}`]);
    contactBase.sort();
    //clear contacts and re-generate them from the contact base to avoid adding already existing contacts
    contactsContainer.innerHTML = null;
    //generate contacts using contact values in the contacts base
    for(let i = 0; i < contactBase.length; i++){
        createNewContact(contactBase[i][0], contactBase[i][1]);
        getNameInitials(contactsContainer.children[i].firstElementChild, contactBase[i][0]); //pass in initials container and contact name
    }
    //Add Not Found | No Contacts message since contacts are totally cleared and regenerated on addition of a new contact
    contactsContainer.innerHTML += 
    `<div class="no-result" id="no-result">
        <span><i class="fa fa-exclamation-circle"></i></span>
        <p class="no-result-msg" id="no-result-msg">NOT FOUND!</p>
    </div>`;
    //reset add view input values
    addNameInput.value = "";
    addNumberInput.value = "";

    //DELETE CONTACT
    for (let button of deleteButtons){
        button.addEventListener('click', function(){
            displayContainer(deleteView);
            deleteButton = button;
        });
    }

    //user discards delete
    discardDelete.addEventListener('click', () => {
        hideContainer(deleteView);
    });

    //user confirms delete
    confirmDelete.addEventListener('click', () => {
        deleteContact(deleteButton);
        hideContainer(deleteView); 
    });

    //EDIT CONTACT
    for (let button of editButtons){
        //when the edit button is clicked replace the input values with contact's name and number
        button.addEventListener('click', function(){
            displayContainer(editView);
            //console.log(button.parentElement.previousElementSibling.innerText.replace(/[0-9]/g,'').replace(/\n/g, ''));
            //store name and number into nameToEdit and numberToEdit
            nameToEdit = button.parentElement.previousElementSibling.firstElementChild.innerText;
            numberToEdit = button.parentElement.previousElementSibling.lastElementChild.innerText;
            editNameInput.value = nameToEdit;
            editNumberInput.value = numberToEdit;
            //console.log(editNameInput.parentElement);
            editButton = button;
        }) 
    }

    //user discards edit
    discardEdit.addEventListener('click', () => {
        hideContainer(editView);
    });

    //user confirms edit
    confirmEdit.addEventListener('click', () => { 
        hideContainer(editView);
        editContact(editButton);
        updateContacts();
    }); 
}

//delete contact function
function deleteContact(deleteButton){
        deleteButton.parentElement.parentElement.style.animation = "fade-out 0.6s";
        setTimeout(() => {
            contactsContainer.removeChild(deleteButton.parentElement.parentElement); 
            //search through the contact base to see which contact matches the one whose delete button is clicked and remove it from the array
            contactBase.forEach(value => {
                let nameToMatch = deleteButton.parentElement.previousElementSibling.firstElementChild.innerText; //store name of contact whose delete button is clicked
                let numberToMatch = deleteButton.parentElement.previousElementSibling.lastElementChild.innerText; //store number of contact whose delete button is clicked
                if(value.toString() == `${nameToMatch},${numberToMatch}`){
                    contactBase.splice(contactBase.indexOf(value), 1);
                }
            });
        }, 600);    
        msgAlert.innerText = "Deleted successfully!"; 
        msgAlert.parentElement.style.display = "block"; 
        setTimeout(() => {
            // display "NO CONTACTS" when theres no contact
            if(contactsContainer.childElementCount == 1){ //1 because the noResult element is still a present child even tho hidden
                displayNoResult();
                //displayContainer(editView);
                console.log('no elements nw');
            }
            msgAlert.parentElement.style.display = "none";
            //reset the page and search input just incase the user searched a number to delete it
            // for(let i = 0; i < contactName.length; i++){
            //     contactName[i].parentElement.parentElement.style.display = "flex";
            // }
            searchInput.value = "";
        }, 2000);
}

// edit contact function 
function editContact(editButton){
    //name to use in matching previous name | number values in contact base
    let nameBeforeEdit = editButton.parentElement.previousElementSibling.firstElementChild.innerText;
    let numberBeforeEdit = editButton.parentElement.previousElementSibling.lastElementChild.innerText;
    //store edited input value into the name and number field
    editButton.parentElement.previousElementSibling.firstElementChild.innerText = editNameInput.value;
    editButton.parentElement.previousElementSibling.lastElementChild.innerText = editNumberInput.value;
    //replace old value with new edited value
    contactBase.forEach(value => {
        if(value.toString() == `${nameBeforeEdit},${numberBeforeEdit}`){ 
            //console.log("found match!", nameBeforeEdit, numberBeforeEdit, contactBase.indexOf(value), "");
            //contactBase.splice(contactBase.indexOf(value), 1);
            contactBase[contactBase.indexOf(value)] = [`${editNameInput.value}`,`${editNumberInput.value}`];
            //renderContacts(editNameInput.value, editNumberInput.value);
        }
    });
    //regenerate name initials else nameinitials will be left with Letter from the original word before it is being edited
    let elementShortened = editButton.parentElement.previousElementSibling.previousElementSibling;
    let nameShortened = editButton.parentElement.previousElementSibling.firstElementChild.innerText;
    getNameInitials(elementShortened, nameShortened);   
}

//user confirms add
//contactBase = [];
confirmAdd.addEventListener('click', () => {
    hideContainer(addView);
    renderContacts(addNameInput.value, addNumberInput.value);
});

document.addEventListener('keypress', (event) => {
    if (addView.style.display === 'block' && event.key === 'Enter') confirmAdd.click();
}); 

  

//SEARCH CONTACT    
searchInput.addEventListener('input', () => { 
    //prevent input from receiving space as first character
    if(searchInput.value.startsWith(" ")){
        searchInput.value = searchInput.value.replace(/\s/g,'');
    } 
    //check if name includes values been typed into the search bar
    let noMatchCount = 0; //this is used to count how many matches that wasn't found
    for(let j = 0; j < contactName.length; j++){
        if(!contactName[j].innerText.toUpperCase().includes(searchInput.value.toUpperCase())){
            noMatchCount++;
        }
        else {
            noMatchCount--;
        }
    }
    for(let i = 0; i < contactName.length; i++){
        if(contactName[i].innerText.toUpperCase().includes(searchInput.value.toUpperCase())){
            contactName[i].parentElement.parentElement.style.display = "flex";
        }
        else {
            contactName[i].parentElement.parentElement.style.display = "none";
        }
        //if total of names not matched equals the total number of names, it means theres no match at all
        //therefore we display the no-result message else we hide the no-result message
        if(noMatchCount === contactName.length){
            noResultMsg.innerText = "NOT FOUND!"
            noResult.style.display = "block";
        }
        else {
            noResult.style.display = "none";
        }
    }
});

//Update the local storage every second
setInterval( () => {
    updateContacts();
}, 1000);