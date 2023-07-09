import Article from "@/types/article";

type Props = {
  articles: Article[];
  selectArticle: (article: Article) => void;
};

const ArticleList = ({ articles, selectArticle }: Props) => {
  return (
    <>
      <dl
        className="max-w-xl text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700 overflow-scroll"
        style={{ maxHeight: "calc(100vh - 175px)" }}
      >
        {articles.map((article) => (
          <div
            key={article.id}
            className="flex flex-col py-3 cursor-pointer"
            onClick={() => selectArticle(article)}
          >
            <dt className="text-lg font-semibold mb-1">{article.title}</dt>
            <dd className="text-gray-500 md:text-lg dark:text-gray-400 truncate">
              {article.abstract}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
};

export default ArticleList;
