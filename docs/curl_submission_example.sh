# Test submission with curl
curl -X POST "http://localhost:1337/api/submissions" \
  -H "Authorization: Bearer YOUR_API_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "runner": "TestPlayer",                           // REQUIRED: Player/runner name
      "challenge": 17,                                  // REQUIRED: Challenge ID
      "video_url": "https://www.youtube.com/watch?v=example",  // REQUIRED: Video URL
      "result": "02:15:30",                             // OPTIONAL: Run time or score
      "note": "Test submission for development",        // OPTIONAL: Description
      "runner_url": "https://twitch.tv/testplayer"      // OPTIONAL: Runner profile URL
    }
  }'