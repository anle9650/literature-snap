"use client";

import Article from "@/types/article";
import { useEffect, useState } from "react";

type Props = {
  article: Article | undefined;
};

const ArticlePanel = ({ article }: Props) => {
  const [bulletPoints, setBulletPoints] = useState<string[]>([]);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);

  const discussion: string | undefined = article?.passages
    .filter((passage) => passage.infons.section_type === "DISCUSS")
    .map((passage) => passage.text)
    .join("/n");

  useEffect(() => {
    setIsSummarizing(false);
  }, [article]);

  const summarize = async () => {
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
            content: `Give me the main bullet points from the following passages:/n${article?.abstract}/n${discussion}`,
          },
        ],
        max_tokens: 1000,
      }),
    };

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );

    if (response.ok) {
      const data = await response.json();
      const content = data.choices[0].message.content;
      setBulletPoints(content.split("- ").slice(1));
    }

    // const content =
    //   "- Mutations in BRCA1 or BRCA2 genes increase the risk of breast and ovarian cancer - Treatment for these cancers involves PARP inhibitors - Inhibition of DNPH1 increases sensitivity of BRCA-deficient cells to PARP inhibitors - DNPH1 inhibition leads to replication fork collapse, DNA break formation, and apoptosis - Targeting DNPH1 may enhance the effectiveness of PARP inhibitor therapy for BRCA-deficient cancers - Cells eliminate epigenetically modified nucleotides through a two-step process involving DCTD and DNPH1 - Genomic hmdU predominantly arises through deamination of hmdCMP by DCTD - Cancers with high levels of hmdC and/or expression of CDA or DCTD may depend on DNPH1 for survival - Loss of ITPA also sensitizes cells to PARP inhibitors - Synthetic lethality following exposure to hmdU involves replication fork collapse, DSB formation, and apoptotic cell death - Loss of either PARP1 or the 53BP1-SHIELDIN pathway leads to cell death when exposed to hmdU - DNPH1 inhibition sensitizes BRCA-deficient cancer cells to PARP inhibitors and hmdU treatment - DNPH1 should be investigated as a potential druggable target";
    // setBulletPoints(content.split("- ").slice(1));

    setIsSummarizing(true);
  };

  return (
    <>
      <ul className="flex justify-end p-3">
        <li>
          <button
            className="inline-block border border-blue-500 rounded py-1 px-3 bg-blue-500 text-white"
            disabled={!article}
            onClick={summarize}
          >
            Summarize
          </button>
        </li>
      </ul>

      {isSummarizing ? (
        <ul className="list-disc leading-loose p-6">
          {bulletPoints.map((bulletPoint, index) => (
            <li key={`bulletPoint${index}`}>{bulletPoint}</li>
          ))}
        </ul>
      ) : article ? (
        <div
          className="overflow-scroll p-6"
          style={{ maxHeight: "calc(100vh - 230px)" }}
        >
          <h2 className="font-semibold text-lg">Abstract</h2>
          <p className="mt-3">{article.abstract}</p>
          {article.passages.map((passage) =>
            passage.infons.type.includes("title") ? (
              <h2 className="font-semibold text-lg mt-4" key={passage.offset}>
                {passage.text}
              </h2>
            ) : (
              <p className="mt-3" key={passage.offset}>
                {passage.text}
              </p>
            )
          )}
        </div>
      ) : (
        <div className="flex h-full justify-center items-center">
          No article selected
        </div>
      )}
    </>
  );
};

export default ArticlePanel;
