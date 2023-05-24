// authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Verifique se o token de acesso está presente no cabeçalho da solicitação
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token de acesso não fornecido' });
        }

        // Verifique a validade do token
        const decoded: any = jwt.verify(token, 'chave-secreta-do-token');
        req.params.userId = decoded.userId; // armazene o ID do usuário autenticado no objeto de solicitação

        next();
    } catch (error) {
        console.error('Erro durante a autenticação:', error);
        res.status(401).json({ message: 'Falha na autenticação' });
    }
};

export { authMiddleware };
