import { spawn } from 'child_process';

const server = spawn('npm', ['--prefix', 'server', 'run', 'dev'], { stdio: 'inherit', shell: true });
const client = spawn('npm', ['--prefix', 'client', 'run', 'dev'], { stdio: 'inherit', shell: true });

function cleanup() {
  server.kill();
  client.kill();
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
