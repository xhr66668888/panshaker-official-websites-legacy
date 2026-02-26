const { build } = require('esbuild');
const fs = require('fs');
const path = require('path');

// Ensure dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Copy all source files to dist first
function copyRecursive(src, dest) {
    if (!fs.existsSync(src)) return;
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        for (const entry of fs.readdirSync(src)) {
            // Skip node_modules, .git, dist, docs
            if (['node_modules', '.git', 'dist', 'docs', '.github'].includes(entry)) continue;
            copyRecursive(path.join(src, entry), path.join(dest, entry));
        }
    } else {
        fs.copyFileSync(src, dest);
    }
}

console.log('Copying files to dist/...');
copyRecursive(__dirname, distDir);

async function minify() {
    // Minify JS files
    const jsFiles = ['js/i18n.js', 'js/device.js'];
    for (const file of jsFiles) {
        const input = path.join(distDir, file);
        if (!fs.existsSync(input)) continue;
        const result = await build({
            entryPoints: [input],
            outfile: input,
            allowOverwrite: true,
            minify: true,
            bundle: false,
        });
        const size = fs.statSync(input).size;
        console.log(`Minified ${file} -> ${(size / 1024).toFixed(1)}KB`);
    }

    // Minify CSS
    const cssFiles = ['assets/styles/shared.css'];
    for (const file of cssFiles) {
        const input = path.join(distDir, file);
        if (!fs.existsSync(input)) continue;
        const content = fs.readFileSync(input, 'utf8');
        const result = await build({
            stdin: { contents: content, loader: 'css' },
            write: false,
            minify: true,
        });
        fs.writeFileSync(input, result.outputFiles[0].text);
        const size = fs.statSync(input).size;
        console.log(`Minified ${file} -> ${(size / 1024).toFixed(1)}KB`);
    }

    console.log('Build complete!');
}

minify().catch(err => {
    console.error('Build failed:', err);
    process.exit(1);
});
