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
    try {
      const response = await fetch("/api/article/summarize", {
        method: "POST",
        body: JSON.stringify({
          content: `${article?.abstract}/n${discussion}`,
        }),
      });

      if (response.ok) {
        const bulletPoints = await response.json();
        setBulletPoints(bulletPoints);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSummarizing(true);
    }
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
        <ul
          className="list-disc leading-loose overflow-scroll p-6"
          style={{ maxHeight: "calc(100vh - 230px)" }}
        >
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
