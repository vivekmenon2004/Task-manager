const { query } = require('../db/database');

async function getTasks(req, res, next) {
  try {
    const { rows } = await query(
      'SELECT * FROM tasks ORDER BY created_at DESC'
    );
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
}

async function getTask(req, res, next) {
  try {
    const { rows } = await query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
}

async function createTask(req, res, next) {
  try {
    const { title, description = null, priority = 'MEDIUM' } = req.body || {};
    const { rows } = await query(
      `INSERT INTO tasks (title, description, priority)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, description, priority]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
}

async function updateTask(req, res, next) {
  try {
    const { title, description = null, priority = 'MEDIUM' } = req.body || {};
    const { rows } = await query(
      `UPDATE tasks
       SET title = $1, description = $2, priority = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [title, description, priority, req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
}

async function completeTask(req, res, next) {
  try {
    const { rows } = await query(
      `UPDATE tasks
       SET completed = TRUE, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    const { rows } = await query(
      'DELETE FROM tasks WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
};
