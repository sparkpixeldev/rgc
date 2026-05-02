import urllib.request
from PIL import Image
import io
import numpy as np
import base64
import json

def get_mean(ign):
    url = f"https://api.mojang.com/users/profiles/minecraft/{ign}"
    req = urllib.request.Request(url)
    resp = json.loads(urllib.request.urlopen(req).read().decode())
    url2 = f"https://sessionserver.mojang.com/session/minecraft/profile/{resp['id']}"
    req2 = urllib.request.Request(url2)
    resp2 = json.loads(urllib.request.urlopen(req2).read().decode())
    for prop in resp2['properties']:
        if prop['name'] == 'textures':
            t = json.loads(base64.b64decode(prop['value']).decode())
            if 'SKIN' in t['textures']:
                url3 = t['textures']['SKIN']['url']
                r3 = urllib.request.urlopen(url3)
                img = Image.open(io.BytesIO(r3.read())).convert('RGB')
                arr = np.array(img).reshape(-1, 3)
                return np.mean(arr, axis=0)
    return None

print("Steve:", get_mean('MHF_Steve').astype(int))
print("Alex:", get_mean('MHF_Alex').astype(int))
