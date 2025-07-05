const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8081;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './demo.html';
  }
  
  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeType = mimeTypes[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found: ' + req.url);
      } else {
        res.writeHead(500);
        res.end('Server error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, 'localhost', () => {
  console.log('========================================');
  console.log('Executive Command Center Demo Server');
  console.log('========================================');
  console.log('');
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Demo available at: http://localhost:${PORT}/demo.html`);
  console.log('');
  console.log('Demo Login Credentials:');
  console.log('Username: executive@exalt.com');
  console.log('Password: demo123');
  console.log('');
  console.log('Press Ctrl+C to stop the server');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});