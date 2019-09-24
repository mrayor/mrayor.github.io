// Define UI Variables
const addApplianceButton = document.querySelector("#add-appliance");
const form = document.querySelector("#calc-form");
const resetButton = document.querySelector("#reset");
const calculateButton = document.querySelector("#calculate");
const result = document.querySelector(".main__left");

//Global Declarations
let units = [];
let hours = [];
// console.log(unitValues);
//Event Listeners

loadEventListeners();
function loadEventListeners() {
  addApplianceButton.addEventListener("click", addAppliance);
  form.addEventListener("click", removeAppliance);
  resetButton.addEventListener("click", reset);
  calculateButton.addEventListener("click", calculate);
}

function addAppliance(e) {
  //markup for forms
  let markUp = `<div class="column ">
                  <label for="name">Appliance Name</label>
                  <input type="text" name="name" id="" required />
                </div>
                <div class="column unit-field">
                  <label for="unit">Unit Watt</label>
                  <input type="number" name="unit" id="" required />
                </div>
                <div class="column hour-field">
                  <label for="hours">Number of Hours</label>
                  <input type="number" name="hour" id="" required />
                </div>
                <div class="column">
                  <label for="">&nbsp;</label>
                  <a href="#" class="delete" id="clear"
                    ><i class="fas fa-minus-circle fa-2x m-t-small"></i
                  ></a>
                </div>`;
  //create div
  let div = document.createElement("div");
  div.className = "row";
  div.innerHTML = markUp;
  form.appendChild(div);
  e.preventDefault();
}

//Remove Appliance
function removeAppliance(e) {
  if (e.target.parentElement.classList.contains("delete")) {
    e.target.parentElement.parentElement.parentElement.remove();
  }
}

//Clear
function reset() {
  window.location.href = "index.html";
}

function getUnits() {
  //get units

  const unitValues = Array.from(document.querySelectorAll('[name="unit"]'));
  let unitArrayValues = unitValues.map(unitValue => unitValue.value);

  unitArrayValues.forEach(unitValue => {
    if (unitValue === "" || unitValue <= 0) {
      if (!alert("Units cannot be empty, zero or negative")) {
        window.location.reload();
      }
      //   alert("Units cannot be empty, zero or negative");
      //   return;
    }

    units.push(unitValue);
    console.log(units);
    unitValue = "";
  });
}
function getHours() {
  const hourValues = Array.from(document.querySelectorAll('[name ="hour"]'));
  let hourArrayValues = hourValues.map(hourValue => hourValue.value);

  hourArrayValues.forEach(hourValue => {
    if (hourValue === "" || hourValue <= 0 || hourValue > 24) {
      if (!alert("Hour cannot be empty and must be between 0 and 24")) {
        window.location.reload();
      }
      //   alert("Hour cannot be empty and must be between 0 and 24");
      //   return;
    }

    hours.push(hourValue);
    hourValue = "";
  });
}

// function resetAppliance() {
//   //reset appliance name
//   const applianceNames = Array.from(document.querySelectorAll('[name="name"]'));
//   let applianceArrayNames = applianceNames.map(
//     applianceName => applianceName.value
//   );

//   applianceArrayNames.forEach(nameValue => {

//     nameValue = "";
//   });
// }

//Calculate Solar
function calculate(e, url) {
  //call get hour and get unit functions
  getHours();
  getUnits();
  //get watt hour array
  const wattHourArray = units.map(function(unit, index) {
    return hours[index] * unit;
  });

  const totalWattHour = wattHourArray.reduce((acc, val) => acc + val, 0);
  let readingPerMonth = Math.floor((totalWattHour / 1000) * 30).toString();
  console.log(readingPerMonth);

  if (readingPerMonth === "0" || readingPerMonth === "NaN") {
    readingPerMonth = "";
    return;
  }
  //diplay in the ui
  let markUp = `<div class="header"><h1 class="header__logo">KARMA</h1></div>
                <div class="main__left-content">
                <h1 class="header__primary">Your result is <span>${readingPerMonth} kwh</span></h1>
                <p class="header__secondary">
                     per month
                 </p>
                
                </div>`;
  let div = document.createElement("div");
  result.innerHTML = "";
  div.innerHTML = markUp;
  result.appendChild(div);
  units = [];
  hours = [];

  e.preventDefault();
}

function goto(url) {
  window.location = url;
}
