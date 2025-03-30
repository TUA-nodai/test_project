// services/user.service.js
const { models } = require('sequelize');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

class UserService {
  constructor(userModel, roleModel) {
    this.User = userModel;
    this.Role = roleModel;
  }

  /**
   * ユーザー一覧を取得
   * @param {Object} options - クエリオプション
   * @returns {Promise<Array>} ユーザーリスト
   */
  async getUsers(options = {}) {
    const { limit = 10, offset = 0, search = '', sortBy = 'createdat', sortOrder = 'DESC' } = options;
    
    // 検索条件の構築
    const whereCondition = search 
      ? {
          [Op.or]: [
            { username: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } }
          ]
        } 
      : {};
    
    // ソート順の設定
    const order = [[sortBy, sortOrder]];
    
    try {
      const users = await this.User.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        order,
        attributes: ['objectid', 'username', 'email', 'emailverified', 'createdat', 'updatedat'],
      });
      
      return {
        total: users.count,
        users: users.rows,
        limit,
        offset
      };
    } catch (error) {
      console.error('ユーザー一覧取得エラー:', error);
      throw new Error('ユーザー一覧の取得に失敗しました');
    }
  }

  /**
   * 特定のユーザーを取得
   * @param {string} userId - ユーザーID
   * @returns {Promise<Object>} ユーザー情報
   */
  async getUserById(userId) {
    try {
      const user = await this.User.findByPk(userId, {
        attributes: ['objectid', 'username', 'email', 'emailverified', 'createdat', 'updatedat'],
      });
      
      if (!user) {
        throw new Error('ユーザーが見つかりません');
      }
      
      return user;
    } catch (error) {
      console.error(`ユーザー(ID: ${userId})取得エラー:`, error);
      throw error;
    }
  }

  /**
   * 新規ユーザーを作成
   * @param {Object} userData - ユーザーデータ
   * @returns {Promise<Object>} 作成されたユーザー情報
   */
  async createUser(userData) {
    try {
      // 既存ユーザー確認のクエリ
   　　 // ユーザー名の重複チェック
   　　 const existingUser = await this.User.findOne({
        where: { username: userData.username }
      });
      
      if (existingUser) {
        throw new Error('このユーザー名は既に使用されています');
      }
      
      // パスワードのハッシュ化
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // UUIDの生成（実際の環境ではuuidパッケージを使うとよい）
      //const objectid = `usr_${Math.floor(Math.random() * 100)}`;
      const { v4: uuidv4 } = require('uuid');
      const objectid = `usr_${uuidv4()}`;

      // ユーザー作成
      const newUser = await this.User.create({
        objectid: `usr_${Date.now()}`, // UUIDの生成
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        emailverified: false,
        createdat: new Date(),
        updatedat: new Date(),
        acl: { "*": { "read": true } }
      });
      
      // 認証情報を除外して返却
      const { password, ...userWithoutPassword } = newUser.toJSON();
      return userWithoutPassword;
    } catch (error) {
      console.error('ユーザー作成エラー:', error);
      throw error;
    }
  }

  /**
   * ユーザー情報を更新
   * @param {string} userId - ユーザーID
   * @param {Object} updateData - 更新データ
   * @returns {Promise<Object>} 更新されたユーザー情報
   */
  async updateUser(userId, updateData) {
    try {
      const user = await this.User.findByPk(userId);
      
      if (!user) {
        throw new Error('ユーザーが見つかりません');
      }
      
      // メールアドレスの重複チェック
      if (updateData.email && updateData.email !== user.email) {
        const existingEmail = await this.User.findOne({
          where: { email: updateData.email }
        });
        
        if (existingEmail) {
          throw new Error('このメールアドレスは既に使用されています');
        }
      }
      
      // パスワード更新があれば暗号化
      if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
      }
      
      // 更新日時を設定
      updateData.updatedat = new Date();
      
      // データ更新
      await user.update(updateData);
      
      // 最新情報を取得
      const updatedUser = await this.User.findByPk(userId, {
        attributes: ['objectid', 'username', 'email', 'emailverified', 'createdat', 'updatedat'],
      });
      
      return updatedUser;
    } catch (error) {
      console.error(`ユーザー(ID: ${userId})更新エラー:`, error);
      throw error;
    }
  }

  /**
   * ユーザーを削除
   * @param {string} userId - ユーザーID
   * @returns {Promise<boolean>} 削除成功フラグ
   */
  async deleteUser(userId) {
    try {
      const user = await this.User.findByPk(userId);
      
      if (!user) {
        throw new Error('ユーザーが見つかりません');
      }
      
      // ユーザーに関連するロールの関係も削除
      await this.User.sequelize.query(`
        DELETE FROM "public"."user_roles" WHERE "user_id" = :userId
      `, {
        replacements: { userId }
      });
      
      // ユーザー削除
      await user.destroy();
      
      return true;
    } catch (error) {
      console.error(`ユーザー(ID: ${userId})削除エラー:`, error);
      throw error;
    }
  }

  /**
   * 認証用のユーザー検索
   * @param {string} username - ユーザー名
   * @returns {Promise<Object>} パスワードを含むユーザー情報
   */
  async findUserForAuth(username) {
    try {
      return await this.User.findOne({
        where: { username },
        attributes: ['objectid', 'username', 'email', 'password', 'emailverified']
      });
    } catch (error) {
      console.error('認証用ユーザー検索エラー:', error);
      throw new Error('認証に失敗しました');
    }
  }
}

module.exports = UserService;
