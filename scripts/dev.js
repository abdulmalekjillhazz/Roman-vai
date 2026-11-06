import { spawn } from 'child_process';
import net from 'net';
import path from 'path';
import { fileURLToPath } from 'url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requestedPort = process.env.API_PORT;

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const probe = net.createServer();
    probe.once('error', () => resolve(false));
    probe.listen(Number(port), () => probe.close(() => resolve(true)));
  });
}

async function findApiPort() {
  if (requestedPort) {
    if (!(await isPortAvailable(requestedPort))) {
      throw new Error(`API_PORT ${requestedPort} is already in use.`);
    }
    return requestedPort;
  }

  for (let port = 5000; port < 5100; port += 1) {
    if (await isPortAvailable(port)) return String(port);
  }

  throw new Error('No available API port found between 5000 and 5099. Set API_PORT to choose one.');
}

const apiPort = await findApiPort();
const serverEnv = { ...process.env, API_PORT: apiPort, PORT: apiPort };
const webEnv = { ...process.env, API_PORT: apiPort, PORT: process.env.WEB_PORT || '3000' };
const server = spawn(process.execPath, ['server/src/app.js'], {
  cwd: projectRoot,
  env: serverEnv,
  stdio: 'inherit'
});
const web = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev'], {
  cwd: projectRoot,
  env: webEnv,
  stdio: 'inherit'
});
let stopping = false;

function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  server.kill();
  web.kill();
  process.exitCode = exitCode;
}

server.once('error', (error) => {
  console.error('Could not start the API server:', error);
  stop(1);
});
web.once('error', (error) => {
  console.error('Could not start the Next.js app:', error);
  stop(1);
});
server.once('close', (code) => {
  if (!stopping) stop(code || 0);
});
web.once('close', (code) => {
  if (!stopping) stop(code || 0);
});

process.once('SIGINT', () => stop(0));
process.once('SIGTERM', () => stop(0));
