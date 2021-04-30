const router = require('express').Router();
const fetch = require('node-fetch');
require('dotenv').config();

const apiGatewayURL = process.env.APIGATEWAYURL || 'https://6qffju9y55.execute-api.us-east-1.amazonaws.com';

router.get('/getSensorDatafromUser', async (req, res) => {
    const { email, date } = req.query;
    let userFarms, requestJson, userSensors, sensorDataIds = [], sensorsData= [], dateSensorDataIds, finalSensorDataIds = [] ;
    let dateSensorDataIdsCount;
    const emailJson= {"email": email}

    //getFarmsByEmail are stored in userFarms
    await fetch(apiGatewayURL + '/getFarmsbyEmail', {
        method: 'POST',
        body: JSON.stringify(emailJson),
        headers: { 'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(json => {
        userFarms = json.farms
    })
    .catch(err => res.send(err));

    if(! userFarms){
        res.status(400).send('User does not have farms');
    }
    else {


    requestJson = {
        "farmId": userFarms[0]
    }

    await fetch(apiGatewayURL + '/getsensorsbyfarm', {
        method: 'POST',
        body: JSON.stringify(requestJson),
        headers: { 'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(json => {
        userSensors = json.sensors
    })
    .catch(err => res.send(err));


    for(let element of userSensors) {
        requestJson = {
            "macid": element
        }

        await fetch(apiGatewayURL + '/getSensorDataFromSensor', {
            method: 'POST',
            body: JSON.stringify(requestJson),
            headers: { 'Content-Type': 'application/json'}
        })
        .then(res => res.json())
        .then(json => {
            sensorDataIds.push(json.data)
        })
        .catch(err => res.send(err));
    }

    //'/querySensorDatabyDate?date=2021-04-30'

    //dateSensorDataIds
    await fetch(apiGatewayURL + '/querySensorDatabyDate?'+ new URLSearchParams({
        date: date
    }), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(json => {
        dateSensorDataIds =json.sensors.Items;
        dateSensorDataIdsCount = json.sensors.Count;
    })
    .catch(err => res.send(err));

    //console.log('dates: ' , dateSensorDataIds);

    for(let element of dateSensorDataIds) {
        
        if(sensorDataIds.find(e => e = element.sensorDataId)){
            element.timestamp = element.timestamp.replace(/Z/g,''); //remove Z to fix timezone issue
            finalSensorDataIds.push(element);
        }
    }

/*     for(let element of sensorDataIds) {
        for(let sensordataId of element) {
            requestJson = {
                "sensorDataId": sensordataId
            }
            await fetch(apiGatewayURL + '/getinfobysensordataid', {
                method: 'POST',
                body: JSON.stringify(requestJson),
                headers: { 'Content-Type': 'application/json'}
            })
            .then(res=>res.json())
            .then(json => {
                sensorsData.push(json.infoSensor)
            })
            .catch(err => res.send(err));
            }
        } */

    let responsePayload = {
        count: dateSensorDataIdsCount,
        sensorData: finalSensorDataIds
    }
    
    res.send(responsePayload);
    }
})

module.exports = router;