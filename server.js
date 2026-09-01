const fs = require('fs');
const http = require('http');
const path = require('path');
const next = require('next');

const logFile = path.join(__dirname, 'server_log.txt');
fs.writeFileSync(logFile, 'Starting Next.js server initialization...\n', 'utf8');

const port = 3000;
const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  fs.appendFileSync(logFile, 'Next.js app prepared successfully! Starting HTTP server on port ' + port + '\n', 'utf8');
  
  const server = http.createServer((req, res) => {
    handle(req, res);
  });

  server.listen(port, '0.0.0.0', (err) => {
    if (err) {
      fs.appendFileSync(logFile, 'Listen error: ' + err.message + '\n', 'utf8');
      process.exit(1);
    }
    fs.appendFileSync(logFile, '🚀 Server listening on http://localhost:' + port + '\n', 'utf8');
  });
}).catch(err => {
  fs.appendFileSync(logFile, 'Preparation error: ' + (err.stack || err.message) + '\n', 'utf8');
  process.exit(1);
});
