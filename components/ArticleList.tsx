import Article from "@/types/article";

type Props = {
  articles: Article[];
};

const ArticleList = ({ articles }: Props) => {
  return (
    <>
      <dl className="max-w-xl text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700 mt-3">
        {articles.map((article) => (
          <div className="flex flex-col py-3">
            <dt className="text-lg mb-1">{article.title}</dt>
            <dd className="text-gray-500 md:text-lg dark:text-gray-400">
              {article.abstract}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
};

export default ArticleList;
