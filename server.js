const express = require('express');
const compression = require('compression');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Enable compression
app.use(compression());

// Custom middleware to force correct MIME types BEFORE static middleware
app.use((req, res, next) => {
    const ext = path.extname(req.path).toLowerCase();

    // Map of extensions to MIME types
    const mimeTypes = {
        '.js': 'application/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.html': 'text/html; charset=utf-8',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.ico': 'image/x-icon',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.eot': 'application/vnd.ms-fontobject'
    };

    // Force the correct MIME type
    if (mimeTypes[ext]) {
        res.type(ext);
    }

    // Aggressive caching for static assets
    if (req.path.includes('/_next/static/')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }

    next();
});

// Serve static files
const staticPath = path.join(__dirname, 'elitexneat.hustlesasa.shop');
console.log('📂 Static path:', staticPath);

app.use(express.static(staticPath, {
    index: false, // Don't automatically serve index.html
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
        // Double-check MIME types as fallback
        const ext = path.extname(filePath).toLowerCase();
        if (ext === '.js') {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        } else if (ext === '.css') {
            res.setHeader('Content-Type', 'text/css; charset=utf-8');
        }
    }
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Server is running',
        staticPath: staticPath
    });
});

// Root route - serve index.html
app.get('/', (req, res) => {
    const indexPath = path.join(staticPath, 'index.html');
    console.log('📄 Serving index.html from:', indexPath);
    res.sendFile(indexPath);
});

// SPA fallback - serve index.html for all other routes that aren't files
app.get('*', (req, res, next) => {
    // Check if the request is for a file (has extension)
    const hasExtension = path.extname(req.path) !== '';

    if (hasExtension) {
        // Let it fall through to 404
        return next();
    }

    // Serve index.html for SPA routes
    res.sendFile(path.join(staticPath, 'index.html'));
});

// 404 handler
app.use((req, res) => {
    console.log('❌ 404:', req.path);
    res.status(404).send('File not found');
});

// Error handling
app.use((err, req, res, next) => {
    console.error('💥 Server error:', err);
    res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('✅ Server is running!');
    console.log('🌍 Port:', PORT);
    console.log('📦 Serving from:', staticPath);
    console.log('🔗 Health check: /health');
    console.log('');
});
