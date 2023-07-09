import Article from "@/types/article";
import Passage from "@/types/passage";

const ArticleSection = ({ passage }: { passage: Passage }) => {
  return passage.infons.section_type === "TITLE" ? (
    <h2 className="font-semibold text-xl">{passage.text}</h2>
  ) : passage.infons.type.includes("title") ? (
    <h3 className="font-semibold text-lg mt-4" key={passage.offset}>
      {passage.text}
    </h3>
  ) : (
    <p className="mt-3" key={passage.offset}>
      {passage.text}
    </p>
  );
};

const ArticlePanel = ({ article }: { article: Article }) => {
  return (
    <div
      className="overflow-scroll p-6"
      style={{ maxHeight: "calc(100vh - 190px)" }}
    >
      {article.passages.map((passage) => (
        <ArticleSection passage={passage} />
      ))}
    </div>
  );
};

export default ArticlePanel;
