import urllib.request
import json
import base64
import sys

usernames = {
    'IntenseSpray': 'QuackDuckYT',
    'rassewassy': 'RasseXD',
    'Eric': 'honestlynevermjn',
    'S3bi': 'Sebitzu',
    'DonutW': 'DonutW',
    'trtlz1': 'Trtlz'
}

for name, ign in usernames.items():
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
                        skin_url = textures['textures']['SKIN']['url']
                        print(f"{name} ({ign}): {skin_url}")
                    else:
                        print(f"{name} ({ign}): NO CUSTOM SKIN")
    except Exception as e:
        print(f"{name} ({ign}): ERROR {e}")
