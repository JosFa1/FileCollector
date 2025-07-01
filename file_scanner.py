import os

def collect_files(folder, extensions):
    seen = set()
    normalized = []
    for ext in extensions:
        if not ext.startswith('.'):
            ext = '.' + ext
        ext = ext.lower()
        if not ext[1:].isalnum():
            continue
        if ext not in seen:
            seen.add(ext)
            normalized.append(ext)

    results = []
    for root, _, files in os.walk(folder):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in normalized:
                rel_path = os.path.relpath(os.path.join(root, file), folder).replace("\\", "/")
                with open(os.path.join(root, file), 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    results.append(f'./{rel_path}:"{content}"')
    return results
