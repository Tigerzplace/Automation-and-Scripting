import json
import html
import re
# Load the encoded JSON content from the file
with open('Response.html', 'r', encoding='utf-8') as file:
    encoded_content = file.read()

# Decode HTML entities
decoded_content = html.unescape(encoded_content)

# Save the decoded content to a new HTML file
with open('decoded.html', 'w', encoding='utf-8') as decoded_file:
    decoded_file.write(decoded_content)

# Extract JSON-like content using regex to clean up any extraneous characters
json_pattern = re.compile(r'({.*})', re.DOTALL)
json_match = json_pattern.search(decoded_content)

if json_match:
    json_string = json_match.group(1)

    # Attempt to load the extracted JSON string
    try:
        json_data = json.loads(json_string)
        with open('responseJson.json', 'w', encoding='utf-8') as json_file:
            json.dump(json_data, json_file, indent=4)
        print("JSON content successfully extracted and saved.")
    except json.JSONDecodeError:
        print("Failed to decode JSON. The extracted content might still have issues.")
else:
    print("No JSON content found in the decoded HTML.")

# Function to find the path to a specific value in a nested dictionary
def find_path(json_obj, target, path=None):
    if path is None:
        path = []
    if isinstance(json_obj, dict):
        for key, value in json_obj.items():
            new_path = path + [key]
            if isinstance(value, (dict, list)):
                result = find_path(value, target, new_path)
                if result:
                    return result
            elif value == target:
                return new_path
    elif isinstance(json_obj, list):
        for index, item in enumerate(json_obj):
            new_path = path + [index]
            result = find_path(item, target, new_path)
            if result:
                return result
    return None

# The target URL
target_url = "https://www.linkedin.com/company/deepscale-technology/"

# Find the path to the target URL
path_to_url = find_path(json_data, target_url)

if path_to_url:
    print("Traversing path to the URL:", path_to_url)
else:
    print("URL not found in the JSON response.")
