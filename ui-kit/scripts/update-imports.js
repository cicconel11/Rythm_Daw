import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to process a single file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // This regex matches relative imports without .js extension
    // It looks for patterns like: from "./path/to/module" or from '../path/to/module'
    // but skips node_modules and already has .js/.ts/.tsx extensions
    const importRegex = /from\s+['"](?:\.\.?\/)+(?!node_modules\/)(?!.*\.[jt]sx?['"])([^'"\s]+)['"]/g;
    
    const updatedContent = content.replace(importRegex, (match, p1) => {
      // Skip if it's a CSS/SCSS import or already has an extension
      if (p1.endsWith('.css') || p1.endsWith('.scss') || p1.endsWith('.json')) {
        return match;
      }
      // Add .js extension
      return `from "${p1}.js"`;
    });
    
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Updated imports in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Function to walk through directories
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      processFile(filePath);
    }
  });
}

// Start processing from the src directory
const srcDir = path.join(__dirname, '../src');
walkDir(srcDir);

console.log('Import updates complete!');
