const router = require('express').Router();

const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');
require('dotenv').config();

const CLOUDANT_URL = process.env.CLOUDANT_URL || 
    'https://32a29eca-18ab-46e2-a1f8-d7c2314f4d11-bluemix.cloudantnosqldb.appdomain.cloud';
const CLOUDANT_APIKEY = process.env.CLOUDANT_APIKEY || 
    '24bxrhMSC5Ww0JY5S33x-WAL_sJ5AqM54W8WPWp_t0Wl';

console.log("-------->Cloudant url " + CLOUDANT_URL);

const authenticator = new IamAuthenticator({
    apikey: CLOUDANT_APIKEY
});

const service = new CloudantV1({
    authenticator: authenticator
}); 

service.setServiceUrl(CLOUDANT_URL);

service.getAllDbs().then(response => {
    console.log(response.result);
  });

  let document1 = {
    userid: 'abc126',
    eventType: 'addedToBasket',
    productId: '1000042',
    date: '2019-01-28T10:44:22.000Z'
  }


router.post('/pushtodb', async (req, res) => {
    const input = req.body;
    await service.putDocument({
        db: 'masterdb',
        docId: guidGenerator(),
        document: input
    })
    .then(res => console.log(res))
    .catch(err => console.log(err))

    res.json('All good');
})

function guidGenerator() {
    let S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

module.exports = router;