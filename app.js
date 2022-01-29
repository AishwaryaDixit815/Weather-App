const express = require("express");
const https = require("https"); //the https module doesn't require installation, as it is native. (we used this to send get request to apis)
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){//this is the response that is to be sent to our client
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res){
    const query = req.body.cityName;
    const id = "31b545cac879596c3459dc85be24b7e1";
    const unit = "metric";
    
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + id + "&units=" + unit; //the whole api url wherein the info we want is present
    https.get(url, function(response){//this is the response that we got from the api
        console.log(response.statusCode);
        
        response.on("data", function(data){
            const weath = JSON.parse(data); //convert whatever string data we got through the api, to a javascript object named weather
            console.log(weath);
        
            const temp = weath.main.temp;
            console.log(temp);
        
            const descr = weath.weather[0].description;
            console.log(descr);
        
            const icon = weath.weather[0].icon;
            const iconUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        
            //we can have multiple write methods :
            res.write("<p>The weather description is : " + descr + "<p>");
            res.write("<h1>The temperature in " + query + " is " + temp + " degrees celcius</h1>");
            res.write("<img src=" + iconUrl + ">");
        
            res.send();
            //res.send("<h1>The temperature in london is " + temp + "</h1><br>The weather description is : " + descr);
        })
    })
    //res.send("Server is up and running."); //There can be only one send method.
})

app.listen(port, function(){
    console.log(`Server is running at port ${port}.`);
})