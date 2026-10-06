import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

classes_matches = re.findall(r'(?:className=\"([^\"]+)\"|className=\{`([^`]+)`\})', text)
classes_str = ""
for m in classes_matches:
    classes_str += " " + (m[0] or m[1])

border_classes = set()
for cls in classes_str.split():
    if 'border' in cls:
        border_classes.add(cls)

for bc in border_classes:
    print(bc)
