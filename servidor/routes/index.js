//Primero vamos a importar el framework de express con el que vamos a continuar nuestra lógica
const express = require('express');
//Lo primero que vamos a hacer es requerír uun controlador para obtener los productos, esta lógica la encapsaula un controlador
// que hemos definido para los productos
const { getProducto } = require('../controllers/productos.controller');
//así mismo definimos un controlador para los usuarios, la lógica es parecida a la de los clientes
const { getUsuarios } = require('../controllers/users.controller');
//importamos el enrutador para manejar nuestras peticiones en el server
const router = express.Router();

const producto = require('../controllers/productos.controller');
const usuario = require('../controllers/users.controller');

//continuamos importanto el modelo para los clientes, este modelo nos permitirá almacenar el usaurio en memoria temporal para hacer
// operaciones sobre él.
const User = require('../models/User');
//de la misma forma requerimos el modelo para los productos
const Producto = require('../models/productos');

//utilizamos una librería para los tokens
const jwt = require('jsonwebtoken');


//esta ruta la usamos para pruebas, cuando accedemos desde el servidor al navegador mediante la ruta inicial accedemos a esta petición  y
// nos devuelve un mensaje de texto plano
router.get('/', (req, res) => {
    res.send('Hello world')
});

//estas rutas ya las explicamos, mejor vamos a explicar lo de los usuarios
router.get('/productos', producto.getProductos);
router.post('/productos',  producto.createProducto);
router.get('/productos:id', producto.getProducto);
router.put('/productos:id',  producto.editProducto);
router.put('/productos:id', producto.deleteProducto);

//para los usuario tenemos diferente métodos definidos mediante los cuales vamos a registrar los usuarios, este método nos permitirá registrar
//  un usuario nuevo, primero empieza cuando accedemos a la ruta con localhost:3000/signup esto nos mandará a este método y lo primero que hará
//  es obtener la información de registro del usuario que proporcionó a través del objeto req.body. Hacemos estracting y obtenemos el email y
//  el password, una vez con estos datos vamos a usar el modelo que importamos  para los usuarios, guardamos los dos datos en la isntancia del 
//  nuevo usuario llamado newUser, una vez hecho esto llamamo el método save() para almacenarlo en la base de datos y esperamos  que se resuelva la 
//  promesa, para eso vamos a uusar await que espera por la resulución de la promesa en nuestra función asíncrona, después usamos la instancia 
//  jwt para crear un token mediante el método sign, debemos pasarle a este método un ide que se tipeará y la clave secreta mediante la cual se
//  va a encriptar. Una vez echo esto nos devuelve una promesa con el toquen y lo esperamos, después lo devolvemos como resultado en formato JSON
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const newUser = new User({email, password});
    await newUser.save();
		const token = await jwt.sign({_id: newUser._id}, 'secretkey');
    res.status(200).json({token});
});

//Para el inicio de sesión tenemos el siguiente método asíncrono para la ruta /signin, hacemos muchas cosas parecidas como obtener las credenciales
//  desde el objeto req.body, una vez hecho esto vamos a usar la instancia User.findOne para pasarle al método el email, una vez hecho esto vamos
//  a evaluar si el usuario existe, en caso de no existir lanzará un mensaje de respuesta al cliente diciendo que el usuario no existe en la base
//  de datos de nuesta aplicación, en caso de que sí exista se va a comprobar la instancia, esto lo hacemos con el objevo que devuellve y que 
//  nombramos ccomo user, recuarda que lo obtuvimos de User.findOne(), en caso quue la contraseña sea igual vamos a proceder a devolver el token
//  correspondiente para quue el usuario lo uutilice y pueda hacer operaciones en nuestra aplicación, en caso de no existir se va a lanzar un  mensaje
//  al usuario disiendo que la contraseña es incorrecta.
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email});
    if (!user) return res.status(401).send('The email doen\' exists');
    if (user.password !== password) return res.status(401).send('Wrong Password');

		const token = jwt.sign({_id: user._id}, 'secretkey');

    return res.status(200).json({token});
});


//Est función lo que hace es verificar si el toquuen existe y si está autorizado para acceder a una funcionalidad. Para esto devemos evaluar
//  el encabezado de req.headers.authorization, si no existe el objeto entonces respondemo con un 401 para decir que la petición no está autirizada
//  así mismo si sí existe un objeto de autirización en los encabezados pues extraemos el token,, luego evaluarmos si el token es nulo, en caso de 
//  ser nulo le respondemos al usuari con el mismo error 401, en caso de si existir un objeto token pues lo evaluamos con el objeto jwt.verify()
//  en caso de que sea valido el tóen pues pasa, pero si no es valido lanzamos el mismo error al cliente el 401, en caso de sí pasar la autorización
//  vamos a obtener el id del usuario. Una vez obtenido el ide podemos continuar con el enrutamiento de la aplicación para la lógica.
//En conclusión todo esto se hace para validar si un usuario tiene auutización para acceder a ciertas funciones de nuestra aplicación, en caso de si
//  tener autirización pues el cliente siempre tendrá disponible acceso a las vista por medio de su token de autorización.
async function verifyToken(req, res, next) {
	try {
		if (!req.headers.authorization) {
			return res.status(401).send('Unauhtorized Request');
		}
		let token = req.headers.authorization.split(' ')[1];
		if (token === 'null') {
			return res.status(401).send('Unauhtorized Request');
		}

		const payload = await jwt.verify(token, 'secretkey');
		if (!payload) {
			return res.status(401).send('Unauhtorized Request');
		}
		req.userId = payload._id;
		next();
	} catch(e) {
		console.log(e)
		return res.status(401).send('Unauhtorized Request');
	}
}

//exportamos el modulo de enrutador
module.exports = router;
