import os
import re
import sys

def strip_comments(content, file_ext):
    if file_ext == '.html':
        # Strip HTML comments <!-- ... -->
        return re.sub(r'<!--[\s\S]*?-->', '', content)
    elif file_ext == '.css':
        # Strip CSS comments /* ... */
        return re.sub(r'/\*[\s\S]*?\*/', '', content)
    elif file_ext == '.js':
        # Strip JS block comments /* ... */
        content = re.sub(r'/\*[\s\S]*?\*/', '', content)
        # Strip JS line comments // ... (careful not to match URLs)
        # simplistic regex: matches // not preceded by : (for https://)
        # Better: iterate lines
        lines = content.split('\n')
        new_lines = []
        for line in lines:
            # Check for // but not inside quotes or after http:
            # Simple heuristic for this project: remove // if it's not part of a string
            # For robustness, we'll use a safer regex or just basic // stripping 
            # assuming standard code style.
            # Removing everything after //
            line = re.sub(r'(?<!:)\/\/.*$', '', line) 
            new_lines.append(line)
        return '\n'.join(new_lines)
    return content

def process_directory(root_dir):
    print(f"Processing directory: {root_dir}")
    for dirpath, _, filenames in os.walk(root_dir):
        if 'node_modules' in dirpath or '.git' in dirpath:
            continue
            
        for filename in filenames:
            file_ext = os.path.splitext(filename)[1].lower()
            if file_ext in ['.html', '.css', '.js']:
                file_path = os.path.join(dirpath, filename)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = strip_comments(content, file_ext)
                    
                    # Remove empty lines that might have been left behind
                    new_content = re.sub(r'^\s*$\n', '', new_content, flags=re.MULTILINE)

                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    
                    print(f"Stripped: {file_path}")
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 strip_comments.py <directory>")
        sys.exit(1)
    
    target_dir = sys.argv[1]
    process_directory(target_dir)
