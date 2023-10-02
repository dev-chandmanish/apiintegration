//require('dotenv').config();

const express = require('express');
const app = express();

const axios = require('axios');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:false}));

const options = {
    method: 'POST',
    url: 'https://bravenewcoin.p.rapidapi.com/oauth/token',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'c6a2da01b5mshec680ce2e7136fep1421e7jsnf8934f3239a3',
      'X-RapidAPI-Host': 'bravenewcoin.p.rapidapi.com'
    },
    data: {
      audience: 'https://api.bravenewcoin.com',
      client_id: 'oCdQoZoI96ERE9HY3sQ7JmbACfBf55RY',
      grant_type: 'client_credentials'
    }
  };

app.get('/', (req, res)=>{
    res.send('This is the home page.');
})

let accessToken = '';
app.get('/accesstoken', async(req, res)=>{
    try{
        const response = await axios.request(options);
        //console.log(response.data);
        if(!response){
            throw new Error("Can't obtain access token.");
        }
        accessToken = response.data.access_token;
        //console.log(accessToken);
        res.json({token: accessToken});
    }
    catch(error){
        console.log(error);
    }
})

let assetId = '';
const options2 = {
    method: 'GET',
    url: 'https://bravenewcoin.p.rapidapi.com/asset',
    params: {status: 'ACTIVE'},
    headers: {
      'X-RapidAPI-Key': 'c6a2da01b5mshec680ce2e7136fep1421e7jsnf8934f3239a3',
      'X-RapidAPI-Host': 'bravenewcoin.p.rapidapi.com'
    }
  };


app.get('/uuid4asset', async(req, res)=>{
    try{
        let response = await axios.request(options2);
        
        let asset = response.data.content[0];
        assetId = asset['id'];
        //console.log(accessToken);
        //console.log(assetId);
        res.json({assetId: assetId})
    }
    catch(error){
        console.log(error);
    }
})

//const accessToken = process.env.ACCESS_TOKEN;
//const assetId = process.env.ASSET_ID;

const auth = `Bearer ${accessToken}`;

const options3 = {
    method: 'GET',
    url: 'https://bravenewcoin.p.rapidapi.com/market-cap',
    params: {
      assetId: assetId
    },
    headers: {
      Authorization: auth,
      'X-RapidAPI-Key': 'c6a2da01b5mshec680ce2e7136fep1421e7jsnf8934f3239a3',
      'X-RapidAPI-Host': 'bravenewcoin.p.rapidapi.com'
    }
  };

app.get('/assetTicker', async (req, res) => {
    try {
        const response = await axios.request(options3);
        console.log(response.data);  // Assuming the data is in JSON format
        res.send(response.data);
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error(`Status: ${error.response.status}`);
            console.error(`Data: ${error.response.data}`);
        } else if (error.request) {
            // The request was made but no response was received
            console.error(`No response received. Request details: ${error.request}`);
        } else {
            // Something happened in setting up the request
            console.error(`Error setting up the request: ${error.message}`);
        }
        res.status(403).send('Forbidden'); // Send a 403 response
    }
});

app.listen(3000, ()=>{
    console.log('The server is running at 3000.');
})