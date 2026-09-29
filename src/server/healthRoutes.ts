import express, { Request, Response } from 'express';
import path from 'path';

/**
 * Health check routes
 * Separate file to ensure proper compilation
 */

export function setupHealthRoutes(app: express.Application) {
  // Health check
  app.get('/api/v1/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Tiger Market JARVIS Intelligence',
      version: '1.0.0'
    });
  });

  // Client assets check
  app.get('/api/v1/health/client', (req: Request, res: Response) => {
    const clientDistPath = path.join(process.cwd(), 'src/client/dist');

    try {
      const fs = require('fs');
      const indexHtmlPath = path.join(clientDistPath, 'index.html');
      const jsPath = path.join(clientDistPath, 'assets', 'index-BZtC1Afx.js');
      const cssPath = path.join(clientDistPath, 'assets', 'index-CbijFkdp.css');

      const assets = {
        indexHtml: fs.existsSync(indexHtmlPath) ? '✓ exists' : '✗ missing',
        jsFile: fs.existsSync(jsPath) ? '✓ exists' : '✗ missing',
        cssFile: fs.existsSync(cssPath) ? '✓ exists' : '✗ missing',
        clientDistPath
      };

      res.json({
        ...assets,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to check client assets',
        details: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });
}
