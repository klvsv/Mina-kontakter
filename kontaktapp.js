// En tom array för att lagra kontakterna
let contacts = [];

// Generiskt felmeddelande :o)
const error = "Du måste fylla i både namn och giltigt nummer.";

// EventListener som väntar tills DOM:en har laddats färdigt innan den kör funktioner
document.addEventListener("DOMContentLoaded", () => {
  const saveButton = document.getElementById("saveButton");
  const deleteAllButton = document.getElementById("deleteAllBtn");

  saveButton.addEventListener("click", addContact);
  deleteAllButton.addEventListener("click", confirmDeleteAllContacts);
});

// En funktion för att enbart kunna spara ett giltigt telefonnummer
function validPhone(phone) {
  return /^[0-9+\s]+$/.test(phone);
}

// Funktionen för att lägga till en kontakt i listan med giltigt nummer
function addContact() {
  const [name, phone] = ["namn", "nummer"].map((id) => document.getElementById(id).value);
  const isValidPhone = validPhone(phone);

  /* Sparar kontakten till listan, så länge namn och nummer är giltigt ifyllda
  Uppdaterar kontaktlistan för att visa tillagd kontakt samt rensar formuläret och
  eventuella felmeddelanden */
  if (name && phone && isValidPhone) {
    contacts.push({ name, phone });
    displayContacts();
    ["namn", "nummer"].forEach((id) => (document.getElementById(id).value = ""));
    clearError();
    updateDeleteAllButton();
  } else {
    // Felmeddelande om namn/nummer inte är korrekt ifyllda
    displayError(error);
  }
}

// Funktion för att visa kontaktlistan
function displayContacts() {
  const contactsList = document.getElementById("contacts");
  contactsList.innerHTML = "";

  // Loopar genom kontakter och skapar HTML-elementen för varje kontakt
  contacts.map((contact, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
          <input type="text" value="${contact.name}" disabled>
          <input type="text" value="${contact.phone}" disabled>
          <button class="editButton"><i class="fa-solid fa-pen-to-square" style="color: #ffffff;"></i></button>
          <button class="deleteButton"><i class="fa-solid fa-trash-can"></i></button>
        `;
    contactsList.appendChild(li);

    // Knapparna redigering och radering av kontakter
    const editButton = li.querySelector(".editButton");
    const deleteButton = li.querySelector(".deleteButton");
    editButton.addEventListener("click", () => editContact(index));
    deleteButton.addEventListener("click", () => deleteContact(index));
  });
}
// Funktion för att rensa inputfälten
function clearInputFields() {
  ["namn", "nummer"].forEach((id) => (document.getElementById(id).value = ""));
}

// Funktion för att rensa felmeddelandet.
function clearError() {
  document.getElementById("error").innerText = "";
}

// Funktionen för felmeddelandet
function displayError(errorMessage) {
  document.getElementById("error").innerText = errorMessage;
}

// Funktionen för att redigera en kontakt.
function editContact(index) {
  const li = document.querySelectorAll("#contacts li")[index];
  const [nameInput, phoneInput, editButton] = ["input:nth-child(1)", "input:nth-child(2)", ".editButton"].map((input) => li.querySelector(input));
  const [newName, newPhone] = [nameInput.value, phoneInput.value];

  // Om det ena eller båda fälten ej är ifyllda, visa felmeddelande
  if (!newName || !validPhone(newPhone)) {
    displayError(error);
    return;
  }

  /* Uppdaterar redigeringsläge samt ändrar texten i Ändra-knappen */
  nameInput.disabled = !nameInput.disabled;
  phoneInput.disabled = !phoneInput.disabled;

  if (!nameInput.disabled) {
    editButton.innerHTML = '<i class="fa-solid fa-floppy-disk" style="color: #ffffff;"></i>';
  } else {
    editButton.innerHTML = '<i class="fa-solid fa-pen-to-square" style="color: #ffffff;"></i>';
    saveEditedContact(index, newName, newPhone);
  }
}

// Funktion för att spara och uppdatera en redigerad kontakt
function saveEditedContact(index, newName, newPhone) {
  if (!newName || !validPhone(newPhone)) {
    displayError(error);
    return;
  }

  contacts[index] = { name: newName, phone: newPhone };
  clearError();
}

// Funktion för att inte visa "radera alla" knappen om kontaktlistan är tom
function updateDeleteAllButton() {
  document.getElementById("deleteAllBtn").disabled = contacts.length === 0;
}

// Funktion för att radera en kontakt - med bekräftelse innan man raderar
function deleteContact(index) {
  if (confirm("Är du säker på att du vill radera kontakten?")) {
    contacts.splice(index, 1); // Tar bort kontakten från listan
    displayContacts(); // Visar listan
    updateDeleteAllButton(); // Om kontaktlistan är tom - visa ingen "radera alla"-knapp
  }
}

// Funktion för att bekräfta radering av alla kontakter
function confirmDeleteAllContacts() {
  if (confirm("Det här kommer att ta bort alla kontakter. Är du säker?")) {
    deleteAllContacts();
  }
}

// Funktion för att radera alla kontakter
function deleteAllContacts() {
  contacts = []; // Tom lista
  displayContacts();
  updateDeleteAllButton();
}
