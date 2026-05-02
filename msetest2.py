from PIL import Image
import numpy as np
import glob

def get_mse(f1, f2):
    i1 = np.array(Image.open(f1).convert('RGB')).astype(float)
    i2 = np.array(Image.open(f2).convert('RGB').resize((i1.shape[1], i1.shape[0]))).astype(float)
    return np.mean((i1 - i2) ** 2)

steve = 'test_steve.png'
alex = 'test_alex.png'
non = 'test_nonexist.png'

for f in glob.glob('team/*.png'):
    ms = get_mse(steve, f)
    ma = get_mse(alex, f)
    mn = get_mse(non, f)
    if ms < 500 or ma < 500 or mn < 500:
        print(f"BINGO: {f} (Steve: {ms}, Alex: {ma}, Non: {mn})")

