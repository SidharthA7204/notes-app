/**
 * Validate user registration input
 */
export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (name.trim().length > 50) {
    errors.push({ field: 'name', message: 'Name cannot exceed 50 characters' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!emailRegex.test(email.trim())) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  if (!password || typeof password !== 'string') {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

/**
 * Validate user login input
 */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email is required' });
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

/**
 * Validate note creation / update input
 */
export const validateNote = (req, res, next) => {
  const { title, content } = req.body;
  const errors = [];

  // For POST (create), title and content are mandatory
  if (req.method === 'POST') {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      errors.push({ field: 'title', message: 'Title is required' });
    }
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      errors.push({ field: 'content', message: 'Content is required' });
    }
  }

  // Length validations if provided
  if (title !== undefined && (typeof title !== 'string' || title.trim().length > 150)) {
    errors.push({ field: 'title', message: 'Title cannot exceed 150 characters' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};
