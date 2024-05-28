import requests

# Replace with your page access token
page_access_token = ''
page_id = '250451495723325'

# Fetch Followers Count
followers_url = f'https://graph.facebook.com/v11.0/{page_id}?fields=followers_count&access_token={page_access_token}'
followers_response = requests.get(followers_url)
followers_data = followers_response.json()
followers_count = followers_data.get('followers_count', 'N/A')
print(f'Followers Count: {followers_count}')

# Fetch Impressions
impressions_url = f'https://graph.facebook.com/v11.0/{page_id}/insights?metric=page_impressions&access_token={page_access_token}'
impressions_response = requests.get(impressions_url)
impressions_data = impressions_response.json()
print(f'Impressions Data: {impressions_data}')
