let frm=document.querySelector('.taxcalc');

//Button for Form Submitting DOM
let taxcalcbtn=document.querySelector('.btn');

//Selecting Data from User Input DOM
let p=document.querySelector('#intamount');
let r=document.querySelector('#intrate');
let n=document.querySelector('#intperiod');
let selectPeriod=document.querySelector('.select-period');
let selectIntrestType=document.querySelector('.sty');
let selectCompoundIntrestFreq=document.querySelector('.select-compound-frequency');
let selectCompoundDiv=document.querySelector('.compound-freq');


//Display Result DOM
let rsp=document.querySelector('.resp');
let rsi=document.querySelector('.resi');
let rst=document.querySelector('.rest');

//Display Error DOM
let errorDiv=document.querySelectorAll(".error");

/**
 * To get user country.
 */

let currency;
 
fetch('http://ip-api.com/json/')
.then(response => response.json())
.then(
    data => {
        // console.log(data.countryCode, typeof data.countryCode);

        let country = data.countryCode;
        if(country == "IN"){
        currency = "en-IN";
        }else{
        currency = "en-US";
        }
    }
);

/**
 * For Converting into Rupees.
 * Method for Money 985854758.23 into 98,58,54,758.23
 */

const intoMoney = function(changeValue){

    const convertToChoose = new Intl.NumberFormat(currency);

    let convertedValue = convertToChoose.format(parseFloat(changeValue).toFixed(2));
    return convertedValue;
}

/**
 * Function for Calculating Compound Intrest Data.
 */
const calculateSimpleIntrest = function(p, r, t) {
    p = Number(p); //principal amount
    r = Number(r); //rate of intrest
    t = Number(t); //period of tax

    let i = p*r*t/100;
    let result;

    if(selectPeriod.value == 'day'){
        result = i/365;
    } else if(selectPeriod.value == 'month'){
        result = i/12;
    }else if(selectPeriod.value == 'week'){
        result = i/52;
    }else if(selectPeriod.value == 'quater'){
        result = i/4;
    } else{
        result = i;
    }
    
    return result;
}


/**
 * Function for Calculating Compound Intrest Data.
 */
 const calculateCompoundIntrest = function(p, r, t){
    p = Number(p); //principal amount
    r = Number(r); //rate of intrest
    
    r = r/100; //converting rate of intrest into percenteage value

    t = Number(t); //period of tax
    let n;


    let result;

    switch(selectCompoundIntrestFreq.value) {
        case "day":
            n = 365;
            break;
        case "week":
            n = 52;
            break;
        case "month":
            n = 12;
            break;
        case "quater":
            n = 4;
            break;
        default:
            n = 1;
    }


    let baseVal = (1 + r/n);
    let powerVal = (n*t);

    switch(selectPeriod.value) {
        case "day":
            powerVal = powerVal/365;
            break;
        case "week":
            powerVal = powerVal/52;
            break;
        case "month":
            powerVal = powerVal/12;
            break;
        case "quater":
            powerVal = powerVal/4;
            break;
        default:
            powerVal =powerVal/1;
    }
    
    result = p * Math.pow(baseVal, powerVal);

    return result - p;
}

/**
 * Function for default entries when it loads.
 */

// selectIntrestType.selectedIndex = "1"; //For setting Default Interest Type for Simple Interest-0 & Compound Interest-1

const defaultEntries = function(){
    let initIntrestValue;
    if(selectIntrestType.selectedIndex == "1"){
        initIntrestValue =  calculateCompoundIntrest(p.value, r.value, n.value);
        selectCompoundDiv.style.display = "block";
    } else{
        initIntrestValue =  calculateSimpleIntrest(p.value, r.value, n.value);
    }

    rsp.textContent = intoMoney(Number(p.value), 2); //Principal
    rsi.textContent = intoMoney(initIntrestValue, 2); //Intrest
    rst.textContent = intoMoney(Number(p.value) + initIntrestValue, 2); //Total
}
defaultEntries();

/**
 * Chart from chartjs.org
 */
let ctx = document.querySelector("#myChart");

//Default Chart Data
let defaultChartData = [p.value, calculateSimpleIntrest(p.value, r.value, n.value)];
Chart.defaults.font.size = 13;

//Creating Chart
let data = {
    labels: ["Principal Amount", "Interest Amount"],
    datasets: [{
        label: 'Calculation',
        data: defaultChartData,
        backgroundColor: ["#00a6c3", "#c7c700"],
        borderWaidth: 1,
        borderColor: "#E9E9E9"
    }]
};

let config = {
    type: "doughnut",
    data: data,
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: 'rgb(0, 0, 0)'
                }
            }
        }
    }
};

//Intializing Chart..
let chart = new Chart(ctx, config);

/**
 *Function for Destroing Chart
 */
const destroyChart = function(){
    chart.destroy();
}

/**
 * Recreating Chart from same chart variable.
 */
const reChart = function(newChatrData){

    ctx = document.querySelector("#myChart");
    
    Chart.defaults.font.size = 13;

    chart.data.datasets[0].data = newChatrData;
    
    chart = new Chart(ctx, config);

}

const updateUI = function() {
    let principalValue = Number(p.value);
    let interestRate = Number(r.value);
    let timePeriod = Number(n.value);

    let calulatedIntrest;
    if(selectIntrestType.value == "simple-interest"){
        calulatedIntrest = calculateSimpleIntrest(principalValue, interestRate, timePeriod);
    } else if(selectIntrestType.value == "compound-interest"){
        calulatedIntrest = calculateCompoundIntrest(principalValue, interestRate, timePeriod);
    }

    rsp.textContent = intoMoney(principalValue);
    rsi.textContent = intoMoney(calulatedIntrest);
    rst.textContent = intoMoney(principalValue + calulatedIntrest);
    
    //Removing chart and recreating with new data. (update method is also availbale.)
    destroyChart();
    reChart([principalValue, calulatedIntrest]);
}

//Select Elements --->
selectIntrestType.addEventListener("change", ()=>{

    if(selectIntrestType.value == "compound-interest"){
        selectCompoundDiv.style.display = "block";     
    } else{
        selectCompoundDiv.style.display = "none";    
    }
    updateUI();
});

selectCompoundIntrestFreq.addEventListener("change", ()=>{
    updateUI();
});

selectPeriod.addEventListener("change", ()=>{
    updateUI();
});
//-------------<

//Function that Calls updateUI() function and throws error.
const singleUIwithError = function(inpname, errorindex, eventpass) {
    if(inpname.value == '' || Number(inpname.value) < 1){
        errorDiv[errorindex].style.display = "block";
        errorDiv[errorindex].textContent = "Please enter amount above 0.";
        inpname.style.border = "1px solid red";
    }else{
        if(!isNaN(Number(eventpass.key)) || eventpass.key == "Backspace" || eventpass.key == "ArrowUp" || eventpass.key == "ArrowDown"){
            updateUI();
        }
        inpname.style.border = "1px solid blue";
        errorDiv[errorindex].textContent = "";
    }
}

// Input Fields --->
p.addEventListener("keyup", e=>{
    singleUIwithError(p, 0, e);
});

r.addEventListener("keyup", e=>{
    singleUIwithError(r, 1, e);
});

n.addEventListener("keyup", e=>{
    singleUIwithError(n, 2, e);
});
//-----------<