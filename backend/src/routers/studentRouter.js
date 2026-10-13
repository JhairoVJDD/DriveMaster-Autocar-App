const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

const { verifyOptionalToken } = require('../middlewares/authMiddleware');

router.get('/', verifyOptionalToken, studentController.getAllStudents);
router.post('/', studentController.createStudent);

module.exports = router;
