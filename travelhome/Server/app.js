var express = require('express');
var app = express();


var cors = require('cors');
const PORT = process.env.PORT || 8080;
const routeSearch = require('./routes/route-search');
const bodyParser = require('body-parser');

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,         
    optionSuccessStatus:200
}

app.use(express.urlencoded({extended: false}));
app.use(routeSearch);
app.use(cors(corsOptions))
app.use(bodyParser.json());
app.listen(PORT, () =>{
    console.log("App listening at: http://localhost:8080/");
});

module.exports = app;