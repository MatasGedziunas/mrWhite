class Player {
    constructor(role, placement, id, name, word) {
        this.role = role;
        this.placement = placement;
        this.id = id;
        this.name = name;
        this.word = word;
    }
}

const addPlayersButton = document.querySelector("#add-players");
const startGame = document.querySelector("#start-game");
const playerCountInput = document.querySelector("#player-count");
const mrWhiteCountInput = document.querySelector("#mr-white-count");
const undercoverCountInput = document.querySelector("#undercover-count");
const playerAdditionDiv = document.querySelector("#player-addition");
const modal = document.querySelector("#modal");
const closeModal = document.querySelector("#close-modal");
const playerAdditionList = document.querySelector("#players-addition-list");
const categoriesContainer = document.getElementById('categoriesContainer');
const selectAllButton = document.getElementById('select-all-categories-button');
const wordList = [
    { category: "Best people", words: ["Tarasevicius", "Skaite", "Gabija", "Paulius", "Liepa", "Akvile", "Ignas", "Gedziunas"] },
    { category: "LSMUG Teachers", words: ["Kuciene", "Zaveckas", "Kukauskiene"] },
    { category: "Animals", words: ["Dog", "Cat", "Rabbit", "Fish", "Bird", "Lion", "Dolphin", "Eagle", "Shark", "Wolf"] },
    { category: "Fruits", words: ["Apple", "Banana", "Orange", "Pear", "Cherry", "Pineapple", "Mango", "Kiwi", "Grapefruit", "Coconut"] },
    { category: "Countries", words: ["USA", "Canada", "Germany", "Italy", "Japan", "Russia", "Brazil", "India", "Australia", "China"] },
    { category: "Kitchen Items", words: ["Spoon", "Fork", "Plate", "Cup", "Knife", "Blender", "Toaster", "Microwave", "Oven", "Kettle"] },
    { category: "Vehicles", words: ["Car", "Bike", "Bus", "Train", "Motorcycle", "Plane", "Ship", "Helicopter", "Tram", "Skateboard"] },
    { category: "Sports", words: ["Soccer", "Basketball", "Tennis", "Baseball", "Golf", "Cricket", "Rugby", "Badminton", "Volleyball", "Hockey"] },
    { category: "Musical Instruments", words: ["Guitar", "Piano", "Violin", "Drums", "Flute", "Saxophone", "Harp", "Accordion", "Cello", "Trombone"] },
    { category: "Occupations", words: ["Doctor", "Teacher", "Engineer", "Chef", "Artist", "Astronaut", "Detective", "Pilot", "Architect", "Journalist"] },
    { category: "Famous Landmarks", words: ["Eiffel Tower", "Great Wall of China", "Statue of Liberty", "Taj Mahal", "Colosseum", "Machu Picchu", "Sydney Opera House", "Mount Fuji", "Big Ben", "Stonehenge"] }
];
document.addEventListener("DOMContentLoaded", function () {
    wordList.forEach(list => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = list.category;
        checkbox.name = 'category';
        checkbox.checked = true;
        const label = document.createElement('label');
        label.htmlFor = list.category;
        label.appendChild(document.createTextNode(list.category));
        const div = document.createElement('div');
        div.appendChild(checkbox);
        div.appendChild(label);
        categoriesContainer.appendChild(div);
    });
})

let citizenWord = "";
let undercoverWord = "";
var numberInputs = document.querySelectorAll('input[type="number"]');
let players = [];
let startPlayers = [];

selectAllButton.addEventListener("click", () => {
    const checkboxes = document.querySelectorAll('#categoriesContainer input[type="checkbox"]');
    selectAllButton.addEventListener('click', function () {
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
    });
})

addPlayersButton.addEventListener("click", () => {
    if (addPlayersButton.textContent == "Add players") {
        const playerCount = parseInt(playerCountInput.value);
        const mrWhiteCount = parseInt(mrWhiteCountInput.value);
        const undercoverCount = parseInt(undercoverCountInput.value);
        if (playerCount < 3) {
            const errorMessage = createErrorParagraph("There must be at least 3 players");
            modal.insertBefore(errorMessage, modal.firstChild);
            modal.showModal();
        } else if (undercoverCount > playerCount) {
            const errorMessage = createErrorParagraph("Undercover player count can't be greater than all player count");
            modal.insertBefore(errorMessage, modal.firstChild);
            modal.showModal();
        } else if (mrWhiteCount > playerCount) {
            const errorMessage = createErrorParagraph("Mr white player count can't be greater than all player count");
            modal.insertBefore(errorMessage, modal.firstChild);
            modal.showModal();
        } else {
            const checkboxes = document.querySelectorAll('#categoriesContainer input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                if (checkbox.checked != true) {
                    removeCategory(checkbox.id);
                }
            });
            for (let i = 0; i < playerCount; i++) {
                players.push(new Player("", 0, i.toString(), "", ""));
            }
            addPlayerElements();
            handlePlayerInfo();
            selectWords();
            numberInputs.forEach(function (input) {
                input.disabled = true;
            });
            addPlayersButton.textContent = "Change game information";
            playerAdditionDiv.hidden = false;
            disableGameInfoInputs();
        }
    } else if (addPlayersButton.textContent == "Change game information") {
        location.reload();
    }
});

