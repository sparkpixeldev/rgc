from PIL import Image
import numpy as np

def img_to_array(f):
    img = Image.open(f).convert('RGB')
    return np.array(img).flatten()

pfps = ['team/IntenseSpray.png', 'team/rassewassy.png', 'team/Eric.png', 'team/S3bi.png', 'team/DonutW.png', 'team/trtlz1.png']

for f in pfps:
    a = img_to_array(f)
    print(f"{f}")

