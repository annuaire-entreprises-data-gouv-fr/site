import fetch from "node-fetch";

function generateAsciiGraph(data) {
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

  let graph = "";

  graph += "┌";

  for (let i = 0; i < 10; i++) {
    graph += "───";
  }
  graph += `┐ ${rowCount}\n`;

  for (let row = 0; row < rowCount - 1; row++) {
    graph += "│";
    for (let i = 1; i <= 10; i++) {
      if (frequencyMap[i] >= rowCount - row - 1) {
        graph += " ⎕ ";
      } else {
        graph += "   ";
      }
    }
    graph += "│\n";
  }
  graph += "└";

  for (let i = 0; i < 10; i++) {
    graph += "───";
  }
  graph += "┘ 0\n";

  graph += "  " + Object.keys(frequencyMap).join("  ");

  return graph;
}

async function fetchFeedbacks() {
  const response = await fetch(process.env.GRIST_TABLE, {
    headers: {
      Authorization: `Bearer ${process.env.GRIST_API_KEY}`,
    },
  });
  if (!response.ok) {
    console.error("This is very disapointing");
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
  ).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function collectFeedbackData(data) {
  const yesterday = getYesterday();

  const moods = [];
  const feedbacks = [];
  let total = 0;

  for (const record of data) {
    if (record.date !== yesterday) {
      continue;
    }

    const mood = Number.parseInt(record.mood, 10);

    if (mood === -1 || Number.isNaN(mood)) {
      continue;
    }

    let userType = record.visitorType;
    if (userType === "Non renseigné") {
      userType = "Autre";
    }
    if (userType.startsWith("Agent") || userType.startsWith("Super-agent")) {
      userType = "Agent public";
    }
    const { text, email } = record;

    moods.push(mood);
    total += mood;

    if (text) {
      feedbacks.push({ text, mood, email, userType });
    }
  }

  const avg = (total / moods.length).toFixed(2);

  return { yesterday, moods, feedbacks, avg };
}

function generatePlainTextReport({ yesterday, moods, feedbacks, avg }) {
  const rows = feedbacks
    .map(
      (f) =>
        `${String(f.mood).padStart(2, " ")} | "${f.text.replaceAll("\n", "").replaceAll("\r", "")}" | ${f.userType} | ${f.email}`
    )
    .join("\n");

  return `Feedbacks reçus le ${yesterday}

Hier, nous avons reçu ${moods.length} feedbacks. La note moyenne est de ${avg}.

Distribution

${generateAsciiGraph(moods)}

Commentaires

Note | Commentaire | Type | Email
${rows}`;
}

function generateHtmlReport({ yesterday, moods, feedbacks, avg }) {
  const feedbackRows = feedbacks
    .map((f) => {
      const cleanText = escapeHtml(
        f.text.replaceAll("\n", "").replaceAll("\r", "")
      );
      return `<tr><td>${f.mood}</td><td>${cleanText}</td><td>${escapeHtml(f.userType)}</td><td>${escapeHtml(f.email)}</td></tr>`;
    })
    .join("");

  return `<h1>Feedbacks reçus le ${escapeHtml(yesterday)}</h1>
<p>Hier, nous avons reçu <b>${moods.length}</b> feedbacks. La note moyenne est de <b>${escapeHtml(avg)}</b>.</p>
<h2>Distribution</h2>
<pre><code>${escapeHtml(generateAsciiGraph(moods))}</code></pre>
<h2>Commentaires</h2>
<table><thead><tr><th>Note</th><th>Commentaire</th><th>Type</th><th>Email</th></tr></thead><tbody>${feedbackRows}</tbody></table>`;
}

async function run() {
  const data = await fetchFeedbacks();
  const feedbackData = collectFeedbackData(data);
  const body = generatePlainTextReport(feedbackData);
  const formattedBody = generateHtmlReport(feedbackData);

  const post = await fetch(process.env.TCHAP_FEEDBACKS_URL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TCHAP_TOKEN}`,
    },
    method: "post",
    body: JSON.stringify({
      format: "org.matrix.custom.html",
      msgtype: "m.notice",
      body,
      formatted_body: formattedBody,
    }),
  });
  if (!post.ok) {
    console.error(post.error);
    throw new Error(`HTTP error! status: ${post.status}`);
  }
}

run();
