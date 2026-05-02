import urllib.request
import json
import base64
import sys

def has_custom_skin(username):
    try:
        # Get UUID
        url = f"https://api.mojang.com/users/profiles/minecraft/{username}"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            uuid = data['id']
            
        # Get Profile
        url = f"https://sessionserver.mojang.com/session/minecraft/profile/{uuid}"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            
            for prop in data['properties']:
                if prop['name'] == 'textures':
                    textures = json.loads(base64.b64decode(prop['value']).decode())
                    if 'SKIN' in textures.get('textures', {}):
                        # Has a custom skin URL
                        return True
            return False
    except Exception as e:
        # User not found or error
        return False

# List of usernames to check
usernames = {
    'IntenseSpray': 'QuackDuckYT',
    'rassewassy': 'RasseXD',
    'Eric': 'honestlynevermjn',
    'S3bi': 'Sebitzu',
    'DonutW': 'DonutW',
    'trtlz1': 'Trtlz'
}

steves = []
for name, ign in usernames.items():
    if not has_custom_skin(ign):
        steves.append(name)

print("Steves:", steves)
