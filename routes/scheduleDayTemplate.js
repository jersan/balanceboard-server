const express = require('express');
const router = express.Router();

const controller = require('../controllers/scheduleDayTemplateController');



router.get('/:userId', controller.get);

router.post('/create', controller.create);
router.post('/update', controller.update);
router.post('/delete', controller.delete);



module.exports = router;
