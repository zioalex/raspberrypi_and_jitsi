import json
import sys

# Call with: python3 update_media_chromium_prefs.py .config/chromium/Default/Preferences
# for every lang user

# The desired value for media_stream_mic
# setting = 1 means mic enabled
# setting = 2 meand mic disabled
desired_value = {
    "http://localhost:3000,*": {
        "last_modified": "13360533281672096",
        "last_visit": "13360032000000000",
        "setting": 1
    },
    "http://localhost:3001,*": {
        "last_modified": "13360533281672096",
        "last_visit": "13360032000000000",
        "setting": 1
    },
    "http://localhost:3002,*": {
        "last_modified": "13349645031455168",
        "setting": 1
    },
    "https://translation.sennsolutions.com:443,*": {
        "last_modified": "13359373425412612",
        "last_visit": "13360032000000000",
        "setting": 1
    }
}

# The path to the file is the first command-line argument
file_path = sys.argv[1]

# Load the file
with open(file_path, 'r+') as f:
    data = json.load(f)

    # Check if media_stream_mic is as desired
    if data.get('profile', {}).get('exceptions', {}).get('media_stream_mic') != desired_value:
        # If not, update it
        if 'profile' not in data:
            data['profile'] = {}
        if 'content_settings' not in data['profile']:
            data['profile']['content_settings'] = {}
        if 'exceptions' not in data['profile']['content_settings']:
            data['profile']['content_settings']['exceptions'] = {}
        orig_value = data['profile']['content_settings']['exceptions']['media_stream_mic']
        data['profile']['content_settings']['exceptions']['media_stream_mic'] = desired_value
        print(f'Original Value: {orig_value}\nDesired value : {desired_value}')

        # Write the updated data back to the file
        f.seek(0)
        json.dump(data, f, indent=4)
        f.truncate()