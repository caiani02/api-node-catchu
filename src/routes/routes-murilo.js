const express = require('express'); 
const router = express.Router(); 

const FeedbacksController = require('../controllers/Feedbacks');

router.post('/feedbacks', FeedbacksController.cadastrarFeedbacks); 
router.get('/feedbacks', FeedbacksController.listarFeedbacks); 
router.patch('/feedbacks/:fbck_id', FeedbacksController.editarFeedbacks); 
router.delete('/feedbacks/:fbck_id', FeedbacksController.apagarFeedbacks); 


module.exports = router ; 