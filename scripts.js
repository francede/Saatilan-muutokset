/*
*@author Francesco de Lorenzo
*Ennakkotehtävä
*/


//check that temperature contains only digits and max one decimal point
//returns number or NaN:
function checkNumber(n) {
    var validNumber = true;     //is false if string is not a valid temperature
    var containsDot = false;    //is true if it contains one decimal point
    var isNegative = false;     //is true only if first char is "-"
    var newString = "";
    
    for (var i = 0; i < n.length; i++) {    //check every index
        var char = n.substr(i, 1);
        if (!containsDot && (char === "." || char === ",")) {   //checks for one decimal point
            newString = newString + ".";
            containsDot = true;
        } else if (char == "-" && i == 0) {
            isNegative = true;
        } else if (isNaN(char)) {
            return NaN;
        } else {
            newString = newString + char;
        }
    }
    if (isNegative) {
        return -parseFloat(newString);
    }
    return parseFloat(newString);
}

//check if browser supports localStorage:
function checkStorage() {
    if (typeof(Storage) !== "undefined") {
            return true;
    } else {
            return false;
    }
}

//returns array of objects for given city from localStorage
//returns empty array if no storage found for given city
function getStorage(city) {
    var array;
    if(!checkStorage) {return;}
    array = JSON.parse(localStorage.getItem(city))
    if(array == null){
        array = [];
    }
    return array;
}

//stores given temperature to given city's localStorage:
function storeEntry(city, temperature){
    if (!checkStorage()) {
        return;
    }          
    var time = new Date().getTime();                //gets current time in millis
    var obj = {temperature:temperature,time:time};  //creates object
    var array = getStorage(city);                   //gets storage, if any
    array.push(obj);                                //adds object to array
    var stringyArray = JSON.stringify(array);
    localStorage.setItem(city, stringyArray);       //stores array
}

//on lisää havainto -button press:
function addEntry(){
    var city = document.getElementById("kaupungit").value;
    var temperatureRaw = document.getElementById("lampotila").value;
    var temperature = checkNumber(temperatureRaw);
    
    if (city === "default") {
        alert("Valitse kaupunki");          //alert if no city chosen
        return;
    } else if (Number.isNaN(temperature)) {
        alert("Väärä lämpötila");           //alert if no valid temperature input
        return;
    } else if (temperature > 100){
        alert("Liian suuri lämpötila");     //input range from -100 to 100
        return;
    } else if (temperature < -100){
        alert("Liian pieni lämpötila");
        return;
    }
    storeEntry(city, temperature);
    update();
}

//retruns the object with the highest measured temperature in given city
function getMax(city) {
    var array = getStorage(city);
    if (array.length == 0){
        return "Ei havaintoja";
    }
    array.sort(function(a, b){return b.temperature-a.temperature})
    return array[0];//returns temperature object   
}

//retruns the object with the lowest measured temperature in given city
function getMin(city) {
    var array = getStorage(city);
    if (array.length == 0){
        return "Ei havaintoja";
    }
    array.sort(function(a, b){return a.temperature-b.temperature})
    return array[0];//returns temperature object
}

//retruns the object with the latest entry time(highest time)
function getLast(city) {
    var array = getStorage(city);
    if (array.length == 0){
        return "Ei havaintoja";
    }
    array.sort(function(a, b){return b.time-a.time})    //sort array by time (descending)
    return array[0];
}

//returns the string representation to show on the table
function tempToString(object) {
    var str;
    if(object == "Ei havaintoja") {
        return object;
    }
    var date = new Date(object.time)
    var min = date.getMinutes();
    if(min < 10){
        min = "0" + min;
    }
    var hours = date.getHours();
    str = "";
    str = str + object.temperature + "\xB0C (" + hours + ":" + min + ")"
    return str;
}

//removes all entries that are older than 24h
function update(){ 
    var cityList = ["Tokio", "Helsinki", "New York", "Amsterdam", "Dubai"];
    var array = null;
    var city = null;
    var currentTime = new Date().getTime();
    for (var i = 0; i<cityList.length; i++){
        city = cityList[i];
        array = getStorage(city);
        for(var j = array.length - 1; j >= 0; j--){
            if (array[j].time + 86400000 < currentTime){    //24h = 86400000 milliseconds
                array.splice(j, 1);                         //splices the object if older than 24h
            }
        }
        localStorage.setItem(city, JSON.stringify(array)); //updates the array to localStorage
    }
    updateTable();
}

//updates HTML table
function updateTable(){
    document.getElementById("tok_max").innerHTML = tempToString(getMax("Tokio"));
    document.getElementById("tok_min").innerHTML = tempToString(getMin("Tokio"));
    document.getElementById("tok_last").innerHTML = tempToString(getLast("Tokio"));
    document.getElementById("hel_max").innerHTML = tempToString(getMax("Helsinki"));
    document.getElementById("hel_min").innerHTML = tempToString(getMin("Helsinki"));
    document.getElementById("hel_last").innerHTML = tempToString(getLast("Helsinki"));
    document.getElementById("new_max").innerHTML = tempToString(getMax("New York"));
    document.getElementById("new_min").innerHTML = tempToString(getMin("New York"));
    document.getElementById("new_last").innerHTML = tempToString(getLast("New York"));
    document.getElementById("ams_max").innerHTML = tempToString(getMax("Amsterdam"));
    document.getElementById("ams_min").innerHTML = tempToString(getMin("Amsterdam"));
    document.getElementById("ams_last").innerHTML = tempToString(getLast("Amsterdam"));
    document.getElementById("dub_max").innerHTML = tempToString(getMax("Dubai"));
    document.getElementById("dub_min").innerHTML = tempToString(getMin("Dubai"));
    document.getElementById("dub_last").innerHTML = tempToString(getLast("Dubai"));
}

//Clears localStorage after confirmation
function clearStorage() {
    var conf = confirm("Varoitus: toiminto poistaa kaikki havainnot. Jatketaanko?");
    if (conf) {
        localStorage.clear();
        location.reload();
    }
}

//shows coordinates when hovering over a table row, null city clears the element
function showCoordinates(givenCity) {
    if(givenCity == undefined){
        document.getElementById("coordinates").innerHTML = " ";
        return;
    }
    var cityCoords = [{city:"Tokio", coords:"35.6584421, 139.7328635"},
                      {city:"Helsinki", coords:"60.1697530, 24.9490830"},
                      {city:"New York", coords:"40.7406905, -73.9938438"},
                      {city:"Amsterdam", coords:"52.3650691, 4.9040238"},
                      {city:"Dubai", coords:"25.092535, 55.1562243"}];
    for(var i = 0; i < cityCoords.length; i++){
        if(cityCoords[i].city == givenCity){
            document.getElementById("coordinates").innerHTML = "Coordinates: " + cityCoords[i].coords;
            return;
        }
    }
    
}
