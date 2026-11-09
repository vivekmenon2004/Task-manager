const express = require('express');
const taskController = require('../controllers/taskController');
const { validateTaskBody, validateTaskId } = require('../middleware/taskValidation');

const router = express.Router();

router.param('id', validateTaskId);

router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTask);
router.post('/', validateTaskBody, taskController.createTask);
router.put('/:id', validateTaskBody, taskController.updateTask);
router.patch('/:id/complete', taskController.completeTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
