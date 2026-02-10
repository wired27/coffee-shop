const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { updateProfileSchema } = require('../validators/userValidator');

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', validate(updateProfileSchema), updateProfile);

module.exports = router;
