const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('d:/Pendidikan/lomba/teacher/tutora-app/app');
let modifiedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes("from 'react-native'") && content.includes('SafeAreaView') && !content.includes("react-native-safe-area-context")) {
    // 1. Remove SafeAreaView from the existing react-native import
    content = content.replace(/SafeAreaView\s*,?\s*/g, '');
    
    // 2. Cleanup empty react-native imports if they arise
    content = content.replace(/import\s*\{\s*\}\s*from\s*['"]react-native['"];?[\r\n]*/, '');
    
    // 3. Add the safe-area-context import correctly
    const newImport = "import { SafeAreaView } from 'react-native-safe-area-context';\n";
    content = newImport + content;

    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
  }
});

console.log(`Replaced SafeAreaView imports in ${modifiedCount} files.`);
