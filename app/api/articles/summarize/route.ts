export const POST = async (req: Request) => {
  const { content } = await req.json();

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CHAT_GPT_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Give me the main bullet points from the following passages:/n${content}`,
        },
      ],
      max_tokens: 1000,
    }),
  };

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );

    const data = await response.json();
    const content = data.choices[0].message.content;
    const bulletPoints = content.split("- ").slice(1);
    return new Response(JSON.stringify(bulletPoints), { status: 200 });
  } catch (error) {
    return new Response("Failed to summarize article", { status: 500 });
  }
};
