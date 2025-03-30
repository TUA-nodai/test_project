const { spawn } = require('child_process');

async function runMigration() {
  if (!(await checkConnection())) {
    console.error('データベース接続に失敗したため、マイグレーションを実行できません');
    return;
  }

  try {
    // 環境変数を設定
    process.env.DATABASE_URL = 'postgres://postgres:yuto@localhost:5432/back4app';
    
    // CLIコマンドを実行
    const migrate = spawn('npx', ['node-pg-migrate', 'up'], { 
      stdio: 'inherit',
      shell: true
    });
    
    migrate.on('close', (code) => {
      if (code === 0) {
        console.log('マイグレーション成功!');
      } else {
        console.error(`マイグレーション失敗: 終了コード ${code}`);
      }
    });
  } catch (err) {
    console.error('マイグレーションエラー:', err);
  }
}
