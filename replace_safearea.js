const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      if (content.includes("SafeAreaView") && content.includes("'react-native'")) {
         if (!content.includes("'react-native-safe-area-context'")) {
            // Very brute force
            content = content.replace(/SafeAreaView,\s*/g, '');
            content = content.replace(/,\s*SafeAreaView/g, '');
            content = content.replace(/(import\s+\{\s*SafeAreaView\s*\}\s+from\s+['"]react-native['"];?\n?)/g, '');
            content = `import { SafeAreaView } from 'react-native-safe-area-context';\n` + content;
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`Updated ${fullPath}`);
         }
      }
    }
  }
}

processDir(path.join(__dirname, 'app'));
