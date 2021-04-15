const API_KEY_CALNINJA = '+40cLeSyYNm+60Js9fxkGg==5SSiByY4Ft03WQeF';
const API_KEY_EDAMAM = '36fcabf8a939ed1dabc9f136b3c4910a';
const EDAMAM_ID = '571e06f8';
const foodNameEl = document.querySelector('#food-name');
const tableDataEl = document.querySelector('.table-data');
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
    const currentItems = getItems();
    let newItems = [];
    if (currentItems.some((current) => item.name === current.name)) {
        newItems = currentItems.map((current) => {
            if (item.name === current.name) {
                return {
                    ...current,
                    ...item,
                };
            } else {
                return current;
            }
        });
    } else {
        currentItems.push(item);
        newItems = currentItems;
    }
    const encodeItems = JSON.stringify(newItems);
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
const getFood = (foodName) => {
    const apiUrl = `https://api.edamam.com/api/nutrition-data?app_id=${EDAMAM_ID}&app_key=${API_KEY_EDAMAM}&ingr=${foodName}`;
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
                name: foodName,
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
const getCalories = (foodName) => {
    const apiUrl = `https://api.calorieninjas.com/v1/nutrition?query=${foodName}`;
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
                name: foodName,
                calories: item.calories,
            };
            updateItems(food);
            renderItems();
        })
        .catch(function (error) {
            console.log(error);
        });
};
const displayData = (food) => {
    fatEl.innerHTML += ` ${food.totalNutrients.FAT.quantity}g`;
    sodiumEl.innerHTML += ` ${food.totalNutrients.NA.quantity}g`;
    sugarEl.innerHTML += ` ${food.totalNutrients.SUGAR.quantity}g`;
};
const renderItems = () => {
    const items = getItems();
    let html = '';
    items.forEach((item) => {
        html += `
        <tr class="border-b border-gray-200 hover:bg-gray-100">
            <td class="py-3 px-6 text-left whitespace-nowrap">
                ${item.name}
            </td>
            <td class="py-3 px-6 text-left">
                ${item.calories}
            </td>
            <td class="py-3 px-6 text-center">
                ${item.sugar}
            </td>
            <td class="py-3 px-6 text-center">
                ${item.fat}
            </td>
            <td class="py-3 px-6 text-center">
                ${item.sodium}
            </td>
        </tr>
        `;
    });
    tableDataEl.innerHTML = html;
};
renderItems();
searchFormEl.addEventListener('submit', formSubmitHandler);
