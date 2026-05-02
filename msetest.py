from PIL import Image
import numpy as np

def get_mse(f1, f2):
    i1 = np.array(Image.open(f1).convert('RGB')).astype(float)
    i2 = np.array(Image.open(f2).convert('RGB').resize((i1.shape[1], i1.shape[0]))).astype(float)
    return np.mean((i1 - i2) ** 2)

steve = 'test_steve.png'
alex = 'test_alex.png'
pfps = ['team/IntenseSpray.png', 'team/rassewassy.png', 'team/Eric.png', 'team/S3bi.png', 'team/DonutW.png', 'team/trtlz1.png']

print("MSE compared to Steve:")
for f in pfps:
    print(f"{f}: {get_mse(steve, f)}")

print("\nMSE compared to Alex:")
for f in pfps:
    print(f"{f}: {get_mse(alex, f)}")
