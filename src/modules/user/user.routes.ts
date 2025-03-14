import { Router } from 'express';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const router = Router();
const userController = new UserController(UserService.getInstance());

router.use((req, res, next) => {
  console.log(`📢 ${req.method} ${req.url}`);
  next();
});

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieves all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/', (req, res, next) => userController.getAllUsers(req, res));

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieves a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User successfully found
 *       404:
 *         description: User not found
 */
router.get('/:id', (req, res, next) => userController.getUserById(req, res));

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Creates a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User successfully created
 */
router.post('/', (req, res, next) => userController.createUser(req, res));

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deletes a user by ID (admin only)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: User successfully deleted
 */
router.delete('/:id', (req, res, next) => userController.deleteUser(req, res));

export default router;
