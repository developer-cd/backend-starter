const permit = (...allowedRoles) => (req, res, next) => {
  const userRoles = (req.user && req.user.roles) || [];
  const ok = userRoles.some(r => allowedRoles.includes(r));
  if (!ok) return res.status(403).json({ message: 'Forbidden' });
  next();
};

module.exports = { permit };
