//esta es lla clase con la que controlamos la lógica para llas operaciones con lo usuarios

//primero vamos a requerir el modelo para los usuarios
const User = require('../models/User');

//definimos el objeto donde vamos a guardar todos los metodos de operación con los usuarios
const userControl = {};

//el primer método que definimos es el de getUsuarios. Esta función nos permitirá buscar en la base de datos mediante User.find() para 
//  que nos devuelva una lista con los usuarios y los devolvemos en formato json()
userControl.getUsuarios = async (req, res, next) => {
    const users = await User.find();
    res.json(users);
}

//el método createUser nos permitirá crear uun nuuevo usuario, los datos del usuario están en la req.body y los camos a pasar a una instancia de
//   User. Una vez definida vamos a llamar al método save() este método nos va a guardar el usuario en la base de datos. Una vez hecho esto procedemos a
//   enviar un mensaje con el status: usuario guardado, solo es un mensaje que se imprimira en el lado del cliente como indicador. 
userControl.createUser = async (req, res, next) =>{
    const users = new User({
        email: req.body.email,
        password: req.body.password,
    });
    await users.save();
    res.json({
        estatus: 'Usuario Guardado'
    });
};

// después tenemos el método getUsuarios, con este método podemos hacer búsqueda de un usuario por medio de un id, no te confundas con el método de arriba
// ya que el otro busca todos los usuarios, express puede manejar este caso con facilidad. Una vez hecho esto buscamos ell usuario User.findById()
// y le pasamos el id del usuario que queremos obtener y nos devolverá un usuario. Al final lo servimos con res.json().
userControl.getUsuarios = async(req, res, next) =>{
    const user = await User.findById(req.params.id);
    res.json(user);
}

// editUsuario nos va a permitir eitar un usuuario, para eso necesitamos el id del uusuario el cual podemos obtener del objeto req.params,
//   antes de editar requerimos la información de actulización y pues lla guardamos en un objeto user. Despues este objeto user se llo pasamos
//   al método User.findByIdAndUpdate y le pasamos como argumento el id dell registro que vamos a actualizar y el conjunto de datos a actualizar en 
//   una variable $set, recorddemos que los datos están en la variable data. Una vez hecho esto vamos a imprimirle al usuario un mensaje para que diga
//  estatus: usuario modificado.
userControl.editUsuario = async (req, res, next) =>{
    const { id } = req.params;
    const user = {
        email: req.body.email,
        password: req.body.password,
    };
    await User.findByIdAndUpdate(id, {$set: user}, {new: true} );
    res.json({estatus: 'usuario modificado'});
};

//este método creo  quue es el más sencillo porque se utiliza para eliminar un usuario para esto solo uuutilizamos el método 
//   User.findByIdAndRemove y le pasamos como argumento el id del usuario a eliminar. AL finalizar le mandamos al cliente el status: usuario eliminado
userControl.deleteUsuario = async (req, res, next) =>{
    await User.findByIdAndRemove(req.params.id);
    res.json({estatus: 'Usuario Eliminado'});
}

//por último exportamos el controlador para los uusuarios.
module.exports = userControl;