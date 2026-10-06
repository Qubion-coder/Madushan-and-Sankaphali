import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

def replacer(match):
    class_str = match.group(1)
    
    # Remove border classes
    # regex matches boundary, optional group-hover:, border, and optional suffix
    # we don't want to break the quotes or backticks though
    cleaned = re.sub(r'\b(?:group-hover:)?border(?:-[a-zA-Z0-9_/#\.\[\]\-]+)?\b', '', class_str)
    
    # remove double spaces
    cleaned = re.sub(r' +', ' ', cleaned)
    
    return match.group(0).replace(class_str, cleaned)

new_text = re.sub(r'className=\"([^\"]+)\"', replacer, text)
new_text = re.sub(r'className=\{`([^`]+)`\}', replacer, new_text)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Borders removed")
