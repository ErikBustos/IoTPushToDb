const router = require('express').Router();

const { Service } = require("aws-sdk");
let AWS = require("aws-sdk");
const config = require('../AWSconfig');

AWS.config.update(config.aws_remote_config);
let docClient = new AWS.DynamoDB.DocumentClient();

router.post('/pushSensorsData', async(req, res) => {
    const input = req.body;
    let params = {
        TableName:'farms',
        Item: {
            "sensorDataId": "1111fff9-8c36-ae97-024c-63aaad8665dc",
            "rainDrops": "Y",
            "month": 4,
            "year": 2021,
            "airHumidity": 29.5,
            "time": "16:20",
            "day": 10,
            "light": 50,
            "airTemperature": 25.8,
            "soilHumidity": 10.5
        }
    }


    docClient.put(params, (err, data)=>{
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item: ", JSON.stringify(data, null, 2));
        }
    })
    .catch(err => console.log(err))
    res.json('All good');
})

router.get('/getSensorsData', async(req, res) => {
    const input = req.body;
    let params = {
        TableName:'farms',
        Limit: 1
    }

    docClient.scan(params,(err, data)=>{
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
        }
    });

    // docClient.get(params, (err, data)=>{
    //     if (err) {
    //         console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    //     } else {
    //         console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
    //     }
    // })
    res.json('All good');
})

module.exports = router;