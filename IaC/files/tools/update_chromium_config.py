#!/usr/bin/env python3
import json
import sys
import shutil
import datetime

# Call with: python3 update_media_chromium_prefs.py .config/chromium/Default/Preferences
# for every lang user

# The desired value for media_stream_mic
# setting = 1 means mic enabled
# setting = 2 meand mic disabled
desired_value = desired_value = {'http://localhost:3000,*': {'setting': 1}, 'http://localhost:3001,*': {'setting': 1}, 'http://localhost:3002,*': {'setting': 1}, 'https://translation.sennsolutions.com:443,*': {'setting': 1}}


# The path to the file is the first command-line argument
file_path = sys.argv[1]

# Load the file
with open(file_path, 'r+') as f:
    data = json.load(f)

    # Check if media_stream_mic is as desired
    orig_value = data.get('profile', {}).get('content_settings', {}).get('exceptions', {}).get('media_stream_mic')

    if orig_value != desired_value:
        # If not, update it
        if 'profile' not in data:
            data['profile'] = {}
        if 'content_settings' not in data['profile']:
            data['profile']['content_settings'] = {}
        if 'exceptions' not in data['profile']['content_settings']:
            data['profile']['content_settings']['exceptions'] = {}
            
        # Backup the original file
        backup_path = f"{file_path}.backup_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
        shutil.copyfile(file_path, backup_path)
        print(f"Backup created at {backup_path}")

        data['profile']['content_settings']['exceptions']['media_stream_mic'] = desired_value
        print(f'Original Value: {orig_value}\nDesired value : {desired_value}')

        # Write the updated data back to the file
        f.seek(0)
        json.dump(data, f, indent=None, separators=(',', ':'))
        f.truncate()
    else:
        print('Chromium Config Value already set as desired')