import express from 'express';
import userController from '../../controllers/user.controller';
import { validate } from '../../lib/utils';
import userSchema from '../../schema/user.schema';
import expressjwt from 'express-jwt';

const router = express.Router();
const jwtCheck = expressjwt({
  secret: 'RANDOM_TOKEN_SECRET',
  algorithms: ['HS256']
});

const jwtCheckNoRequired = expressjwt({
  secret: 'RANDOM_TOKEN_SECRET',
  algorithms: ['HS256'],
  credentialsRequired: false
});

router
  .route('/')
  /**
   * @swagger
   *
   * /users/:
   *   get:
   *     tags:
   *       - User
   *     produces:
   *       - application/json
   *     summary:
   *       Get information of account
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 users:
   *                   type: array
   *                   items:
   *                     type: object
   *                     example: {
   *                       id: 1, email: quan.do@supremetech.vn,
   *                       firstName: do, lastName: quan,
   *                       gender: 'male|female|other',
   *                       dob: 19/10/1995, phone: '',
   *                       displayName: st-quando, picture: '',
   *                       followers: 0, followings: 0, 
   *                     }
  */
  .get(userController.index)

router
  .route('/register')
  /**
   * @swagger
   *
   * /users/register:
   *   post:
   *     tags:
   *       - Auth
   *     produces:
   *       - application/json
   *     summary:
   *       Register a new account
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             example: {
   *               email: quan.do@supremetech.vn,
   *               password: abc@1234, firstName: do,
   *               lastName: quan, gender: male,
   *               dob: 19/10/1995, phone: '0909090900',
   *               displayName: st-quando
   *             }
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               type: string
   *               example: Create an account successfully.
  */
  .post(validate(userSchema.addUser), userController.create)

router
  .route('/login')
  /**
   * @swagger
   *
   * /users/login:
   *   post:
   *     tags:
   *       - Auth
   *     produces:
   *       - application/json
   *     summary:
   *       Login with email and password
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             example: {
   *               email: quan.do@supremetech.vn,
   *               password: abc@1234
   *             }
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               example: { accessToken: '', userInfo: {
   *                  email: quan.do@supremetech.vn,
   *                  password: abc@1234, firstName: do,
   *                  lastName: quan, gender: male,
   *                  dob: 19/10/1995, phone: '', displayName: st-quando,
   *                  picture: null
   *               } }
  */
  .post(validate(userSchema.login), userController.login)

router
  .route('/logout')
  /**
   * @swagger
   *
   * /users/logout:
   *   post:
   *     tags:
   *       - Auth
   *     produces:
   *       - application/json
   *     summary:
   *       Logout
   *     security:
   *       - jwt: []
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               type: string
   *               example: Logout successfully.
  */
  .post(jwtCheck, userController.logout)

router
  .route('/reset-password')
  /**
   * @swagger
   * 
   * /users/reset-password:
   *   post:
   *     summary: Reset password of an user
   *     tags:
   *     - Auth
   *     produces:
   *       - application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             example: { email: quan.do@supremetech.vn }
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               example: { resetToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyNDUyNzA3OCwiZXhwIjoxNjI0NTMwNjc4fQ.SWkzEjPQ_9WFQchETQCQOUtLv_HyabblVDQHbwBEZHU }
  */
  .post(validate(userSchema.resetPassword), userController.resetPassword)

router
  .route('/change-password')
  /**
   * @swagger
   * 
   * /users/change-password:
   *   put:
   *     summary: Update password an user
   *     tags:
   *     - Auth
   *     produces:
   *       - application/json
   *     security:
   *       - jwt: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             example: { oldPassword: abc@12345, newPassword: abc@123456 }
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               type: string
   *               example: Change password successfully.
  */
  .put(jwtCheck, validate(userSchema.changePassword), userController.changePassword)

router
  .route('/:id')
    /**
   * @swagger
   *
   * /users/{id}:
   *   get:
   *     tags:
   *       - User
   *     produces:
   *       - application/json
   *     summary:
   *       Get user info by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Numeric ID of the user to retrieve.
   *         schema:
   *           type: string
   *           example: me
   *     security:
   *       - jwt: []
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               example: { email: quan.do@supremetech.vn, firstName: do, lastName: quan, displayName: quanDo, picture: null, dob: 19/10/1995, gender: male, followers: 0, followings: 1, isFollowed: true | false }
  */
  .get(jwtCheckNoRequired, userController.get)
  /**
   * @swagger
   *
   * /users/{id}:
   *   put:
   *     tags:
   *       - User
   *     produces:
   *       - application/json
   *     summary:
   *       Update account's information
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Numeric ID of the user to retrieve.
   *         schema:
   *           type: string
   *           example: me
   *     security:
   *       - jwt: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             example: {firstName: do, lastName: quan, phone: '0909090900', gender: male, dob: 19/10/1995, displayName: quanDo}
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               example: {
   *                 userInfo: {
   *                 id: 1, email: quan.do@supremetech.vn,
   *                 firstName: do, lastName: quan,
   *                 phone: 0909090900, gender: male, dob: 19/10/1995,
   *                 displayName: quanDo, picture: '',
   *                 followers: 0, followings: 0
   *               }}
  */
  .put(jwtCheck, validate(userSchema.updatePersonalInfo), userController.update)
  .delete(userController.delete)

router
  .route('/:id/posts')
  .get(jwtCheck, userController.getPosts)
  /**
   * @swagger
   *
   * /users/{id}/posts:
   *   get:
   *     tags:
   *       - User
   *     produces:
   *       - application/json
   *     summary:
   *       Get list of posts with userId
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Numeric ID of the user to retrieve.
   *         schema:
   *           type: string
   *           example: me
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               example: {
   *                 id: 1, email: quan.do@supremetech.vn, firstName: quan, lastName: do,
   *                 displayName: st-quando, gender: male, dob: 19/10/1995,
   *                 Posts: [{
   *                   id: 10,
   *                   title: title of post 10,
   *                   description: description post 10,
   *                   content: content of post 10,
   *                   status: public,
   *                   tags: [],
   *                   userId: 1,
   *                   likes: 0,
   *                   comments: 0,
   *                   cover: null,
   *                 }]
   *               }
  */

export default router;
