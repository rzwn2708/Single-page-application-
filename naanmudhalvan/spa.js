const searchBox = document.getElementById('search-box');
const recipesContainer = document.getElementById('recipes');
const modal = document.getElementById('recipe-modal');
const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-image');
const modalIngredients = document.getElementById('modal-ingredients');
const modalInstructions = document.getElementById('modal-instructions');
const closeBtn = document.querySelector('.close-btn');

// Function to fetch recipes
async function fetchRecipes(query = 'chicken') {
    recipesContainer.innerHTML = `<p style="text-align:center;">Loading...</p>`;
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await response.json();
        displayRecipes(data.meals);
    } catch (error) {
        recipesContainer.innerHTML = `<p style="text-align:center;">Error fetching recipes!</p>`;
        console.error(error);
    }
}

// Display recipes
function displayRecipes(meals) {
    if (!meals) {
        recipesContainer.innerHTML = `<p style="text-align:center;">No recipes found!</p>`;
        return;
    }
    recipesContainer.innerHTML = '';
    meals.forEach(meal => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
        `;
        card.addEventListener('click', () => showModal(meal));
        recipesContainer.appendChild(card);
    });
}

// Show modal
function showModal(meal) {
    modalTitle.textContent = meal.strMeal;
    modalImage.src = meal.strMealThumb;
    modalIngredients.innerHTML = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient) {
            const li = document.createElement('li');
            li.textContent = `${ingredient} - ${measure}`;
            modalIngredients.appendChild(li);
        }
    }
    modalInstructions.textContent = meal.strInstructions;
    modal.style.display = 'flex';
}

// Close modal
closeBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
});

// Search functionality
searchBox.addEventListener('keyup', () => {
    const query = searchBox.value.trim();
    if (query.length > 0) {
        fetchRecipes(query);
    }
});

// Initial load
fetchRecipes();
