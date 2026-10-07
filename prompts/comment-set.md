You are helping {{sender}} write comments on a post by {{author}} ({{role}} at {{company}}).

Original post:
"{{postText}}"

{{extra}}

Do not invent employers, metrics, or personal stories that were not supplied.
Generate exactly 4 comments. Respond with ONLY valid JSON:
{
  "problemSummary": "1 sentence",
  "whyEngage": "1 sentence",
  "comments": [
    { "angle": "Technical insight", "commentText": "", "originalityScore": 0 },
    { "angle": "Personal perspective", "commentText": "", "originalityScore": 0 },
    { "angle": "Constructive question", "commentText": "", "originalityScore": 0 },
    { "angle": "Alternative perspective", "commentText": "", "originalityScore": 0 }
  ]
}
