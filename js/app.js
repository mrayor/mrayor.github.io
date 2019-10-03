// Define UI Variables
const dropdown = document.querySelector(".appliance-dropdown");
const addApplianceButton = document.querySelector("#add-appliance");
const form = document.querySelector("#calc-form");
const resetButton = document.querySelector("#reset");
const calculateButton = document.querySelector("#calculate");
const result = document.querySelector(".main__left-content");

//api
const apiUrl = "https://json-server-hng.herokuapp.com/db";

//load event listeners
loadEventListeners();
function loadEventListeners() {
  addApplianceButton.addEventListener("click", addAppliance);
  form.addEventListener("click", removeAppliance);
  resetButton.addEventListener("click", reset);
  calculateButton.addEventListener("click", calculate);
}

//fetch data from api
const fetchData = async () => {
  let response = await fetch(apiUrl);
  let data = await response.json();
  return data;
};

//dropdown

dropdown.length = 0;

let defaultOption = document.createElement("option");
defaultOption.text = "Choose Appliance";

dropdown.add(defaultOption);
dropdown.selectedIndex = 0;

const init = async () => {
  let appliancesObject = await fetchData();
  const { appliances } = appliancesObject;
  let option;
  for (let i = 0; i < appliances.length; i++) {
    option = document.createElement("option");
    option.text = appliances[i].name;
    option.value = appliances[i].id;
    dropdown.add(option);
  }
};
init();

$(document).ready(function() {
  $("select").select2({
    width: "resolve",
    templateSelection: formatState
  });
  $("select").on("select2:select", async e => {
    let applianceData = await fetchData();
    const { appliances } = applianceData;
    let applianceArray = Array.from(appliances);
    let data = e.params.data;
    const getappliance = applianceArray.find(
      appliance => appliance.name === data.text
    );
    document.querySelector("[name=quantity]").value = 1;
    document.querySelector("[name=unit]").value = getappliance.units;
    document.querySelector("[name=hour]").value = 1;
  });
});

function formatState(state) {
  if (!state.id) {
    return state.text;
  }
  let $state = $("<span><span></span></span>");
  $state.find("span").text(state.text);
  return $state;
}

//set counters and increment function
let a = 0,
  b = 0,
  c = 0;
function incrementCount() {
  a++;
  b++;
  c++;
}

async function addAppliance(e) {
  e.preventDefault();

  incrementCount();
  let div = document.createElement("div");
  div.className = "row";

  let dropdown = document.querySelector(".appliance-dropdown");

  let defaultOption = document.createElement("option");
  defaultOption.text = "Choose Appliance";

  let data = await fetchData();
  const { appliances } = data;
  let option;
  for (let i = 0; i < appliances.length; i++) {
    option = document.createElement("option");
    option.text = appliances[i].name;
    option.value = appliances[i].id;
    dropdown.add(option);
  }

  form.insertAdjacentHTML(
    "beforeend",

    `<div class="row">
    <div class="column">
                  <label for="name">Appliance Name</label>
                  

                  <select class="input appliance-dropdown test${a}" name="appliance">
                  ${Object.keys(dropdown).map(
                    value =>
                      `<option value="${value}">${dropdown[value].text}</option>`
                  )}
                  </select>
                </div>
                <div class="column">
                  <label for="quantity">Quantity</label>
                  <input
                    class="input"
                    type="number"
                    name="quantity${a}"
                    data-name="quantity"
                    id=""
                    required
                  />
                </div>
                <div class="column">
                  <label for="unit">Unit Watt</label>
                  <input
                    class="input"
                    type="number"
                    name="unit${b}"
                    data-name="unit"
                    id=""
                    required
                  />
                </div>
                <div class="column">
                  <label for="hours">Number of Hours</label>
                  <input
                    class="input"
                    class="number"
                    type="number"
                    name="hour${c}"
                    data-name="hour"
                    id=""
                    required
                  />
                </div>
                <div class="column ">
                  <label for="">&nbsp;</label>
                  <a href="#" class="delete" id="clear"
                    ><i class="fas fa-minus-circle fa-2x m-t-small"></i
                  ></a>
                </div>
                </div>`
  );

  $(document).ready(function() {
    $(".test" + a).select2({
      width: "resolve",
      templateSelection: formatState,
      style: "width: 100%"
    });
    $(".test" + a).on("select2:select", async e => {
      let applianceData = await fetchData();
      const { appliances } = applianceData;
      let applianceArray = Array.from(appliances);
      let data = e.params.data;
      const getappliance = applianceArray.find(
        appliance => appliance.name === data.text
      );
      document.querySelector(`[name=quantity${a}]`).value = 1;
      document.querySelector(`[name=unit${b}]`).value = getappliance.units;
      document.querySelector(`[name=hour${c}]`).value = 1;
    });
  });
}

//Remove Appliance
function removeAppliance(e) {
  if (e.target.parentElement.classList.contains("delete")) {
    e.target.parentElement.parentElement.parentElement.remove();
  }
}

//Reset
function reset() {
  window.location.href = "index.html";
}

//get units
function getUnits() {
  const unitValues = Array.from(
    document.querySelectorAll('[data-name="unit"]')
  );
  let unitArrayValues = unitValues.map(unitValue => unitValue.value);
  unitArrayValues.forEach(val => {
    if (val < 0) {
      throw alert("Units value cannot be negative");
    }
  });
  return unitArrayValues;
}
//get qty
function getQty() {
  const qtyValues = Array.from(
    document.querySelectorAll('[data-name="quantity"]')
  );
  let qtyArrayValues = qtyValues.map(qtyValue => qtyValue.value);
  qtyArrayValues.forEach(val => {
    if (val < 0) {
      throw alert("Quantity value cannot be negative");
    }
  });
  return qtyArrayValues;
}
//get hrs
function getHours() {
  const hourValues = Array.from(
    document.querySelectorAll('[data-name="hour"]')
  );
  let hourArrayValues = hourValues.map(hourValue => hourValue.value);
  hourArrayValues.forEach(val => {
    if (val < 0 || val > 24) {
      throw alert("Hours must be between 1 and 24");
    }
  });
  return hourArrayValues;
}

//Calculate Solar
function calculate(e) {
  e.preventDefault();
  let units = getUnits();
  let qty = getQty();
  let hours = getHours();

  //get total watthour array
  const wattHourArray = units.map(function(unit, index) {
    return qty[index] * hours[index] * unit;
  });

  const totalWattHour = wattHourArray.reduce((acc, val) => acc + val, 0);
  let readingPerMonth = Math.round((totalWattHour / 1000) * 30).toString();

  if (readingPerMonth === "0" || readingPerMonth === "NaN") {
    let markUp = `<h1 class="header__primary">Please Select an <span> Appliance</span></h1>`;
    let div = document.createElement("div");
    result.innerHTML = "";
    div.innerHTML = markUp;
    result.appendChild(div);
    return;
  }

  //diplay in the ui
  let markUp = `
                 <h1 class="header__primary">Your result is <span>${readingPerMonth} kwh</span></h1>
                 <p class="header__secondary">
                      per month
                  </p>
               `;
  let div = document.createElement("div");
  result.innerHTML = "";
  div.innerHTML = markUp;
  result.appendChild(div);
}

function goto(url) {
  window.location = url;
}
