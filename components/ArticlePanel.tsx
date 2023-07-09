import Article from "@/types/article";

type Props = {
  article: Article | undefined;
};

const ArticlePanel = ({ article }: Props) => {
  console.log(article)
  return (
    <>
      {article && (
        <div
          className="overflow-scroll p-6"
          style={{ maxHeight: "calc(100vh - 190px)" }}
        >
          {article.passages.map((passage) =>
            passage.infons.section_type === 'TITLE' ? (
                <h2 className="font-semibold text-xl">{passage.text}</h2>
            ) :
            passage.infons.type.includes("title") ? (
              <h3 className="font-semibold text-lg mt-4" key={passage.offset}>
                {passage.text}
              </h3>
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
