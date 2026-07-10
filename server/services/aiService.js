const Groq = require('groq-sdk');

const initAI = () => {
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_actual_groq_api_key_here') {
    throw new Error('Please replace the GROQ_API_KEY placeholder with your actual Groq API key in the server/.env file');
  }
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

exports.enhanceProjectDescription = async (title, category, skills, description) => {
  const groq = initAI();
  const prompt = `
You are an expert technical project manager and copywriter.
A client has provided a rough draft of a project description. 
Please rewrite it professionally, improve grammar, organize the requirements clearly, and keep the original meaning intact. 
Do not change the technical requirements or add features that weren't requested.
Return ONLY the plain text of the enhanced description. No markdown formatting, no conversational filler.

Title: ${title}
Category: ${category}
Skills: ${skills.join(', ')}
Original Description: ${description}
  `;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.1-8b-instant",
  });
  
  return completion.choices[0]?.message?.content || "";
};

exports.generateProposal = async (project, student) => {
  const groq = initAI();
  const prompt = `
You are an expert freelance software engineer writing a proposal for a project.
Write a professional proposal introducing the student, explaining why they are suitable, and mentioning their matching skills.
Keep the proposal under 300 words. Sound natural and confident but do not make up fake experiences or promise unrealistic timelines.
Return ONLY the plain text of the proposal. No markdown formatting, no conversational filler.

Project Title: ${project.title}
Project Description: ${project.description}
Project Required Skills: ${project.skillsRequired.join(', ')}

Student Name: ${student.name}
Student Bio: ${student.profile?.bio || 'A passionate and hardworking developer.'}
Student Skills: ${student.profile?.skills?.join(', ') || 'Various technical skills.'}
  `;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.1-8b-instant",
  });
  
  return completion.choices[0]?.message?.content || "";
};

exports.summarizeChat = async (messages) => {
  const groq = initAI();
  
  const formattedMessages = messages.map(m => `[${m.sender?.name || 'Unknown'}]: ${m.content}`).join('\n');
  
  const prompt = `
You are an AI assistant helping a team summarize a project chat log.
Please analyze the following conversation and generate a brief summary (max 250 words) with the following sections (use markdown headings):

## Conversation Summary
## Key Decisions
## Pending Tasks
## Deadlines
## Action Items

Conversation Log:
${formattedMessages}
  `;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.1-8b-instant",
  });
  
  return completion.choices[0]?.message?.content || "";
};
