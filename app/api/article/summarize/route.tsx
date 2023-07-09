interface Request {
  json: () => Promise<{ content: string }>;
}

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

  const summary =
    "- Mutations in BRCA1 or BRCA2 genes increase the risk of breast and ovarian cancer - Treatment for these cancers involves PARP inhibitors - Inhibition of DNPH1 increases sensitivity of BRCA-deficient cells to PARP inhibitors - DNPH1 inhibition leads to replication fork collapse, DNA break formation, and apoptosis - Targeting DNPH1 may enhance the effectiveness of PARP inhibitor therapy for BRCA-deficient cancers - Cells eliminate epigenetically modified nucleotides through a two-step process involving DCTD and DNPH1 - Genomic hmdU predominantly arises through deamination of hmdCMP by DCTD - Cancers with high levels of hmdC and/or expression of CDA or DCTD may depend on DNPH1 for survival - Loss of ITPA also sensitizes cells to PARP inhibitors - Synthetic lethality following exposure to hmdU involves replication fork collapse, DSB formation, and apoptotic cell death - Loss of either PARP1 or the 53BP1-SHIELDIN pathway leads to cell death when exposed to hmdU - DNPH1 inhibition sensitizes BRCA-deficient cancer cells to PARP inhibitors and hmdU treatment - DNPH1 should be investigated as a potential druggable target";
  const bulletPoints = summary.split("- ").slice(1);
  return new Response(JSON.stringify(bulletPoints), { status: 200 });

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );

    if (response.ok) {
      const data = await response.json();
      const content = data.choices[0].message.content;
      const bulletPoints = content.split("- ").slice(1);
      return new Response(JSON.stringify(bulletPoints), { status: 200 });
    }
  } catch (error) {
    return new Response("Failed to summarize article", { status: 500 });
  }
};
