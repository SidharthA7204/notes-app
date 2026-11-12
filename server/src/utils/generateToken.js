import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT token for an authenticated user.
 * @param {string} userId - Mongoose user ObjectId string
 * @returns {string} Signed JWT token
 */
export const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'dev_jwt_secret_change_in_production_key_12345';
  const expiresIn = process.env.JWT_EXPIRES_IN || '30d';

  return jwt.sign({ id: userId }, secret, {
    expiresIn,
  });
};

export default generateToken;
