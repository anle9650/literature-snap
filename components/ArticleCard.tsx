import { useSession } from "next-auth/react";
import Link from "next/link";
import Article from "@/types/article";

type Props = {
  article: Article;
  toggleSave: (articleId: string) => void;
};

const ArticleCard = ({ article, toggleSave }: Props) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const saveButtonClass = `border hover:bg-green-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:hover:text-white dark:focus:ring-green-800 dark:hover:bg-green-500 mb-3 ml-auto ${
    article.saved
      ? "bg-green-700 text-white dark:text-white dark:bg-green-500"
      : "text-green-700 border-green-700 dark:border-green-500 dark:text-green-500"
  }`;

  const handleSaveToggle = async () => {
    try {
      const response = await fetch(
        `/api/users/${userId}/articles?id=${article.id}`,
        {
          method: article.saved ? "DELETE" : "POST",
        }
      );

      if (response.ok) {
        toggleSave(article.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 mt-3">
      <div className="flex">
        {userId && (
          <button
            type="button"
            className={saveButtonClass}
            title={article.saved ? "Unsave Article" : "Save Article"}
            onClick={handleSaveToggle}
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 18"
            >
              <path d="M3 7H1a1 1 0 0 0-1 1v8a2 2 0 0 0 4 0V8a1 1 0 0 0-1-1Zm12.954 0H12l1.558-4.5a1.778 1.778 0 0 0-3.331-1.06A24.859 24.859 0 0 1 6 6.8v9.586h.114C8.223 16.969 11.015 18 13.6 18c1.4 0 1.592-.526 1.88-1.317l2.354-7A2 2 0 0 0 15.954 7Z" />
            </svg>
            <span className="sr-only">
              {article.saved ? "Unsave Article" : "Save Article"}
            </span>
          </button>
        )}
      </div>
      <Link key={article.id} href={`/articles/${article.id}`}>
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {article.title}
        </h5>
      </Link>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {article.abstract}
      </p>
    </div>
  );
};

export default ArticleCard;
