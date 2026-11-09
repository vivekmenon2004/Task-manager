const priorities = new Set(['LOW', 'MEDIUM', 'HIGH']);

function validateTaskId(req, res, next, id) {
  if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) < 1) {
    return res.status(400).json({ error: 'Task ID must be a positive integer' });
  }

  req.params.id = Number(id);
  next();
}

function validateTaskBody(req, res, next) {
  const body = req.body;

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Request body must be a JSON object' });
  }

  if (typeof body.title !== 'string' || body.title.trim().length === 0) {
    return res.status(400).json({ error: 'Title must be a non-empty string' });
  }

  if (body.title.trim().length > 255) {
    return res.status(400).json({ error: 'Title must be 255 characters or fewer' });
  }

  if (body.description !== undefined && body.description !== null && typeof body.description !== 'string') {
    return res.status(400).json({ error: 'Description must be a string or null' });
  }

  const priority = body.priority === undefined ? 'MEDIUM' : body.priority;
  if (typeof priority !== 'string' || !priorities.has(priority)) {
    return res.status(400).json({ error: 'Priority must be LOW, MEDIUM, or HIGH' });
  }

  req.validatedTask = {
    title: body.title.trim(),
    description: body.description ?? null,
    priority,
  };
  next();
}

module.exports = { validateTaskId, validateTaskBody };
