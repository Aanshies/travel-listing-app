document.addEventListener('DOMContentLoaded', () => {
    const addForm = document.getElementById('addDestinationForm');

    // Handle adding a destination
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const image = document.getElementById('image').value.trim();
            const price = parseFloat(document.getElementById('price').value);
            const description = document.getElementById('description').value.trim();

            const newDestination = { name, image, price, description };

            let destinations = JSON.parse(localStorage.getItem('destinations')) || [];
            destinations.push(newDestination);
            localStorage.setItem('destinations', JSON.stringify(destinations));

            window.location.href = 'index.html';
        });
    }

    const container = document.getElementById('cards-container');
    if (container) {
        function displayDestinations(destinations) {
            container.innerHTML = '';
            if (destinations.length === 0) {
                container.innerHTML = `<p style="text-align:center;">No destinations available.</p>`;
                return;
            }

            destinations.forEach((dest, index) => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="${dest.image}" alt="${dest.name}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image';">
                    <div class="card-content">
                        <h3>${dest.name}</h3>
                        <p>Price: $${dest.price}</p>
                        <p>${dest.description}</p>
                        <button class="delete-btn" data-index="${index}">Delete</button>
                    </div>
                `;
                container.appendChild(card);
            });

            // Attach delete functionality
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const index = this.getAttribute('data-index');
                    deleteDestination(index);
                });
            });
        }

        function deleteDestination(index) {
            let destinations = JSON.parse(localStorage.getItem('destinations')) || [];
            destinations.splice(index, 1);
            localStorage.setItem('destinations', JSON.stringify(destinations));
            displayDestinations(destinations);
        }

        function applyFilters() {
            const nameFilter = document.getElementById('filter-name').value.toLowerCase();
            const minPrice = parseFloat(document.getElementById('filter-min-price').value) || 0;
            const maxPrice = parseFloat(document.getElementById('filter-max-price').value) || Infinity;
            const placeFilter = document.getElementById('filter-place').value.toLowerCase();

            let destinations = JSON.parse(localStorage.getItem('destinations')) || [];
            const filtered = destinations.filter(dest =>
                dest.name.toLowerCase().includes(nameFilter) &&
                dest.price >= minPrice &&
                dest.price <= maxPrice &&
                dest.description.toLowerCase().includes(placeFilter)
            );

            displayDestinations(filtered);
        }

        // Attach filter button
        document.getElementById('filter-button').addEventListener('click', applyFilters);

        // Display on load
        const storedDestinations = JSON.parse(localStorage.getItem('destinations')) || [];
        displayDestinations(storedDestinations);
    }
});
