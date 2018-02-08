//returns number or NaN:
function checkNumber(n) {
    //check that temperature contains only digits and max one decimal point
    var validNumber = true;    //is false if string is not a valid temperature
    var containsDot = false;    //is true if it contains one decimal point
    var isNegative = false;
    var newString = "";
    
    for (var i = 0; i < n.length; i++) {    //check every index
        var letter = n.substr(i, 1);
        if (!containsDot && (letter === "." || letter === ",")) {   //can contain one decimal point
            newString = newString + "."; //want "." instead of ","
            containsDot = true;
        } else if (letter == "-" && i == 0) {
            isNegative = true;
        } else if (isNaN(letter)) { //n not valid -> return  NaN
            return NaN;
        } else {
            newString = newString + letter; //concat letter to newString
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
function getStorage(kaupunki) {
    var array;
    if(!checkStorage) {return;}
    array = JSON.parse(localStorage.getItem(kaupunki))
    if(array == null){
        array = [];
    }
    return array;
}

//stores given temperature to given city's localStorage:
function storeHavainto(kaupunki, lampo){
    if (!checkStorage()) {//checks storage
        return;
    }          
    var time = new Date().getTime();    //gets current time in millis
    var obj = {temperature:lampo,time:time};  //creates object
    var array = getStorage(kaupunki);       //gets storage, if any
    array.push(obj);                        //adds object to array
    var stringyArray = JSON.stringify(array);
    localStorage.setItem(kaupunki, stringyArray);  //stores array
}

//on lisää havainto -button press:
function lisaaHavainto(){
    var kaupunki = document.getElementById("kaupungit").value;  //gets city
    var lampotila = document.getElementById("lampotila").value; //gets temperature value
    var lampoNumber = checkNumber(lampotila);                   //check that temperature is valid
    
    if (kaupunki === "default") {
        alert("Valitse kaupunki");          //alert if no city chosen
        return;
    } else if (Number.isNaN(lampoNumber)) {
        alert("Väärä lämpötila");           //alert if no valid temperature input
        return;
    }
    storeHavainto(kaupunki, lampoNumber);   //stores if valid
    update();
}

//retruns the object with the hightest temperature in given city
function getMax(kaupunki) {
    var array = getStorage(kaupunki);
    if (array.length == 0){
        return "Ei havaintoja";
    }
    array.sort(function(a, b){return b.temperature-a.temperature})
    return array[0];//returns temperature object   
}

//retruns the object with the lowest temperature in given city
function getMin(kaupunki) {
    var array = getStorage(kaupunki);
    if (array.length == 0){
        return "Ei havaintoja";
    }
    array.sort(function(a, b){return a.temperature-b.temperature})
    return array[0];//returns temperature object
}

//retruns the object with the latest entry time(highest time)
function getLast(kaupunki) {
    var array = getStorage(kaupunki);
    if (array.length == 0){
        return "Ei havaintoja";
    }
    array.sort(function(a, b){return b.time-a.time})//sort array by time (descending)
    return array[0];//returns temperature  object
}

//returns the string representation to put into the table
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

//removes all entries that are older than 24h and updates table
function update(){ 
    var kaupungit = ["Tokio", "Helsinki", "New York", "Amsterdam", "Dubai"];//all cities
    var array = null;
    var kaupunki = null;
    var currentTime = new Date().getTime();
    for (var i = 0; i<kaupungit.length; i++){ // goes through all cities in kaupungit
        kaupunki = kaupungit[i];
        array = getStorage(kaupunki);
        for(var j = array.length - 1; j >= 0; j--){
            if (array[j].time + 86400000 < currentTime){//24h = 86400000 milliseconds
                array.splice(j, 1);                     //splices the object if older than 24h
            }
        }
        localStorage.setItem(kaupunki, JSON.stringify(array)); //updates the stored array
    }
    
    
    
    
    
    
    
    //Update table:
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
    var conf = confirm("Varoitus: toiminto poistaa kaikki lisätyt havainnot. Jatketaanko?");
    if (conf) {
        localStorage.clear();
        location.reload();
    }
}
