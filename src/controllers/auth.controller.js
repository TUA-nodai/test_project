// controllers/auth.controller.js
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { generateToken } = require('../utils/jwt.utils');

// ログイン処理
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // ユーザー検索
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'ユーザー名またはパスワードが無効です'
      });
    }
    
    // パスワード検証
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'ユーザー名またはパスワードが無効です'
      });
    }
    
    // トークン生成
    const token = generateToken({
      id: user.objectid,
      username: user.username
    });
    
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.objectid,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};
