module.exports.ensureAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Please log in to continue.' });
};

module.exports.ensureGuest = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.status(403).json({ error: 'You are already logged in.' });
  }
  return next();
};

module.exports.ensureOwnerOrAdmin = (getResourceAuthorId) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Please log in to continue.' });
      }
      if (req.user.role === 'admin') return next();

      const authorId = await getResourceAuthorId(req);
      if (!authorId) {
        return res.status(404).json({ error: 'Resource not found.' });
      }
      
      const resourceId = String(authorId);
      const userId = String(req.user.id);

      if (resourceId !== userId) {
        return res.status(403).json({ error: 'You are not allowed to do that.' });
      }
      return next();
    } catch (err) {
      return next(err);
    }
  };
};
