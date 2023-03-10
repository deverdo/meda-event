import * as passport from 'passport';

/**
 * @DESC General User Authentication
 */
const userAuth = function (req: any, res: any, next: any) {
  passport.authenticate('jwt', { session: false }, function (err, user, info) {
    if (err) {

      console.log('==================== in passport error ==========================')
      console.log(err)
      return next(err);
    }
    if (!user) {

      console.log("=========================== user not found=====================")
      return res
        .status(401)
        .json({ error: info?.message || 'Unauthenticated user!' });
    }
    req.user = user;
    return next();
  })(req, res, next);
};
// const userAuth = passport.authenticate('jwt', { session: false });
export default userAuth;