function removeCategory(categoryName) {
    for (let i = 0; i < wordList.length; i++) {
        const list = wordList[i];
        if (list.category == categoryName) {
            wordList.splice(i, 1);
        }
    }
}

function addPlayerElements() {
    playerAdditionList.innerHTML = "";
    for (let i = 0; i < players.length; i++) {
        const playerElement = createPlayerElement(players[i]);
        playerAdditionList.appendChild(playerElement);
    }
}

closeModal.addEventListener("click", () => {
    modal.close();
    modal.innerHTML = "";
    modal.appendChild(closeModal); // Add the button back to the modal
});

modal.addEventListener("close", function () {
    modal.innerHTML = "";
    modal.appendChild(closeModal);
})

function disableGameInfoInputs() {
    const container = document.querySelector('#game-info');
    const inputs = container.querySelectorAll('input');
    inputs.forEach(input => {
        input.disabled = true;
    });
    const checkboxes = document.querySelectorAll('#categoriesContainer input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.disabled = true;
    });
}

function disableNameInputs() {
    const container = document.querySelector('#player-addition');
    const inputs = container.querySelectorAll('textarea');
    inputs.forEach(input => {
        input.disabled = true;
    });
}

function handlePlayerInfo() {
    console.log(players);
    const playerCount = parseInt(playerCountInput.value);
    let playerRoles = generateRoles();
    let start = Math.floor(Math.random() * playerRoles.length);
    let counter = playerCount;
    for (let i = 0; i < counter; i++) {
        players[i].role = playerRoles[start];
        players[i].placement = start;
        if (start + 1 >= playerCount) {
            start = 0;
        } else {
            start++;
        }
    }
}

function displayPlayerInfo() {
    for (let player of players) {
        const labelSelector = document.querySelector(`label[for="name-${player.id}-turn"]`);
        labelSelector.textContent = `Turn: ${player.placement}`;
        const iconSelector = document.querySelector(`#remove-icon-${player.id}`);
        iconSelector.style.display = 'inline';
    }
}

function selectWords() {
    if (wordList.length > 0) {
        let categoryIndex;
        do {
            categoryIndex = Math.floor(Math.random() * wordList.length * 0.999);
        } while (wordList[categoryIndex].words.length < 2)

        let word1Index, word2Index;
        do {
            word1Index = Math.floor(Math.random() * wordList[categoryIndex].words.length * 0.999);
            word2Index = Math.floor(Math.random() * wordList[categoryIndex].words.length * 0.999);
        } while (word1Index === word2Index);
        citizenWord = wordList[categoryIndex].words[word1Index];
        undercoverWord = wordList[categoryIndex].words[word2Index];
        updateWords();
        wordList[categoryIndex].words.splice(word1Index, 1);
        wordList[categoryIndex].words.splice(word2Index, 1);
        if (wordList[categoryIndex].words.length < 2) {
            wordList.splice(categoryIndex, 1);
        }
        console.log(wordList);
    } else {
        const p = createErrorParagraph("There are no words left, restart the game");
        modal.insertBefore(p, modal.firstChild);
        modal.showModal();
    }
}

function updateWords() {
    for (let player of players) {
        if (player.role == "Citizen") {
            player.word = citizenWord;
        } else if (player.role == "Undercover") {
            player.word = undercoverWord;
        } else if (player.role == "MrWhite") {
            player.word = "You are Mr White :O";
        }
    }
}

startGame.addEventListener("click", () => {
    let flag = 0;
    if (startGame.textContent == "Restart with new roles") {
        players = startPlayers.slice();
        handlePlayerInfo();
        selectWords();
        addPlayerElements();
        displayPlayerInfo();
    } else {
        for (let i = 0; i < parseInt(playerCountInput.value); i++) {
            const playerElement = document.querySelector(`#name-${i}`);
            const playerSubmitButton = document.querySelector(`#role-names-${i}`);
            if (playerElement.value == "" || playerSubmitButton.textContent == "Submit") {
                flag = 1;
                break;
            }
        }
        if (flag == 1) {
            const errorMessage = createErrorParagraph("All player names must be filled and submited");
            modal.insertBefore(errorMessage, modal.firstChild);
            modal.showModal();
        } else {
            startGame.textContent = "Restart with new roles";
            startPlayers = players.slice();
            displayPlayerInfo();
        }
    }
    if (flag == 0) {
        disableNameInputs();
    }

});

