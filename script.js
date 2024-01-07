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
    ["Tree", "Bush", ""],
    ["Ocean", "Sea", "Lake"],
    ["Dog", "Puppy", "Canine"]
]
var numberInputs = document.querySelectorAll('input[type="number"]');
let playerRoles = [];
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
                const playerElement = createPlayerElement(i);
                playerAdditionList.appendChild(playerElement);
                playerRoles.push("");
            }
            numberInputs.forEach(function (input) {
                input.disabled = true;
            });
            addPlayersButton.textContent = "Restart";
            playerAdditionDiv.hidden = false;
            playerRoles = generateRoles();
            addShowHideButtons();
        }
    } else if (addPlayersButton.textContent == "Restart") {
        location.reload();
    }
});
closeModal.addEventListener("click", () => {
    modal.close();
    modal.innerHTML = "";
    modal.appendChild(closeModal); // Add the button back to the modal
});
startGame.addEventListener("click", () => {
    const flag = 0;
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

    }
});

function addShowHideButtons() {
    const showHideButtons = document.querySelectorAll(".show-hide");
    showHideButtons.forEach(function (button) {
        button.addEventListener("click", () => {
            if (button.textContent == "Submit") {
                button.textContent = "Show role";
            }
            const id = button.id.substring("role-names-".length);
            const roleMessage = createRoleParagraph(playerRoles[id]);
            modal.insertBefore(roleMessage, modal.firstChild);
            modal.showModal();
        })
    })
}

function generateRoles() {
    const playerCount = parseInt(playerCountInput.value);
    const mrWhiteCount = parseInt(mrWhiteCountInput.value);
    const undercoverCount = parseInt(undercoverCountInput.value);

    const roles = [];
    for (let i = 0; i < mrWhiteCount; i++) {
        roles.push("mrWhite");
    }
    for (let i = 0; i < undercoverCount; i++) {
        roles.push("undercover");
    }
    for (let i = roles.length; i < playerCount; i++) {
        roles.push("citizen");
    }

    // Fisher-Yates (Knuth) shuffle algorithm
    for (let i = roles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [roles[i], roles[j]] = [roles[j], roles[i]];
    }
    return roles;
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

function createPlayerElement(playerNumber) {
    const newPlayerContainer = document.createElement('div');
    newPlayerContainer.innerHTML = `
            <div class="new-player-container">
                <li>
                    <div>
                        <label for="name-${playerNumber}">Name:</label>
                        <textarea name="name-${playerNumber}" id="name-${playerNumber}">a</textarea>
                        <button class="show-hide" id="role-names-${playerNumber}">Submit</button>
                    </div>
                </li>
            </div>
        `;
    return newPlayerContainer;
}