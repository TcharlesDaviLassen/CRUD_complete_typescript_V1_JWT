// userRoutes.ts
import express from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Rota de registro de usuário
router.post('/register', UserController.register);

// Rota de login de usuário
router.post('/login', UserController.login);

// Rota protegida que requer autenticação
router.get('/profile', authMiddleware, UserController.profile);

export { router };
