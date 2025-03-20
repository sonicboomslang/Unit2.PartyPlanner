const apiUrl = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2501-FTB-ET-WEB-PT/events';

document.addEventListener('DOMContentLoaded', () => {
    createForm(); // Generate the form dynamically
    fetchParties(); // Fetch and display existing parties
});

// Function to create the form dynamically
function createForm() {
    const container = document.querySelector('.container');

    const form = document.createElement('form');
    form.id = 'party-form';

    form.innerHTML = `
        <input type="text" name="name" placeholder="Party Name" required>
        <input type="date" name="date" required>
        <input type="time" name="time" required>
        <input type="text" name="location" placeholder="Location" required>
        <textarea name="description" placeholder="Description" required></textarea>
        <button type="submit">Add Party</button>
    `;

    container.insertBefore(form, container.children[1]); // Insert before the party list

    // Add event listener to handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const partyData = Object.fromEntries(formData);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(partyData)
        });

        if (response.ok) {
            fetchParties(); // Refresh the party list
            e.target.reset(); // Clear the form
        } else {
            alert('Error adding party');
        }
    });
}

// Fetch and display parties
async function fetchParties() {
    const response = await fetch(apiUrl);
    const { data: parties } = await response.json(); // API returns data inside an object
    renderParties(parties);
}

// Render parties to the page
function renderParties(parties) {
    const partyList = document.getElementById('party-list');
    partyList.innerHTML = ''; // Clear previous content

    parties.forEach(party => {
        const partyElement = document.createElement('div');
        partyElement.classList.add('party');

        partyElement.innerHTML = `
            <h3>${party.name}</h3>
            <p><strong>Date:</strong> ${party.date} at ${party.time}</p>
            <p><strong>Location:</strong> ${party.location}</p>
            <p>${party.description}</p>
            <button class="delete-btn" onclick="deleteParty('${party.id}')">Delete</button>
        `;

        partyList.appendChild(partyElement);
    });
}

// Delete a party
async function deleteParty(id) {
    const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        fetchParties(); // Refresh the list
    } else {
        alert('Error deleting party');
    }
}
