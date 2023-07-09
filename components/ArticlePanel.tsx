import Article from "@/types/article";

type Props = {
  article: Article | undefined;
};

const ArticlePanel = ({ article }: Props) => {
  return (
    <>
      {article && (
        <div
          className="overflow-scroll p-6"
          style={{ maxHeight: "calc(100vh - 190px)" }}
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
      )}
    </>
  );
};

export default ArticlePanel;
