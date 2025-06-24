const express = require('express'); 
const router = express.Router(); 

const UsuariosController = require('../controllers/usuarios'); 

router.get('/usuarios', UsuariosController.listarUsuarios); 
router.post('/usuarios', UsuariosController.cadastrarUsuarios); 
router.patch('/usuarios/:usu_id', UsuariosController.editarUsuarios); 
router.delete('/usuarios/:usu_id', UsuariosController.apagarUsuarios); 


module.exports = router;