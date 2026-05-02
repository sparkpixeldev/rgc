from PIL import Image
import glob
import numpy as np

steve = np.array(Image.open('test_steve.png').convert('RGB'))
alex = np.array(Image.open('test_alex.png').convert('RGB'))

for file in glob.glob('team/*.png'):
    try:
        img = np.array(Image.open(file).convert('RGB').resize((400, 400)))
        diff_steve = np.mean(np.abs(steve - img))
        diff_alex = np.mean(np.abs(alex - img))
        if diff_steve < 5 or diff_alex < 5:
            print(f"{file}: STEVE ({diff_steve}) or ALEX ({diff_alex})")
    except Exception as e:
        pass
