// middlewares/validators/user.validator.js
const { body, param, query, validationResult } = require('express-validator');

// バリデーション結果をチェックするミドルウェア
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }
  next();
};

// カスタムバリデーター: ユーザー名の一意性チェック
const isUsernameUnique = body('username').custom(async (value) => {
    const user = await User.findOne({ where: { username: value } });
    if (user) {
      return Promise.reject('このユーザー名は既に使用されています');
    }
    return true;
  });

// ユーザー作成のバリデーションルール
const createUserValidator = [
    isUsernameUnique,
    body('username')
    .exists({ checkFalsy: true })
    .withMessage('ユーザー名は必須です')
    .isString()
    .withMessage('ユーザー名は文字列にしてください')
    .isLength({ min: 3, max: 30 })
    .withMessage('ユーザー名は3〜30文字にしてください')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('ユーザー名は英数字とアンダースコアのみ使用できます'),
    
  body('email')
    .exists({ checkFalsy: true })
    .withMessage('メールアドレスは必須です')
    .isEmail()
    .withMessage('有効なメールアドレスを入力してください')
    .normalizeEmail(),
    
  body('password')
    .exists({ checkFalsy: true })
    .withMessage('パスワードは必須です')
    .isString()
    .withMessage('パスワードは文字列にしてください')
    .isLength({ min: 8 })
    .withMessage('パスワードは8文字以上にしてください')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('パスワードには小文字、大文字、数字をそれぞれ1つ以上含める必要があります'),
  
  validate
];

// ユーザー更新のバリデーションルール
const updateUserValidator = [
  param('userId')
    .isString()
    .withMessage('有効なユーザーIDを指定してください'),
    
  body('email')
    .optional()
    .isEmail()
    .withMessage('有効なメールアドレスを入力してください')
    .normalizeEmail(),
    
  body('password')
    .optional()
    .isString()
    .withMessage('パスワードは文字列にしてください')
    .isLength({ min: 8 })
    .withMessage('パスワードは8文字以上にしてください')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('パスワードには小文字、大文字、数字をそれぞれ1つ以上含める必要があります'),
    
  body('emailverified')
    .optional()
    .isBoolean()
    .withMessage('メール確認状態はブール値で指定してください'),
    
  validate
];

// ユーザー一覧取得のバリデーションルール
const getUsersValidator = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit は 1〜100 の整数で指定してください')
    .toInt(),
    
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('offset は 0 以上の整数で指定してください')
    .toInt(),
    
  query('search')
    .optional()
    .isString()
    .withMessage('search は文字列で指定してください'),
    
  query('sortBy')
    .optional()
    .isIn(['createdat', 'updatedat', 'username', 'email'])
    .withMessage('sortBy は createdat, updatedat, username, email のいずれかを指定してください'),
    
  query('sortOrder')
    .optional()
    .isIn(['ASC', 'DESC'])
    .withMessage('sortOrder は ASC または DESC を指定してください'),
    
  validate
];

// 特定のユーザー取得のバリデーションルール
const getUserValidator = [
  param('userId')
    .isString()
    .withMessage('有効なユーザーIDを指定してください'),
    
  validate
];

// ユーザー削除のバリデーションルール
const deleteUserValidator = [
  param('userId')
    .isString()
    .withMessage('有効なユーザーIDを指定してください'),
    
  validate
];

module.exports = {
  createUserValidator,
  updateUserValidator,
  getUsersValidator,
  getUserValidator,
  deleteUserValidator
};
