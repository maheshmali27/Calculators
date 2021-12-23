let repeater = document.querySelectorAll(".repeater");
let fieldsContainer = document.querySelector("#field-container");
let repeaterBtn = document.querySelector("#repeater-btn");
let removerBtn = document.querySelector("#remover-btn");
let resetBtn = document.querySelector("#stock-reset-btn");
let clearBtn = document.querySelector("#stock-clear-btn");
let stockCalculateBtn = document.querySelector("#stock-calculate-btn");
let stockUnit = document.querySelectorAll(".stock-unit");
let stockCost = document.querySelectorAll(".stock-cost");
let singleInvWrap = document.querySelectorAll(".stock-total-inv");


//Result DOM selection
let resTotalU = document.querySelector("#total-units");
let resAvgI = document.querySelector("#average-investment");
let resTotalI = document.querySelector("#total-investment");


let currency;

fetch('http://ip-api.com/json/')
.then(response => response.json())
.then(
    data => {
        let country = data.countryCode;
        if(country == "IN"){
            currency = "en-IN";
        }else{
            currency = "en-US";
        }
    }
);

// if (!currency) {
//     currency = "en-US";
// }
// console.log(currency);
//Container: #DFE0DF;
//Result Container: rgb(163 205 216);
//Count Num: #686868;
//1st btn: rgb(35 35 35); #fff;
//2nd: rgb(34 114 136);
//3rd: rgb(182 73 73); rgb(121 141 160)
//4th: rgb(39 83 124);
    
const intoMoney = function(changeValue){
    
    const convertToChoose = new Intl.NumberFormat(currency);
    
    let convertedValue = convertToChoose.format(parseFloat(changeValue).toFixed(2));
    return convertedValue;
}

let repeaterCount = 3;

const repeatHTML = function(repcount) {
    fieldsContainer.insertAdjacentHTML("beforeend", 
        `<div id="repeater" class="repeater">
        <span class="stock-ind-no">${repcount}</span>
        <div class="stock-unit-c">
                <label for="stock-unit" class="stock-label">Unit</label>
                <input type="number" name="stock-unit" id="stock-unit-${repcount}" class="stock-unit u${repcount}">
                <p class="stock-calc-error eu${repcount}" style="color: red;">This field is required.</p>
            </div>
            <div class="stock-cost-c">
                <label for="stock-cost" class="stock-label">Cost</label>
                <input type="number" name="stock-cost" id="stock-cost-${repcount}" class="stock-cost c${repcount}">
                <p class="stock-calc-error ec${repcount}" style="color: red;">This field is required.</p>
            </div>
            <div class="stock-total-inv">
                        <p class="heading-ti">Your Investment:</p>
                        <div id="result-ti" class="result-ti single-inv${repcount}"></div>
            </div>
        </div>`
    );
}
    
repeaterBtn.addEventListener("click", ()=>{
    repeatHTML(repeaterCount);
    repeaterCount++;
    repeater = document.querySelectorAll(".repeater");
});

stockCalculateBtn.addEventListener("click", ()=>{
    repeater = document.querySelectorAll(".repeater");
    singleInvWrap = document.querySelectorAll(".stock-total-inv");

    let allUnits = Array();
    let unitCostMultipy = Array();

    repeater.forEach((_cur, i) => {

        let errorUnit = document.querySelector(`.eu${i+1}`);
        let errorCost = document.querySelector(`.ec${i+1}`);

        let stockUnit = document.querySelector(`.u${i+1}`);
        let stockCost = document.querySelector(`.c${i+1}`);

        let singleInvestment = document.querySelector(`.single-inv${i+1}`);

        if(stockUnit.value == ""){
            errorUnit.style.display = "block";
        } else if(Number(stockUnit.value) < 1){
            errorUnit.textContent = "Enter unit above 1.";        
            errorUnit.style.display = "block";
        } else{
            errorUnit.style.display = "none";
        }

        if (stockCost.value == "") {
            errorCost.style.display = "block";
        } else if(Number(stockCost.value) < 1){
            errorCost.textContent = "Enter unit above 1.";        
            errorCost.style.display = "block";
        } else{
            errorCost.style.display = "none";
        }

        let singleInv = (Number(stockUnit.value) * Number(stockCost.value));

        allUnits[i] = Number(stockUnit.value);
        unitCostMultipy[i] = singleInv;
        singleInvestment.textContent = intoMoney(singleInv);
        if (!stockUnit.value == "" && !stockCost.value == "") {
            singleInvWrap[i].style.display = "flex";
        } else{
            singleInvWrap[i].style.display = "none";
        }
    });

    // console.log(unitCostMultipy, 'Single INV');

    let totalInvest = unitCostMultipy.reduce((cur, nxt)=>{
        return cur + nxt;
    }, 0);

    let totalUnits = allUnits.reduce((cur, nxt)=>{
        return cur + nxt;
    });
    
    resTotalU.textContent = intoMoney(totalUnits);
    resAvgI.textContent = intoMoney(totalInvest/totalUnits);
    resTotalI.textContent = intoMoney(totalInvest);
});

removerBtn.addEventListener("click", ()=>{
    if(fieldsContainer.children.length < 2){
      console.log("error");
      return;
    }
    fieldsContainer.removeChild(fieldsContainer.lastElementChild);
    repeaterCount--;
    repeater = document.querySelectorAll(".repeater");

    resTotalU.textContent = "---";
    resAvgI.textContent = "---";
    resTotalI.textContent = "---";
    singleInvWrap = document.querySelectorAll(".stock-total-inv");
});

clearBtn.addEventListener("click", ()=>{
    repeater.forEach((_cur, i) => {
        let stockUnit = document.querySelector(`.u${i+1}`);
        let stockCost = document.querySelector(`.c${i+1}`);
        
        stockUnit.value = stockCost.value = "";
    
        let errorUnit = document.querySelector(`.eu${i+1}`);
        let errorCost = document.querySelector(`.ec${i+1}`);
        
        errorUnit.style.display = errorCost.style.display = "none";

        singleInvWrap[i].style.display = "none";
    });

    resTotalU.textContent = "---";
    resAvgI.textContent = "---";
    resTotalI.textContent = "---";
});


resetBtn.addEventListener("click", ()=>{
    fieldsContainer.innerHTML = "";
    repeatHTML(1);
    repeatHTML(2);

    repeaterCount = 3;
    repeater = document.querySelectorAll(".repeater");

    resTotalU.textContent = "---";
    resAvgI.textContent = "---";
    resTotalI.textContent = "---";

});