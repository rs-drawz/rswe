const express = require('express');
const multer= require('multer');
const path = require('path')
const upload = multer({storage:multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join( __dirname,'..','uploads/users' ))
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})})
const { registerUser, loginuser, logoutuser, forgotpassword, resetpassword, getuserprofile, changepassword, updateprofile, getallusers, getUser, updateuser, deleteUser } = require('../controllers/autthController');
const { isAuthenticateUser,authorzerole} = require('../middleware/authentiacte-route')
const router = express.Router();

router.route('/register').post(upload.single('avatar'),registerUser);
router.route('/login').post(loginuser);
router.route('/logout').get(logoutuser);
router.route('/password/forgot').post(forgotpassword);
router.route('/password/reset/:token').post(resetpassword);
router.route('/myprofile').get(isAuthenticateUser, getuserprofile);
router.route('/changepassword').put(isAuthenticateUser, changepassword);
router.route('/update').put(isAuthenticateUser, updateprofile);

//admin routes:
router.route('/admin/getallusers').get(isAuthenticateUser,authorzerole('admin'), getallusers);
router.route('/admin/user/:id').get(isAuthenticateUser,authorzerole('admin'), getUser);
router.route('/admin/update/:id').put(isAuthenticateUser,authorzerole('admin'), updateuser);
router.route('/admin/delete/:id').get(isAuthenticateUser,authorzerole('admin'), deleteUser);






module.exports = router;