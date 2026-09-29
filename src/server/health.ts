import path from 'path';
import express from 'express';
import fs from 'fs';

export function healthRoutes(app: express.Application) {
  app.get('/api/v1/health/client', (req: any, res: any) => {
    const clientDistPath = path.join(process.cwd(), 'src/client/dist');
    const fs = require('fs');
    const indexHtml = path.join(clientDistPath, 'index.html');
    const js = path.join(clientDistPath, 'assets', 'index-BZtC1Afx.js');
    const css = path.join(clientDistPath, 'assets', 'index-CbijFkdp.css');
    res.json({
      indexHtml: fs.existsSync(indexHtml) ? '✓' : '✗',
      js: fs.existsSync(js) ? '✓' : '✗',
      css: fs.existsSync(css) ? '✓' : '✗',
      path: clientDistPath,
      timestamp: new Date().toISOString()
    });
  });
}
