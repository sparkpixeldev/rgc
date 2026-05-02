import re
import os

with open('index.html', 'r') as f:
    content = f.read()

# Find all team pfps
pfps = re.findall(r'src="team/([^"]+)\.png"', content)
pfps = list(set([p for p in pfps if p != 'unknown']))
print("Users:", pfps)
