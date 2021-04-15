const API_KEY_CALNINJA = '+40cLeSyYNm+60Js9fxkGg==5SSiByY4Ft03WQeF';
const API_KEY_EDAMAM = '36fcabf8a939ed1dabc9f136b3c4910a';
const EDAMAM_ID = '571e06f8';
const foodNameEl = document.querySelector('#food-name');
const containerEl = document.querySelector('.table-data');
const searchFormEl = document.querySelector('#searchForm');
const calorieValueEl = document.querySelector('#calorieValue');
// const energyEl = document.querySelector("#energy");
const fatEl = document.querySelector('#fat');
const sugarEl = document.querySelector('#sugar');
const sodiumEl = document.querySelector('#sodium');
const getItems = () => {
    const rawItems = localStorage.getItem('items');
    const items = JSON.parse(rawItems);
    return items || [];
};
const updateItems = (item) => {
    const items = getItems();
    items.push(item);
    const encodeItems = JSON.stringify(items);
    localStorage.setItem('items', encodeItems);
};
const formSubmitHandler = (event) => {
    event.preventDefault();
    var foodName = foodNameEl.value.trim();
    if (foodName) {
        getFood(foodName);
        getCalories(foodName);
    } else {
        console.log('Select a food');
    }
};
const getFood = (food) => {
    const apiUrl = `https://api.edamam.com/api/nutrition-data?app_id=${EDAMAM_ID}&app_key=${API_KEY_EDAMAM}&ingr=${food}`;
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                console.error('Error: ', response.statusText);
            }
        })
        .then(function (data) {
            // const item = data.items[0];
            const food = {
                name: food,
                fat: data.totalNutrients.FAT.quantity,
                sodium: data.totalNutrients.NA.quantity,
                sugar: data.totalNutrients.SUGAR.quantity,
            };
            updateItems(food);
            displayData(data);
            console.log(data);
        })
        .catch(function (error) {
            console.log(error);
        });
};
const getCalories = (food) => {
    const apiUrl = `https://api.calorieninjas.com/v1/nutrition?query=${food}`;
    fetch(apiUrl, {
        headers: {
            'X-Api-Key': API_KEY_CALNINJA,
        },
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                console.error('Error: ', response.statusText);
            }
        })
        .then(function (data) {
            console.log(data);
            const item = data.items[0];
            const food = {
                name: food,
                calories: item.calories,
            };
            updateItems(food);
        })
        .catch(function (error) {
            console.log(error);
        });
};
const displayData = (food) => {
    fatEl.innerHTML += ` ${food.totalNutrients.FAT.quantity}g`;
    sodiumEl.innerHTML += ` ${food.totalNutrients.SUGAR.quantity}g`;
    sugarEl.innerHTML += ` ${food.totalNutrients.SUGAR.quantity}g`;
};
const renderItems = () => {
    const items = getItems();
    let html = '';
    items.forEach((item) => {
        html += `
            <div>
                ${item.name}
            </div>
        `;
    });
    containerEl.innerHTML = html;
};
renderItems();
searchFormEl.addEventListener('submit', formSubmitHandler);
