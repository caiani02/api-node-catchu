const express = require('express'); 
const router = express.Router(); 

const ObjetosController = require('../controllers/objetos'); 
const uploadImage = require('../middleware/uploadHelper');

// 🔹 a pasta deve ser "objetos" igual à sua API
const uploadObjetos = uploadImage('objetos');

// ✅ Rotas corretas
router.get('/objetos', ObjetosController.listarObjetos); 

// ✅ o campo "img" precisa bater com o FormData do front
router.post('/objetos', uploadObjetos.single('img'), ObjetosController.cadastrarObjetos); 

router.patch('/objetos/:obj_id', ObjetosController.editarObjetos); 
router.delete('/objetos/:obj_id', ObjetosController.apagarObjetos); 

module.exports = router;
