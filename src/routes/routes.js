const express = require('express'); 
const router = express.Router(); 

const ReservasController = require('../controllers/reservas'); 

router.get('/reservas', ReservasController.listarReservas); 
router.post('/reservas', ReservasController.cadastrarReservas); 
router.patch('/reservas/:res_id', ReservasController.editarReservas); 
router.delete('/reservas', ReservasController.apagarReservas); 


module.exports = router;