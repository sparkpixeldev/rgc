from PIL import Image
import numpy as np
import colorsys

def describe_color(rgb):
    r, g, b = [x/255.0 for x in rgb]
    h, s, v = colorsys.rgb_to_hsv(r, g, b)
    if s < 0.1: return "grey"
    if h < 0.05 or h > 0.95: return "red"
    if h < 0.15: return "orange/brown"
    if h < 0.35: return "yellow/green"
    if h < 0.45: return "green"
    if h < 0.65: return "cyan/blue"
    if h < 0.85: return "blue/purple"
    return "pink/red"

for name in ['IntenseSpray', 'rassewassy', 'Eric', 'S3bi', 'DonutW', 'trtlz1', 'unknown']:
    try:
        img = Image.open(f'team/{name}.png').convert('RGB')
        arr = np.array(img).reshape(-1, 3)
        mean_col = np.mean(arr, axis=0)
        print(f"{name}.png: avg color {mean_col.astype(int)}, {describe_color(mean_col)}")
    except Exception as e:
        print(f"{name}: {e}")
