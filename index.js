// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2504-Lim"; // Make sure to change this!
const API = BASE + COHORT;
async function main() {
  // === Fetch Players ===
  const response = await fetch(API + "/players");
  const json = await response.json();
  const players = json.data.players;

  // logs all the players by creating a loop
  console.log("Players:", players);

  // We can create a card for each player by using the lopp method here. if we dont know how many players there are, we can use the players.lenth to loop through all the players
  for (let i = 0; i < players.length; i++) {
    createPlayerhtml(players[i]);
  }
}
main();

function createPlayerhtml(player) {
  /* connecting all the elements */
  const div = document.createElement("div");
  const img = document.createElement("img");
  const p = document.createElement("p");
  div.append(img, p);
  document.body.append(div);

  /* img content */
  img.src = player.imageUrl;
  img.alt = player.name; /* <img src=/ alt= > */
  img.width = 100;
  img.height = 100;

  /* p content */
  p.textContent = `${player.name} ${player.breed} ${player.teamId}`;

  // Adding event listener so that when someone clicks on the player, it shows the details
  div.addEventListener("click", () => showDetails(player));
  // This will call the showDetails function and pass the player object to it
}

function showDetails(player) {
  const oldDetails = document.querySelector(".details");
  if (oldDetails) oldDetails.remove();

  // Initially, I only had function showDetails(player) { , but when i clicked on the player, it would show
  // the details but the old details would still be there and overlay on top of the new details.

  // So I added the const oldDetails = document.querySelector(".details"); and if (oldDetails) oldDetails.remove();
  // to remove the previous details before showing the new one.So it doesnt look as messy and details dont overlay on top of each other.

  // So now we're creating the containers for the details.
  const div = document.createElement("div");
  div.classList.add("details");

  // These are the elements/child that will be shown in the details section.
  const img = document.createElement("img");
  const name = document.createElement("p");
  const id = document.createElement("p");
  const breed = document.createElement("p");
  const status = document.createElement("p");
  const teamName = document.createElement("p");

  // we got the players information from the API / players
  div.append(img, name, id, breed, status, teamName);
  document.querySelector("#details").append(div);
  // doing document.querySelector("#details") will let the players details be shown in the <div id="details"></div> section in our HTML file.

  /* img content */
  img.src = player.imageUrl;
  img.alt = player.name; /* <img src=/ alt= > */
  img.width = 100;
  img.height = 100;

  /* p content (name, id, breed, status, teamName/unassigned */
  name.textContent = player.name;
  id.textContent = player.id;
  breed.textContent = player.breed;
  status.textContent = player.status;
  teamName.textContent = player.teamId ? player.teamId : "Unassigned";

  /** name
   * id
   * breed
   * status
   * image
   * teamName (or unassigned)
   *
   */

  //So now we're creating the Remove button to the detial section so that when we click on the player, it shows the details and also a button to remove the player.
  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove Player";
  div.append(removeButton);
  // So we're creating a new button element and setting its text to "remove player".
  // Then we can add the new data to the existing structure by appending this button to the div that contains the player's details.

  removeButton.addEventListener("click", async () => {
    //So we'll try to attempt some code to remove the player from the API and if it fails, we'll catch the error and log it to the console.
    try {
      await fetch(`${API}/players/${player.id}`, { method: "DELETE" });
      // Remove button for event listener
      // This will trigger when the remove button only when the user clicks the button. So when you're clicking on the new players, it will ask for confirmation before removing the player.
      // So we're removing the player from the API

      div.remove();
      // this will clear the details from the screen after the player is no longer needed.

      document
        .querySelectorAll("body > div")
        .forEach((playerDiv) => playerDiv.remove());
      // This will remove all the players from the screen after the player is no longer needed.

      const response = await fetch(API + "/players");
      const json = await response.json();
      const players = json.data.players;
      //So since we need to make sure that the players are updated after removing a player, we need to fetch the players again and update the screen with the new players.

      for (let i = 0; i < players.length; i++) {
        createPlayerhtml(players[i]);
      }
    } catch (error) {
      console.error("Failed to remove puppy:", error);
    }
    //Adding this loop again will allow us to see the players again after removing the players and updating the screen with the new players.
  });
}
//Lets add the new playerPuppy button so that we can add new players to the rosters.
const addPlayerButton = document.querySelector("#addPlayerButton");

//This will allow us to add new players to the roster by clicking on the "Add Player" button.
//Using async, We're sending signal to the API to add a new player with the details provided in the form.
addPlayerButton.addEventListener("click", async () => {
  //Whatever we type in the form will be sent to the API to add a new player.
  const form = document.querySelector("#addPlayerForm");

  const name = form.name.value;
  const breed = form.breed.value;

  //These will be the new players details that we will be sending to the API.
  const newPlayer = {
    name: name,
    breed: breed,
  };

  try {
    //So we're sending a POST request to the API to add a new player with the details provided in the form.
    const response = await fetch(API + "/players", {
      method: "POST", //POST is basically used to make something new, like adding a new player.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPlayer), //This will convert the newPlayer object to a JSON string so that it can be sent to the API.
    });

    if (!response.ok) {
      throw new Error("Failed to add new player"); // If the response is not ok, we throw an error.
    }

    const getPlayers = await fetch(API + "/players");
    const json = await getPlayers.json();
    const players = json.data.players;
    1;

    document.querySelector("#roster").innerHTML = "";

    for (let i = 0; i < players.length; i++) {
      createPlayerhtml(players[i]);
    }

    form.reset();
  } catch (error) {
    console.error("Error adding new player:", error);
  }
});
