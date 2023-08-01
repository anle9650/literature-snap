import Article from '@/types/article';
import { useState } from 'react';

const useArticles = (initialArticles: Article[]) => {
  const [articles, setArticles] = useState(initialArticles);

  const toggleSavedStatus = (articleId: string) => {
    setArticles((prevArticles) => {
      return prevArticles.map((article) =>
        article.id === articleId ? { ...article, saved: !article.saved } : article
      );
    });
  };

  return { articles, setArticles, toggleSavedStatus };
};

export default useArticles;
