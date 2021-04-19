const API_KEY_CALNINJA = '+40cLeSyYNm+60Js9fxkGg==5SSiByY4Ft03WQeF';
const API_KEY_EDAMAM = '36fcabf8a939ed1dabc9f136b3c4910a';
const EDAMAM_ID = '571e06f8';

const foodNameEl = document.querySelector('#food-name');
const tableDataEl = document.querySelector('.table-data');
const searchFormEl = document.querySelector('#searchForm');
const calorieValueEl = document.querySelector('#calorieValue');
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
        .then(function (jsonResponse) {
            const foodItem = {
                name: foodName,
                fat: jsonResponse.totalNutrients.FAT.quantity.toFixed(3),
                sodium: jsonResponse.totalNutrients.NA.quantity.toFixed(3),
                sugar: jsonResponse.totalNutrients.SUGAR.quantity.toFixed(3),
            };
            updateItems(foodItem);
            displayNutrientsData(jsonResponse.totalNutrients);
            console.log(jsonResponse);
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
            calorieValueEl.innerHTML = ` ${data.items[0].calories}kcal`;
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

const displayNutrientsData = (totalNutrients) => {
    fatEl.innerHTML = ` ${totalNutrients.FAT.quantity.toFixed(3)}g`;
    sodiumEl.innerHTML = ` ${totalNutrients.NA.quantity.toFixed(3)}g`;
    sugarEl.innerHTML = ` ${totalNutrients.SUGAR.quantity.toFixed(3)}g`;
};

const renderItems = () => {
    const items = getItems();
    var totalCalories = 0;
    var totalSugar = 0;
    var totalFat = 0;
    var totalSodium = 0;

    let html = '';
    items.forEach((item) => {
        totalCalories += Number(item.calories);
        totalSugar += Number(item.sugar);
        totalFat += Number(item.fat);
        totalSodium += Number(item.sodium);

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
            <td class="py-3 px-6 text-center">
                <button class="remove" data-name="${item.name}">&#10005</button>
            </td>      
        </tr>
        `;
    });
    tableDataEl.innerHTML = html;
    console.log(totalCalories);
    console.log(totalSugar);

    document.querySelector('#totalCalories').innerHTML = totalCalories.toFixed(3);
    document.querySelector('#totalSugar').innerHTML = totalSugar.toFixed(3);
    document.querySelector('#totalFat').innerHTML = totalFat.toFixed(3);
    document.querySelector('#totalSodium').innerHTML = totalSodium.toFixed(3);
};

const removeItem = (foodName) => {
    const currentItems = getItems();
    const newItems = currentItems.filter((currentItem) => {
        return currentItem.name !== foodName;
    });
    const encodeItems = JSON.stringify(newItems);
    localStorage.setItem('items', encodeItems);
    renderItems();
};

renderItems();
searchFormEl.addEventListener('submit', formSubmitHandler);

document.addEventListener('click', (event) => {
    if (event.target.matches('.remove')) {
        event.preventDefault();
        const name = event.target.dataset.name;
        removeItem(name);
    }
});
