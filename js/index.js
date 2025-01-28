// create a footer and add it to the body
const footer = document.createElement('footer');
const body = document.querySelector('body');
body.appendChild(footer);

// Add a copyright to the footer
const today = new Date();
const year = today.getFullYear();
const copyright = document.createElement('p');
copyright.innerHTML = `<span>&#169 ${year} Tom<\span>`
footer.appendChild(copyright);

// populate the skills list
const skillsList = ['c++', 'python', 'powerpoint'];
const skillsSection = document.getElementById('skills');
const skillsUL = skillsSection.querySelector('ul');

for (let skill of skillsList) {
    let skillLI = document.createElement('li');
    skillLI.innerHTML = skill;
    skillsUL.appendChild(skillLI);  
}

//
// handle events for the message form
//

let messageForm = document.querySelector("[name='leave_message']");
let messageSection = document.getElementById('message-section');
let messageList = messageSection.querySelector('ul');
messageSection.hidden = true;

let idCounter = 0;
// create unique id's for entries
// closure on idCounter
function makeId() {
    let id = 'entry' + idCounter++;
    return id;
}
// save entries by id so their content can initialize the edit form
let entryById={};

// Handle submission of new message list entries
messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let name = event.target.usersName.value;
    let email = event.target.usersEmail.value;
    let message = event.target.usersMessage.value;

    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);
    let uid = makeId();
    let newMessage = document.createElement('li');
    newMessage.classList.add('message-item');

    newMessage.innerHTML = `<a  href="mailto:${email} ">${name}  </a><span>wrote: ${message} </span>`;
    newMessage.setAttribute('id', uid);

    entryById[uid] = { usersName: name, usersEmail: email, usersMessage: message };
    newMessage.appendChild(makeEditButton());
    newMessage.appendChild(makeRemoveButton());

    messageList.appendChild(newMessage);
    messageForm.reset();
    messageSection.hidden = false;
});


// create a remove button in parentNode
function makeRemoveButton() {
    let removeButton = document.createElement('button');
    removeButton.innerText = 'remove';
    removeButton.type = 'button';
    removeButton.className = 'remove-button';
    removeButton.addEventListener('click', () => {
        let entry = removeButton.parentNode;
        let uid1 = entry.getAttribute('id');
        delete entryById[uid1];
        entry.remove();
        if (messageList.childElementCount === 0) {
            messageSection.hidden = true;
        };
    });
    return removeButton;
};

// create an edit button in parentNode
function makeEditButton() {
    let editButton = document.createElement('button');
    editButton.innerText = 'edit';
    editButton.type = 'button';
    editButton.className = 'edit-button';
    editButton.addEventListener('click', () => {
        // adds an edit button with listener to it's parent node
        let entry = editButton.parentNode;

        // don't display the old edit button while editing
        let oldEditButton = entry.querySelector('button.edit-button');
        oldEditButton.hidden = true;

        // don't display the old remove button while editing
        let oldRemoveButton = entry.querySelector('button.remove-button');
        oldRemoveButton.hidden = true;

        // get the entry's unique id so its content can be used in the form
        let uid = entry.getAttribute('id');
        let clonedForm = messageForm.cloneNode(true);
        clonedForm.className = "edit-message-form";
        clonedForm.usersName.value = entryById[uid].usersName;
        clonedForm.usersEmail.value = entryById[uid].usersEmail;
        clonedForm.usersMessage.value = entryById[uid].usersMessage;
        entry.appendChild(clonedForm);
        clonedForm.addEventListener('submit', function editMessage(event) {
            event.preventDefault();
            entryById[uid].usersName = event.target.usersName.value;
            entryById[uid].usersEmail = event.target.usersEmail.value;
            entryById[uid].usersMessage = event.target.usersMessage.value;
            let newEntry = document.createElement('li');
            newEntry.classList.add('message-item');
            newEntry.setAttribute('id', uid);
            newEntry.innerHTML = `<a href="mailto:${entryById[uid].usersEmail} "> ${entryById[uid].usersName} </a><span>wrote: ${entryById[uid].usersMessage}</span>`;
            newEntry.appendChild(makeEditButton());
            newEntry.appendChild(makeRemoveButton());
            entry.parentNode.replaceChild(newEntry, entry);
        });
    });
    return editButton;
};

