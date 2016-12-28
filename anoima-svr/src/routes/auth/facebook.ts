/**
 * Facebook認証コントローラのNode.jsモジュール。
 * @module './routes/auth/facebook'
 */
import * as express from 'express';
import * as passport from 'passport';
const router = express.Router();

// Facebook認証用のパスの登録
router.get('/', passport.authenticate('facebook'));

// Facebookからコールバックで呼ばれるパスの登録
router.get('/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/' }));

module.exports = router;
