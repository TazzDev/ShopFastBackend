const express = require('express');

const router = express.Router();
const {createUser, loginUser, logoutUser} = require('../controllers/usercontroller');

router.post('/create',createUser);
router.get('/login',loginUser);
router.delete('/logout',logoutUser);

module.exports = router;