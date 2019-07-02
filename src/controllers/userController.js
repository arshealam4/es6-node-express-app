import config from 'config';
import UsersModel1 from'../lib/maindb';
const UsersModel =  UsersModel1.model('Users');
import sha5 from'js-sha512';
const sha512 =  sha5.sha512;
import jwt from'jsonwebtoken';
import responseHandler from '../lib/responseHandler'
import * as polyfill from 'babel-polyfill';

class userController {
    constructor() { }

    signup = async (req, res, next) => {

        const userName = req.body.userName;
        const email = req.body.email;
        const password = req.body.password;
        const gender = req.body.gender;
    
        if (!userName || !email || !password) {
            return responseHandler.makeResponse(res, false, 400, 'invalid input parameters!', []);
        }
        try {
            let user = await UsersModel.findOne({ email: email });
            if(user) {
                return responseHandler.makeResponse(res, false, 200, 'user already exist!', []);
            }
            let userObj =  new UsersModel({
                userName: userName,
                email: email,
                password: sha512(password),
                gender: gender,
            });
            await userObj.save()
            return responseHandler.makeResponse(res, true, 201, 'user successfully registered!', []);
        } catch(err) {
            return responseHandler.makeResponse(res, false, 500, 'internel server error!', []);
        }
    };
    
    login = async (req, res, next) => {
        
        const email = req.body.email.toLowerCase();
        let password = req.body.password;
        const role = req.body.role ? req.body.role : 'user';
    
        if (!email || !password) {
            return responseHandler.makeResponse(res, false, 400, 'invalid input parameters', []);
        }
    
        try {
            password = sha512(password);
    
            let user = await UsersModel.findOne({ email: email, password: password, active: true, role: role });
    
            if (!user) {
    
                let user = await UsersModel.findOne({ email: email, password: password });
    
                if (!user) {
                    return responseHandler.makeResponse(res, false, 400, 'username or password is incorrect!', []);
                } else if(!user.active) {
                    return responseHandler.makeResponse(res, false, 400, 'user not activated, Please check your email to activate account!', []);
                } else {
                    return responseHandler.makeResponse(res, false, 400, 'thers is some issue, please try again!', []);
                }
            } else {
                const token = jwt.sign({
                    _id: user._id,
                    email: user.email,
                    role: user.role,
                }, config.get('secret'), {
                        expiresIn: config.get('jwt_expiretime'),
                    });

                return responseHandler.makeResponse(res, true, 200, 'login success', [{token: token, email: user.email}]);
    
            }
    
        } catch (err) {
            return responseHandler.makeResponse(res, false, 500, 'internel server error', []);
        }
    };
    
    getUserList = async (req, res, next) => {
    
        const perPage = parseInt(req.params.perPage);
        const page = parseInt(req.params.page);
        const skip = perPage * (page - 1);
    
        if (perPage && page) {
            let user = await UsersModel.find({}, '-password').skip(skip).limit(perPage);
            return responseHandler.makeResponse(res, true, 200, 'success', user)
        } else {
            try {
                let user = await UsersModel.find({}, '-password');
                return responseHandler.makeResponse(res, true, 200, 'success', user)
            } catch (err) {
                console.log(err)
                return responseHandler.makeResponse(res, false, 500, 'failed', [])
            }
        }
        
    };
}

export default new userController();
