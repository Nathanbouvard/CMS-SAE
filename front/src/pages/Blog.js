import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
        try {
            // 1. Appel à l'API Symfony pour récupérer tous les articles
            const response = await fetch('/api/articles', {
                headers: {
                    'Accept': 'application/ld+json',
                    'Cache-Control': 'no-cache'
                }
            });
            
            const data = await response.json();
            
            let articles = [];
            if (data['hydra:member']) {
                articles = data['hydra:member'];
            } else if (data['member']) { 
                articles = data['member'];
            } else if (Array.isArray(data)) {
                articles = data;
            }

            setPosts(articles);
        } catch (error) {
            console.error("Erreur API:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchArticles();
  }, []);

  return (
    <div className="page-container">
      <h1>Derniers Articles</h1>
      {loading ? (
        <p>Chargement des articles...</p>
      ) : (
        <div className="blog-grid">
          {posts.length > 0 ? (
              posts.map((post, index) => {
                const articleId = post.id || (post['@id'] ? post['@id'].split('/').pop() : null);

                return (
                  <article key={post['@id'] || post.id || index} className="blog-card">
                    {articleId ? (
                        <Link to={`/blog/${articleId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <h3>{post.title || post.Title || 'Sans titre'}</h3>
                            <p>
                                {post.summary || post.Summary || post.content || post.Content || 'Pas de contenu.'}
                            </p>
                        </Link>
                    ) : (
                        <>
                            <h3>{post.title || post.Title || 'Sans titre'}</h3>
                            <p>
                                {post.summary || post.Summary || post.content || post.Content || 'Pas de contenu.'}
                            </p>
                        </>
                    )}
                  </article>
                );
              })
          ) : (
              <p>Aucun article trouvé.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Blog;
