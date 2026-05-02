import urllib.request
from PIL import Image
import io
import numpy as np
import base64
import json

def get_skin_url(ign):
    try:
        url = f"https://api.mojang.com/users/profiles/minecraft/{ign}"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            uuid = data['id']
            
        url = f"https://sessionserver.mojang.com/session/minecraft/profile/{uuid}"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            
            for prop in data['properties']:
                if prop['name'] == 'textures':
                    textures = json.loads(base64.b64decode(prop['value']).decode())
                    if 'SKIN' in textures.get('textures', {}):
                        return textures['textures']['SKIN']['url']
        return None
    except:
        return None

igns = {
    'IntenseSpray': 'QuackDuckYT',
    'rassewassy': 'RasseXD',
    'Eric': 'honestlynevermjn',
    'S3bi': 'Sebitzu',
    'DonutW': 'DonutW',
    'trtlz1': 'Trtlz'
}

for name, ign in igns.items():
    url = get_skin_url(ign)
    if url:
        resp = urllib.request.urlopen(url)
        img = Image.open(io.BytesIO(resp.read())).convert('RGB')
        arr = np.array(img).reshape(-1, 3)
        mean_col = np.mean(arr, axis=0)
        # We can just look if it's very close to steve's texture mean color
        print(f"{name} ({ign}): mean color {mean_col.astype(int)}")
    else:
        print(f"{name} ({ign}): NO SKIN URL (DEFAULT STEVE/ALEX)")
