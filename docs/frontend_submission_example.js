// Frontend submission request example
const submitRun = async (submissionData) => {
  const API_URL = 'http://localhost:1337/api/submissions';
  const API_TOKEN = 'YOUR_API_TOKEN_HERE'; // Replace with actual token

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          runner: submissionData.runner,           // REQUIRED: string - Player/runner name
          challenge: submissionData.challengeId,   // REQUIRED: number - Challenge ID
          video_url: submissionData.videoUrl,      // REQUIRED: string - YouTube/Twitch video URL
          result: submissionData.runTime,          // REQUIRED: string - Run time (e.g., "02:15:30")
          note: submissionData.description,        // OPTIONAL: string - Description/notes
          runner_url: submissionData.runnerUrl      // OPTIONAL: string - Runner's profile URL
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Submission failed: ${errorData.error?.message || response.statusText}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Submission error:', error);
    throw error;
  }
};

// Example usage:
const submissionData = {
  runner: "ProGamer123",                           // REQUIRED
  challengeId: 17,                                 // REQUIRED
  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",  // REQUIRED
  runTime: "01:45:23",                             // REQUIRED
  description: "Amazing speedrun with new techniques!",     // OPTIONAL
  runnerUrl: "https://twitch.tv/progamer123"        // OPTIONAL
};

submitRun(submissionData)
  .then(result => {
    console.log('Submission successful:', result);
  })
  .catch(error => {
    console.error('Submission failed:', error);
  });