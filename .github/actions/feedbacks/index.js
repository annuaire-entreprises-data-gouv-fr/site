const core = require('@actions/core');
const fetch = require('node-fetch');

function generateAsciiGraph(data) {
  // Create a frequency map to count occurrences of each value
  const frequencyMap = data.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
  for (let i = 1; i <= 10; i++) {
    if (!frequencyMap[i]) {
      frequencyMap[i] = 0;
    }
  }

  const counts = Object.values(frequencyMap);
  const rowCount = Math.max(...counts) + 2;

  let graph = '';

  graph += '┌';

  for (let i = 0; i < 10; i++) {
    graph += '───';
  }
  graph += `┐ ${rowCount}\n`;

  for (let row = 0; row < rowCount - 1; row++) {
    graph += '│';
    for (let i = 1; i <= 10; i++) {
      if (frequencyMap[i] >= rowCount - row - 1) {
        graph += ' ⎕ ';
      } else {
        graph += '   ';
      }
    }
    graph += '│\n';
  }
  graph += '└';

  for (let i = 0; i < 10; i++) {
    graph += '───';
  }
  graph += '┘ 0\n';

  graph += '  ' + Object.keys(frequencyMap).join('  ');

  return graph;
}

async function fetchFeedbacks() {
  const response = await fetch(process.env.GRIST_TABLE, {
    headers: {
      Authorization: `Bearer ${process.env.GRIST_API_KEY}`,
    },
  });
  if (!response.ok) {
    console.error('This is very disapointing');
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data.records.map((r) => r.fields);
}

function getYesterday() {
  const yesterday = new Date();
  yesterday.setDate(new Date().getDate() - 1);

  return `${yesterday.getFullYear()}-${String(
    yesterday.getMonth() + 1
  ).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
}

function generateReport(data) {
  const yesterday = getYesterday();

  const moods = [];
  const feedbacks = [];

  data.forEach((record) => {
    if (record.date !== yesterday) {
      return;
    }

    const mood = parseInt(record.mood, 10);

    if (mood === -1 || isNaN(mood)) {
      return;
    }

    let userType = record.visitorType;
    if (userType === 'Non renseigné') {
      userType = 'Autre';
    }
    if (userType.startsWith('Agent') || userType.startsWith('Super-agent')) {
      userType = 'Agent public';
    }
    const { text, email } = record;

    moods.push(mood);

    if (text) {
      feedbacks.push({ text, mood, email });
    }
  });

  console.log(moods, feedbacks);
  const report = `
# Daily feedbacks report

Feedbacks count : ${moods.length} 

Distribution :
${generateAsciiGraph(moods)}

Commentaires :
${feedbacks
  .map(
    (f) =>
      `┌──┐\n│${String(f.mood).padStart(2, ' ')}│ @ : ${f.email}\n└──┘\n “${
        f.text
      }”`
  )
  .join('\n\n')}
  `;

  console.log(report);
}

async function run() {
  try {
    const data = await fetchFeedbacks();
    generateReport(data);
    core.setOutput('data', data);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
