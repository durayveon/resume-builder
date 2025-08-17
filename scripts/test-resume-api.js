const fetch = require('node-fetch');

async function testResumeGeneration() {
  const response = await fetch('http://localhost:3000/api/ai/generate-resume', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jobDescription: 'Create a resume for a senior software engineer with 5 years of experience in React and Node.js',
      existingResume: {}
    }),
  });

  if (!response.ok) {
    console.error('Error:', response.status, response.statusText);
    const error = await response.text();
    console.error('Error details:', error);
    return;
  }

  const data = await response.json();
  console.log('Generated resume data:', JSON.stringify(data, null, 2));
}

testResumeGeneration().catch(console.error);
