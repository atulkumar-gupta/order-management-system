const rateLimit = require('express-rate-limit');

const authMiddleware = (req, res, next) => {
  const secretKey = req.headers['x-scheduler-secret'];
  
  if (!secretKey) {
    return res.status(401).json({
      success: false,
      error: 'Scheduler secret key is required'
    });
  }

  if (secretKey !== process.env.SCHEDULER_SECRET_KEY) {
    return res.status(403).json({
      success: false,
      error: 'Invalid scheduler secret key'
    });
  }

  next();
};

const orderRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  }
});

module.exports = { authMiddleware, orderRateLimiter };