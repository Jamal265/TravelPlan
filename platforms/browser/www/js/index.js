/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //app.receivedEvent('deviceready');
        mySuperCode();
        currentLocation(); //when the application loads should call current location cunction
        tryingFile();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

//currency converter getting values from thr form and displaying on the form
function convertCurrency(){
    var from = document.getElementById("from").value
    var to = document.getElementById("to").value
    var http = new XMLHttpRequest();
    var url = "http://apilayer.net/api/live?access_key=fb87921259952bca684888414afd47e6&currencies=EUR,GBP,CAD,PLN&source=USD&format=" + from + "," + to;
    http.open("GET", url, true);
    http.send();
    http.onreadystatechange = function(){
        if(http.readyState == 4 && http.status ==200){
            var result = http.responseText;
            // alert(result);
            var jsResult = JSON.parse(result);
            //var oneUnit = jsResult.quotes["USD"]/jsResult.quotes.USDEUR;

            var amt = document.getElementById("fromAmount").value;

            var to = document.getElementById('to').value;
            console.log(to);
            var tag = "USD"+to;
            console.log(tag);
            document.getElementById("toAmount").value = amt * jsResult.quotes[tag];
        }
    }
}


function onError() {
    console.log("Error-Message");
}

function myCallbackFunction() {
    console.log("myCallbackFunction");
}

//this function is getting the current Location
function currentLocation(){
navigator.geolocation.getCurrentPosition((position)=>{
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    fetch('https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lng+'&appid=e01859e95329214550b9807386c06b7f', {mode: 'cors'})
    .then((resp) => resp.json())
    .then(function(data) {
        document.getElementById("location").innerHTML = data.sys.country;
        

    });
},onError);
}

//this function is checking the weather of the current location
function callWeatherAPI(){
    console.log('weather click handler fired');

    navigator.geolocation.getCurrentPosition((position)=>{
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        fetch('https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lng+'&appid=e01859e95329214550b9807386c06b7f', {mode: 'cors'})
        .then((resp) => resp.json())
        .then(function(data) {
            console.log(data);
            document.getElementById("weather").innerHTML = data.weather[0].description;
            document.getElementById("temperature").innerHTML = data.main.temp;
            document.getElementById("Humidity").innerHTML = data.main.humidity;
            document.getElementById("speed").innerHTML = data.wind.speed;
            document.getElementById("location").innerHTML = data.sys.country;
            

        });
    },onError);


}


//this function is checking time, currency and city
function mySuperCode(){
    
    var http = new XMLHttpRequest();
    const opencage = 'https://api.opencagedata.com/geocode/v1/json?q=53.4451671+ -6.2319661&key=978d4f82b7184024acf9c1ca2c4a1529';
    http.open("GET", opencage, true);
    http.send();
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status ==200){
        var response = http.responseText;
        var responseJSON = JSON.parse(response);
        console.log(responseJSON);

        var currency = responseJSON.results[0].annotations.currency.name;
        console.log(currency);
        document.getElementById("currency").innerHTML = currency;
        

        var timestamp = responseJSON.timestamp.created_http;
        console.log(timestamp);
        document.getElementById("date").innerHTML = timestamp;

        var name = responseJSON.results[0].annotations.timezone.name;
        console.log(name);
        document.getElementById("city").innerHTML = name;
        }
    }
    
}


//writing to file

function tryingFile(){

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemCallback, onError);
   
}

function fileSystemCallback(fs){
    // Displaying result in the console
    console.log('file system open: ' + fs.name);

    // Displaying in front end
    var toFronEnd = 'file system open: ' + fs.name;
    //document.getElementById('file').innerHTML = toFronEnd;

    // Name of the file I want to create
    var fileToCreate = "newPersistentFile.txt";

    // Opening/creating the file
    fs.root.getFile(fileToCreate, fileSystemOptionals, getFileCallback, onError);
}

var fileSystemOptionals = { create: true, exclusive: false };

function getFileCallback(fileEntry){
    // Display in the console
    console.log("fileEntry is file?" + fileEntry.isFile.toString());

    // Displaying in front end
    //var toFrontEnd = document.getElementById('file').innerHTML;
    //toFrontEnd += "fileEntry is file?" + fileEntry.isFile.toString();
    //document.getElementById('file').innerHTML = toFrontEnd;
    
    currentLocation(); //was trying to call the get location function
   
    //and save it into the blob
    var dataObj = new Blob(['Hello'], { type: 'text/plain' });
    // Now decide what to do
    // Write to the file
    writeFile(fileEntry, dataObj);

    // Or read the file
    readFile(fileEntry);
}

// Let's write some files
function writeFile(fileEntry, dataObj) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {
        
        // If data object is not passed in,
        // create a new Blob instead.
        if (!dataObj) {
            dataObj = new Blob(['Hello'], { type: 'text/plain' });
        }

        fileWriter.write(dataObj);

        fileWriter.onwriteend = function() {
            console.log("Successful file write...");
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
        };

    });
}
// Let's read some files
function readFile(fileEntry) {

    // Get the file from the file entry
    fileEntry.file(function (file) {
        
        // Create the reader
        var reader = new FileReader();
        reader.readAsText(file);

        reader.onloadend = function() {

            console.log("Successful file read: " + this.result);
            console.log("file path: " + fileEntry.fullPath);

        };

    }, onError);
}