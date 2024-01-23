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
const wordList = [
    ["Kuciene", "Zaveckas", "Kukauskiene"],
    ["Tree", "Bush", "Trench"],
    ["Ocean", "Sea", "Lake"],
    ["Dog", "Puppy", "Canine"]
]
console.log(wordList);
let citizenWord = "";
let undercoverWord = "";
var numberInputs = document.querySelectorAll('input[type="number"]');
let players = [];
let startPlayers = [];
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
        } while (wordList[categoryIndex].length < 2)

        let word1Index, word2Index;
        do {
            word1Index = Math.floor(Math.random() * wordList[categoryIndex].length * 0.999);
            word2Index = Math.floor(Math.random() * wordList[categoryIndex].length * 0.999);
        } while (word1Index === word2Index);
        citizenWord = wordList[categoryIndex][word1Index];
        undercoverWord = wordList[categoryIndex][word2Index];
        updateWords();
        wordList[categoryIndex].splice(word1Index, 1);
        wordList[categoryIndex].splice(word2Index, 1);
        if (wordList[categoryIndex].length < 2) {
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
            if (playerElement.value == "") {
                flag = 1;
                break;
            }
        }
        if (flag == 1) {
            const errorMessage = createErrorParagraph("All player names must be filled");
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
            button.textContent = "Show role";
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