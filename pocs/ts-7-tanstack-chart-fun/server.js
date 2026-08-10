const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

let server;

const createServer = (port) => {
  return http.createServer((req, res) => {
    let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
    
    if (!filePath.startsWith(DIST_DIR)) {
      res.writeHead(403);
      res.end('Access denied');
      return;
    }
    
    const extname = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.svg': 'image/svg+xml'
    };
    
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          filePath = path.join(DIST_DIR, 'index.html');
          fs.readFile(filePath, (err2, content2) => {
            if (err2) {
              res.writeHead(500);
              res.end('Server Error');
            } else {
              res.writeHead(200, { 'Content-Type': contentType });
              res.end(content2);
            }
          });
        } else {
          res.writeHead(500);
          res.end('Server Error');
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
};

const start = () => {
  if (server) {
    console.error('Server is already running');
    process.exit(1);
  }
  
  server = createServer(PORT);
  
  server.listen(PORT, () => {
    console.log('Server running at http://localhost:' + PORT);
    console.log('Press Ctrl+C to stop');
  });
};

const stop = () => {
  if (server) {
    console.log('Shutting down server...');
    server.close(() => {
      console.log('Server stopped');
      process.exit(0);
    });
  }
};

process.on('SIGINT', stop);
process.on('SIGTERM', stop);

start();
