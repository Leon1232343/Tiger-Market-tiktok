import path from 'path';
import express from 'express';

export function setupSimpleHealth(app: express.Application) {
  app.get('/api/v1/health/client', (req, res) => {
    const clientDistPath = path.join(process.cwd(), 'src/client/dist');
    const fs = require('fs');
    const indexHtml = path.join(clientDistPath, 'index.html');
    const js = path.join(clientDistPath, 'assets', 'index-BZtC1Afx.js');
    const css = path.join(clientDistPath, 'assets', 'index-CbijFkdp.css');

    res.json({
      indexHtml: fs.existsSync(indexHtml) ? 'OK' : 'MISSING',
      js: fs.existsSync(js) ? 'OK' : 'MISSING',
      css: fs.existsSync(css) ? 'OK' : 'MISSING',
      path: clientDistPath
    });
  });
}
