// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2504-Lim";
const API = BASE + COHORT;
async function main() {
  const response = await fetch(API + "/players");
  const json = await response.json();
  const players = json.data.players;

  console.log("Players:", players);

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

  div.addEventListener("click", () => showDetails(player));
}

function showDetails(player) {
  const oldDetails = document.querySelector(".details");
  if (oldDetails) oldDetails.remove();

  const div = document.createElement("div");
  div.classList.add("details");

  const img = document.createElement("img");
  const name = document.createElement("p");
  const id = document.createElement("p");
  const breed = document.createElement("p");
  const status = document.createElement("p");
  const teamName = document.createElement("p");

  div.append(img, name, id, breed, status, teamName);
  document.querySelector("#details").append(div);

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

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove Player";
  div.append(removeButton);

  removeButton.addEventListener("click", async () => {
    try {
      await fetch(`${API}/players/${player.id}`, { method: "DELETE" });

      div.remove();

      document
        .querySelectorAll("body > div")
        .forEach((playerDiv) => playerDiv.remove());

      const response = await fetch(API + "/players");
      const json = await response.json();
      const players = json.data.players;

      for (let i = 0; i < players.length; i++) {
        createPlayerhtml(players[i]);
      }
    } catch (error) {
      console.error("Failed to remove puppy:", error);
    }
  });
}
const addPlayerButton = document.querySelector("#addPlayerButton");

addPlayerButton.addEventListener("click", async () => {
  const form = document.querySelector("#addPlayerForm");

  const name = form.name.value;
  const breed = form.breed.value;

  const newPlayer = {
    name: name,
    breed: breed,
  };

  try {
    const response = await fetch(API + "/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPlayer),
    });

    if (!response.ok) {
      throw new Error("Failed to add new player");
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
