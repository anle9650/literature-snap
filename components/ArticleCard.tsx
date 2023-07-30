import { useSession } from "next-auth/react";
import Link from "next/link";

import Article from "@/types/article";

const ArticleCard = ({ article }: { article: Article }) => {
  const { data: session } = useSession();

  const saveArticle = async () => {
    try {
      const response = await fetch(`/api/users/${session?.user?.id}/articles`, {
        method: "POST",
        body: JSON.stringify({
          articleId: article.id,
        }),
      });

      if (response.ok) {
        console.log("Article saved!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 mt-3">
      <div className="flex">
        <button
          type="button"
          title="Save Article"
          className="p-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-3 ml-auto"
          onClick={saveArticle}
        >
          <svg
            className="w-5 h-5"
            fill="#FFFFFF"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 349.03 349.031"
            xmlSpace="preserve"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g>
                {" "}
                <path d="M349.03,141.226v66.579c0,5.012-4.061,9.079-9.079,9.079H216.884v123.067c0,5.019-4.067,9.079-9.079,9.079h-66.579 c-5.009,0-9.079-4.061-9.079-9.079V216.884H9.079c-5.016,0-9.079-4.067-9.079-9.079v-66.579c0-5.013,4.063-9.079,9.079-9.079 h123.068V9.079c0-5.018,4.069-9.079,9.079-9.079h66.579c5.012,0,9.079,4.061,9.079,9.079v123.068h123.067 C344.97,132.147,349.03,136.213,349.03,141.226z"></path>{" "}
              </g>{" "}
            </g>
          </svg>
          <span className="sr-only">Save Article</span>
        </button>
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
