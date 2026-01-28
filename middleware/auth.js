module.exports.ensureAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  req.flash('error_msg', 'Please log in to continue.');
  return res.redirect('/auth/login');
};

module.exports.ensureGuest = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return res.redirect('/');
  return next();
};

module.exports.ensureOwnerOrAdmin = (getResourceAuthorId) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        req.flash('error_msg', 'Please log in to continue.');
        return res.redirect('/auth/login');
      }
      if (req.user.role === 'admin') return next();

      const authorId = await getResourceAuthorId(req);
      if (!authorId) {
        req.flash('error_msg', 'Resource not found.');
        return res.redirect('back');
      }
      if (String(authorId) !== String(req.user._id)) {
        req.flash('error_msg', 'You are not allowed to do that.');
        return res.redirect('back');
      }
      return next();
    } catch (err) {
      return next(err);
    }
  };
};

