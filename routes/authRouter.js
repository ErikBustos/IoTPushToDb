const router = require('express').Router();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

router.post('/users', async (req, res) => {
    const newUser = req.body;
    newUser.password = bcrypt.hashSync(newUser.password, 10);
    // Post a la base de datos el objeto de User, se guarda el password encriptado


    res.json('auth  good');
})

//app.use(authMiddleware);   todos los de abajo usan el token

router.post('/login', async (req, res) => {

    //Buscar el usuario
    //If Null (401) unauth
    //else 

    // else{
    //     if(bcrypt.compareSync(req.body.password, result.password)) {
    //         let token = jwt.sign({nombre: result.nombre, id: result._id}, 'secret');
    //         res.statusCode = 202;
    //         res.send(token);
    //     }else {
    //         res.statusCode = 400;
    //         res.end();
    //     }   

    res.json('mytoken');
})

router.get('/users/:email', async (req, res) => {
    let email = req.params.email;
    //Buscar el usuario por email, una vez encontrado te regresa el JSON
    

    res.json('USER INFO');
})


router.get('/userloged', async (req, res) => {

//req.user_id    Se saca del body.
    res.json('mytoken');
})







function guidGenerator() {
    let S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

async function authMiddleware(req, res, next) {
    if(!req.headers['x-auth-user']) { //El token que obtienes al momento de loggear. El front se lo manda como header
        res.statusCode = 401;
        res.end();
    }
    else {
        // Validar que el token sea válido
        let token = req.headers['x-auth-user'];
        jwt.verify(token, 'secret', (err, decoded) => {
            if (err) {
                res.statusCode = 401;
                res.send("No tienes autorizacion");
            }
            else {
                req.user_nombre = decoded.nombre;
                req.user_id = decoded.id;
                next();
            }
        });        
    }
}

module.exports = router;