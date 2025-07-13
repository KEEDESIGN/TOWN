
import { spawn } from 'child_process';

// main.mjsを子プロセスとして実行
const child = spawn('node', ['main.mjs'], {
  stdio: 'inherit'
});

child.on('error', (error) => {
  console.error('Error starting bot:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  console.log(`Bot process exited with code ${code}`);
  process.exit(code);
});
