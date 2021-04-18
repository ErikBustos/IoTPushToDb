const router = require('express').Router();
const fetch = require('node-fetch');
require('dotenv').config();

const apiGatewayURL = process.env.APIGATEWAYURL || 'https://6qffju9y55.execute-api.us-east-1.amazonaws.com';

router.post('/pushSensorDatatoDB', async (req, res) => {
    const { sensorData, macid } = req.body;

    let sensorDataIDresponse, sensorDataArray, responseJson, requestJson ;

    //Push sensors Data. Save the sensorDataID
    await fetch(apiGatewayURL+ '/pushSensorsData',{
        method: 'POST',
        body: JSON.stringify(sensorData),
        headers: { 'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(json => {
        sensorDataIDresponse = json.sensorDataId;
    })
    .catch(err => console.log(err));
    
    requestJson = {
        "macid": macid
    }
     //getSensorDataFromSensor. Save the Array to sensorDataArray
    await fetch(apiGatewayURL+ '/getSensorDataFromSensor',{
        method: 'POST',
        body: JSON.stringify(requestJson),
        headers: { 'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(json => {
        sensorDataArray = json.data;
    })
    .catch(err => console.log(err));

    requestJson = {
        "macid": macid,
        "sensorDataids": sensorDataArray,
        "newsensorDataId": sensorDataIDresponse
    }

    //Update sensor table.
    await fetch(apiGatewayURL+ '/updateSensorAddData',{
        method: 'POST',
        body: JSON.stringify(requestJson),
        headers: { 'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(json => { })
    .catch(err => console.log(err));

    responseJson = {
        message: "Added sensor data and updated sensor information",
        newsensorDataId : sensorDataIDresponse
    }

    res.status(201).json(responseJson);
})

module.exports = router;