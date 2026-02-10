const express = require('express');
const router = express.Router();
const {
  createMenuItem,
  getMenuItems,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getExternalCoffee,
} = require('../controllers/menuController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createMenuItemSchema,
  updateMenuItemSchema,
} = require('../validators/menuValidator');

router.get('/external/coffee', getExternalCoffee);

router.use(protect);

router.post('/', validate(createMenuItemSchema), createMenuItem);
router.get('/', getMenuItems);
router.get('/:id', getMenuItem);
router.put('/:id', validate(updateMenuItemSchema), updateMenuItem);
router.delete('/:id', deleteMenuItem);

module.exports = router;