function showHideButtonsFunction(button) {
    const id = button.id.substring("role-names-".length);
    let player = findPlayerById(id);
    let flag = 0;
    if (button.textContent == "Submit") {
        const nameInput = document.querySelector(`#name-${id}`).value;
        if (nameInput != "") {
            player.name = nameInput;
            button.textContent = "Show word";
        } else {
            const p = createErrorParagraph("Please enter a name");
            modal.insertBefore(p, modal.firstChild);
            modal.showModal();
            flag = 1;
        }
    }
    if (flag != 1) {
        const roleMessage = createRoleParagraph(player.word);
        modal.insertBefore(roleMessage, modal.firstChild);
        modal.showModal();
    }

}

function findPlayerById(id) {
    for (let player of players) {
        if (player.id == id) {
            return player;
        }
    }
    return null;
}

function findPlayerIndexById(id) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == id) {
            return i;
        }
    }
    return null;
}

function generateRoles() {
    const playerCount = parseInt(playerCountInput.value);
    const mrWhiteCount = parseInt(mrWhiteCountInput.value);
    const undercoverCount = parseInt(undercoverCountInput.value);
    const roles = [];
    for (let i = 0; i < mrWhiteCount; i++) {
        roles.push("MrWhite");
    }
    for (let i = 0; i < undercoverCount; i++) {
        roles.push("Undercover");
    }
    for (let i = roles.length; i < playerCount; i++) {
        roles.push("Citizen");
    }
    // Fisher-Yates (Knuth) shuffle algorithm
    shuffleArray(roles);
    return roles;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createErrorParagraph(message) {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = message;
    errorMessage.classList.add("error-message");
    return errorMessage;
}

function createRoleParagraph(role) {
    const roleMessage = document.createElement('p');
    roleMessage.textContent = role;
    roleMessage.classList.add("role-message");
    return roleMessage;
}

function createConfirmationModal(player) {
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
    <div class="centered-div">
    <button class="green-button" id="close-modal">Yes</button>
    <button class="red-button" id="close-modal">No</button>
    </div>`;
    return dialog;
}

function changeTurns(playerRemoved) {
    const indexFrom = findPlayerIndexById(playerRemoved.id) + 1;
    //for (let i = indexFrom; i < players.length; i++)
    for (let i = 0; i < players.length; i++) {
        let player = players[i];
        if (player.placement > playerRemoved.placement) {
            player.placement -= 1;
            const labelSelector = document.querySelector(`label[for="name-${player.id}-turn"]`);
            labelSelector.textContent = `Turn: ${player.placement}`;
        }
    }
    players.splice(indexFrom - 1, 1);
}

function removePlayer(icon) {
    let id = icon.id.substring("remove-icon-".length);
    let player = findPlayerById(id);
    let confirmationModal = createConfirmationModal();
    document.body.appendChild(confirmationModal);
    confirmationModal.insertBefore(createErrorParagraph(`Are you sure u want to remove player ${player.name}`), confirmationModal.firstChild);
    // Add event listener to the "Yes" button
    confirmationModal.querySelector(".green-button").addEventListener("click", function () {
        // Logic for "Yes" button
        document.querySelector(`#player-${player.id}`).remove();
        confirmationModal.querySelector("p").remove();
        // Perform the removal logic here
        confirmationModal.close();
        confirmationModal.remove();
        const p = createErrorParagraph(`${player.role} has been voted out`);
        modal.insertBefore(p, modal.firstChild);
        modal.showModal();
        changeTurns(player);
    });
    // Add event listener to the "No" button
    confirmationModal.querySelector(".red-button").addEventListener("click", function () {
        // Logic for "No" button
        confirmationModal.querySelector("p").remove();
        confirmationModal.close();
        confirmationModal.remove();
    });
    confirmationModal.showModal();
}

function createPlayerElement(player) {
    let showHideOrSubmit;
    if (player.name == "") {
        showHideOrSubmit = "Submit";
    } else {
        showHideOrSubmit = "Show word";
    }
    const newPlayerContainer = document.createElement('div');
    newPlayerContainer.innerHTML = `
            <div class="new-player-container" id="player-${player.id}">
                <li>
                    <div>
                        <label for="name-${player.id}">Name:</label>
                        <textarea name="name-${player.id}" id="name-${player.id}">${player.name}</textarea>
                        <button class="show-hide" id="role-names-${player.id}" onclick=showHideButtonsFunction(this)>${showHideOrSubmit}</button>
                        <label for="name-${player.id}-turn" style="margin-left:30px"></label>
                        <i class="fas fa-times" id= "remove-icon-${player.id}" onclick="removePlayer(this)" style="color: red; font-size: 20px; background-color: white; padding: 5px; border-radius: 50%; display:none"></i>
                    </div>
                </li>
            </div>
        `;
    return newPlayerContainer;
}