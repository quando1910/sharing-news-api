import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/google', (req, res, next) => {
  const { redirectTo } = req.query;
  const state = redirectTo ? redirectTo.toString() : undefined;

  const authenticator = passport.authenticate('google', { scope: ['email', 'profile'], state });
  authenticator(req, res, next);
})

router.get('/google/callback', passport.authenticate('google',
  { failureRedirect: '/failure' }
), (req, res, next) => {
  const redirectTo = req.query['state'];
  if (typeof redirectTo === 'string') {
    return res.redirect(redirectTo)
  }
  res.redirect('/')
});

export default router;
