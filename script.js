const API_KEY_CALNINJA = "+40cLeSyYNm+60Js9fxkGg==5SSiByY4Ft03WQeF";
const API_KEY_EDAMAM = "36fcabf8a939ed1dabc9f136b3c4910a";
const EDAMAM_ID = "571e06f8";
const foodNameEl = document.querySelector("#food-name");

const searchFormEl = document.querySelector("#searchForm");
const calorieValueEl = document.querySelector("#calorieValue");
const energyEl = document.querySelector("#energy");
const fatEl = document.querySelector("#fat");
const sugarEl = document.querySelector("#sugar");
const sodiumEl = document.querySelector("#sodium");

const formSubmitHandler = (event) => {
  event.preventDefault();

  var foodName = foodNameEl.value.trim();
  if (foodName) {
    getFood(foodName);
  } else {
    console.log("Select a food");
  }
};

const getFood = (food) => {
  const apiUrl = `https://api.edamam.com/api/nutrition-data?app_id=${EDAMAM_ID}&app_key=${API_KEY_EDAMAM}&ingr=${food}`;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        console.error("Error: ", response.statusText);
      }
    })
    .then(function (data) {
      displayData(data);
      console.log(data);
    })
    .catch(function (error) {
      console.log(error);
    });
};

// const displayCalories (food);
const displayData (food) => {
    
}



searchFormEl.addEventListener("submit", formSubmitHandler);
