#!/usr/bin/python
# used to generate a token which is then placed in env.server_example as SPOTIFY_KEY
# https://developer.spotify.com/my-applications
import spotipy.util as util

SPOTIFY_ID = '82b8c1d6b7e449848e43b82a0ee0d313'
SPOTIFY_SECRET = '8973a4ccad614f7889b40a9f483e4f30'
SPOTIFY_REDIRECT_URI = 'http://app.playit.se:8080'


token = util.prompt_for_user_token(
    "tejpbit",
    client_id=SPOTIFY_ID,
    client_secret=SPOTIFY_SECRET,
    redirect_uri=SPOTIFY_REDIRECT_URI
)
print("%r" % token)

"""
Request:
https://accounts.spotify.com/authorize/?client_id=82b8c1d6b7e449848e43b82a0ee0d313&response_type=code&redirect_uri=http%3A%2F%2Fapp.playit.se%3A8080&scope=user-read-private%20user-read-email


Response:
http://app.playit.se:8080/?code=AQC2SfKKddDW-5HbZpcWN6MwKf_617p73EBd2ClEHrPC7luDu5Hj8w45XeG9E1x8J_qlXq3dkFur-rnWXB-gZe7VDdC4Bq3Y1hQnYpumEQfRfJusyuGk5pfUJOogwH-7Ld1XkCr_n4Wk6sjElkDKpGDGx7nrhys8jxhz_Fv8jp8rWQgkQRDAwlmwbGl8jbFCgoPtyR0BQL9un-XKfKOrJl7iv3jzDIy9r6jjK5jNRQPS9sM


Requst:
curl -H "Authorization: Basic ODJiOGMxZDZiN2U0NDk4NDhlNDNiODJhMGVlMGQzMTM6ODk3M2E0Y2NhZDYxNGY3ODg5YjQwYTlmNDgzZTRmMzA=" -d grant_type=refresh_token -d refresh_token=AQACbnqma3nMxqb-pEQLxTO972ymHk20TuXsP9iwlboxcLrHIH7Lj4jl_H0akigDeaJaeThzB4gRIAzdAQcABvw74NpqXzRAKr_TU_mM-gqFxqj6BhJG6zt1jLyYGMoMvpA -d redirect_uri=http%3A%2F%2Fapp.playit.se%3A8080 https://accounts.spotify.com/api/token

Respone:
{"access_token":"BQB1oDsRiraRNnuqBK9uoom8K9tza0UZkI_JmMfvCBw_BjsnI69khr0vuIvEZNwWLOAKHMvt1RXr6EW2yFIlE2M1MAAZGeEWnoHfbn3Vx0gUprhO06aPQ9m_Na-T92my4swLWPARpK0RmWCLfwZSK3u7c7aqsX0","token_type":"Bearer","expires_in":3600,"refresh_token":"AQACbnqma3nMxqb-pEQLxTO972ymHk20TuXsP9iwlboxcLrHIH7Lj4jl_H0akigDeaJaeThzB4gRIAzdAQcABvw74NpqXzRAKr_TU_mM-gqFxqj6BhJG6zt1jLyYGMoMvpA"}
"""
