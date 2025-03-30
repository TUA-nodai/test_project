// middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const UserService = require('../services/user.service');
const { User, Role } = require('../models');

// JWT秘密鍵（実際の環境では環境変数から取得）
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const userService = new UserService(User, Role);

/**
 * リクエストからJWTトークンを抽出
 */
const extractToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.substring(7);
  }
  return null;
};

/**
 * JWT認証ミドルウェア
 */
const authenticate = async (req, res, next) => {
  try {
    // トークンの抽出
    const token = extractToken(req);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '認証トークンがありません'
      });
    }
    
    // トークンの検証
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // ユーザーの取得
    const user = await userService.getUserById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '無効なトークンです'
      });
    }
    
    // リクエストオブジェクトにユーザー情報を追加
    req.user = user;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'トークンの有効期限が切れています'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '無効なトークンです'
      });
    }
    
    next(error);
  }
};

/**
 * ロールベースの認可ミドルウェア
 */
const authorize = (requiredRoles = []) => {
  return async (req, res, next) => {
    try {
      // 認証済みユーザー情報が存在するか確認
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: '認証が必要です'
        });
      }
      
      // ユーザーのロールを取得
      const userRoles = await User.sequelize.query(`
        SELECT r.name 
        FROM "public"."roles" r
        JOIN "public"."user_roles" ur ON r.objectid = ur.role_id
        WHERE ur.user_id = :userId
      `, {
        replacements: { userId: req.user.objectid },
        type: User.sequelize.QueryTypes.SELECT
      });
      
      const roleNames = userRoles.map(role => role.name);
      
      // 必要なロールがなければ拒否
      const hasRequiredRole = requiredRoles.length === 0 || 
        requiredRoles.some(role => roleNames.includes(role));
      
      if (!hasRequiredRole) {
        return res.status(403).json({
          success: false,
          message: 'この操作を実行する権限がありません'
        });
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  authenticate,
  authorize
};
