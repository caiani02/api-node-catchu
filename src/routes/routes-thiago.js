const express = require('express'); 
const router = express.Router(); 

const ObjetosController = require('../controllers/objetos'); 

const uploadImage = require('../middleware/uploadHelper');

const uploadobjetos = uploadImage('objetos')



router.get('/objetos', ObjetosController.listarObjetos); 
router.post('/objetos', uploadobjetos.single('img'), ObjetosController.cadastrarObjetos); 
router.patch('/objetos/:obj_id', ObjetosController.editarObjetos); 
router.delete('/objetos/:obj_id', ObjetosController.apagarObjetos); 

module.exports = router;
