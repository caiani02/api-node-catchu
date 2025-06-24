const express = require('express'); 
const router = express.Router(); 

const CategoriasController = require('../controllers/categorias'); 

router.get('/categorias', CategoriasController.listarCategorias); 
router.post('/categorias', CategoriasController.cadastrarCategorias); 
router.patch('/categorias/:categ_id', CategoriasController.editarCategorias); 
router.delete('/categorias/:categ_id', CategoriasController.apagarCategorias); 


module.exports = router;