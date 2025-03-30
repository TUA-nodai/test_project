// src/controllers/userController.js
const UserService = require('../services/user.service');
const { User, Role, Payroll, Assignment } = require('../models');

// サービスのインスタンス化
const userService = new UserService(User, Role);

// ユーザー一覧を取得
exports.getAllUsers = async (req, res, next) => {
  try {
    const options = {
      limit: parseInt(req.query.limit) || 10,
      offset: parseInt(req.query.offset) || 0,
      search: req.query.search || '',
      sortBy: req.query.sortBy || 'createdat',
      sortOrder: req.query.sortOrder || 'DESC'
    };
    
    const users = await userService.getUsers(options);
    
    res.status(200).json({
      success: true,
      message: 'ユーザー一覧を取得しました',
      data: users
    });
  } catch (error) {
    console.error('ユーザー一覧取得エラー:', error);
    res.status(500).json({
      success: false,
      message: 'サーバーエラーが発生しました',
      error: error.message
    });
  }
};

// IDによるユーザー取得
exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id || req.params.userId || req.params.objectid;
    const user = await userService.getUserById(userId);
    
    res.status(200).json({
      success: true,
      message: 'ユーザー情報を取得しました',
      data: user
    });
  } catch (error) {
    if (error.message === 'ユーザーが見つかりません') {
      return res.status(404).json({
        success: false,
        message: error.message,
        errorCode: 'USER_NOT_FOUND'
      });
    }
    
    console.error('ユーザー取得エラー:', error);
    res.status(500).json({
      success: false,
      message: 'サーバーエラーが発生しました',
      error: error.message
    });
  }
};

// 新規ユーザー作成
exports.createUser = async (req, res, next) => {
  try {
    const userData = req.body;
    const newUser = await userService.createUser(userData);
    
    res.status(201).json({
      success: true,
      message: 'ユーザーが正常に作成されました',
      data: newUser
    });
  } catch (error) {
    // 一意性制約違反エラーの処理
    if (error.name === 'SequelizeUniqueConstraintError' || 
        error.message === 'このユーザー名は既に使用されています') {
      return res.status(409).json({
        success: false,
        message: 'このユーザー名は既に使用されています',
        errorCode: 'DUPLICATE_USERNAME'
      });
    }
    
    // メールアドレス重複の場合も同様に処理
    if (error.message === 'このメールアドレスは既に使用されています') {
      return res.status(409).json({
         success: false,
         message: error.message,
         errorCode: 'DUPLICATE_EMAIL'
       });
    }  
    
    // その他のエラーは500を返す
    console.error('ユーザー作成エラー:', error);
    res.status(500).json({
      success: false,
      message: 'サーバーエラーが発生しました',
      error: error.message
    });
  }
};

// ユーザー更新
exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id || req.params.userId || req.params.objectid;
    const updateData = req.body;
    
    const updatedUser = await userService.updateUser(userId, updateData);
    
    res.status(200).json({
      success: true,
      message: 'ユーザー情報が正常に更新されました',
      data: updatedUser
    });
  } catch (error) {
    // ユーザーが見つからない場合の処理
    if (error.message === 'ユーザーが見つかりません') {
      return res.status(404).json({
        success: false,
        message: error.message,
        errorCode: 'USER_NOT_FOUND'
      });
    }
    
    // 一意性制約違反エラーの処理
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      if (field === 'username') {
        return res.status(409).json({
          success: false,
          message: 'このユーザー名は既に使用されています',
          errorCode: 'DUPLICATE_USERNAME'
        });
      } else if (field === 'email') {
        return res.status(409).json({
          success: false,
          message: 'このメールアドレスは既に使用されています',
          errorCode: 'DUPLICATE_EMAIL'
        });
      }
    }
    
    // メールアドレス/ユーザー名重複の場合も同様に処理
    if (error.message === 'このユーザー名は既に使用されています') {
      return res.status(409).json({
        success: false,
        message: error.message,
        errorCode: 'DUPLICATE_USERNAME'
      });
    }
    
    if (error.message === 'このメールアドレスは既に使用されています') {
      return res.status(409).json({
        success: false,
        message: error.message,
        errorCode: 'DUPLICATE_EMAIL'
      });
    }
    
    // その他のエラーは500を返す
    console.error('ユーザー更新エラー:', error);
    res.status(500).json({
      success: false,
      message: 'サーバーエラーが発生しました',
      error: error.message
    });
  }
};

// ユーザー削除
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id || req.params.userId || req.params.objectid;
    await userService.deleteUser(userId);
    
    res.status(200).json({
      success: true,
      message: 'ユーザーが正常に削除されました'
    });
  } catch (error) {
    // ユーザーが見つからない場合の処理
    if (error.message === 'ユーザーが見つかりません') {
      return res.status(404).json({
        success: false,
        message: error.message,
        errorCode: 'USER_NOT_FOUND'
      });
    }
    
    // その他のエラーは500を返す
    console.error('ユーザー削除エラー:', error);
    res.status(500).json({
      success: false,
      message: 'サーバーエラーが発生しました',
      error: error.message
    });
  }
};

// ユーザー認証（ログイン）
exports.loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'ユーザー名とパスワードは必須です',
        errorCode: 'MISSING_CREDENTIALS'
      });
    }
    
    const authResult = await userService.authenticateUser(username, password);
    
    res.status(200).json({
      success: true,
      message: 'ログインに成功しました',
      data: {
        user: authResult.user,
        token: authResult.token
      }
    });
  } catch (error) {
    if (error.message === 'ユーザーが見つかりません' || 
        error.message === 'パスワードが正しくありません') {
      return res.status(401).json({
        success: false,
        message: 'ユーザー名またはパスワードが正しくありません',
        errorCode: 'INVALID_CREDENTIALS'
      });
    }
    
    console.error('ログインエラー:', error);
    res.status(500).json({
      success: false,
      message: 'サーバーエラーが発生しました',
      error: error.message
    });
  }
};
