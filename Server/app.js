import express from 'express';
import routeSearch from './routes/route-search.mjs';
import cors from 'cors';
import bodyParser from 'body-parser';


var app = express();

const PORT = process.env.PORT || 8080;


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

export default app;