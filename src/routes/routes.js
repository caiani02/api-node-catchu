const express = require('express'); 
const router = express.Router(); 

const RotasCaiani = require('./routes-caiani'); 
const RotasPaci = require('./routes-paci'); 
const RotasThiago = require('./routes-thiago');
const RotasPedro = require('./routes-pedro');  
const RotasMurilo = require('./routes-murilo');  

router.use('/', RotasCaiani);
router.use('/', RotasPaci);
router.use('/', RotasThiago);
router.use('/', RotasPedro);
router.use('/', RotasMurilo);


module.exports = router;