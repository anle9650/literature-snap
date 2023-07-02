import Article from "@/types/article";

type Props = {
  article: Article|undefined;
};

const ArticlePanel = ({ article }: Props) => {
  return (
    <>
      {article ? (
        <div>{article.abstract}</div>
      ) : (
        <div className="flex h-full justify-center items-center">No article selected</div>
      )}
    </>
  );
};

export default ArticlePanel;
