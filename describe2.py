from PIL import Image
import numpy as np

def print_avg(f):
    img = Image.open(f).convert('RGB')
    arr = np.array(img).reshape(-1, 3)
    mean_col = np.mean(arr, axis=0)
    print(f"{f}: avg color {mean_col.astype(int)}")

print_avg('test_steve.png')
print_avg('test_alex.png')
