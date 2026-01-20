import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isImage = (filename) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename);

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

            // L'API de liste ne renvoie pas forcément les blocks. On récupère les détails pour chaque article
            // afin d'avoir accès aux images contenues dans les blocks.
            const detailedArticles = await Promise.all(articles.map(async (article) => {
                try {
                    const articleId = article.id || (article['@id'] ? article['@id'].split('/').pop() : null);
                    if (!articleId) return article;
                    
                    const detailRes = await fetch(`/api/articles/${articleId}`, {
                         headers: { 'Accept': 'application/ld+json' }
                    });
                    
                    if (detailRes.ok) {
                        return await detailRes.json();
                    }
                    return article;
                } catch (err) {
                    console.warn("Impossible de récupérer les détails pour l'article", article, err);
                    return article;
                }
            }));

            setPosts(detailedArticles);
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
      <h1>Articles</h1>
      {loading ? (
        <p>Chargement des articles...</p>
      ) : (
        <div className="blog-grid">
          {posts.length > 0 ? (
              posts.map((post, index) => {
                const articleId = post.id || (post['@id'] ? post['@id'].split('/').pop() : null);

                // Extraction de l'image (comme dans ArticleDetail)
                let coverImage = null;
                if (post.blocks && Array.isArray(post.blocks)) {
                    const sortedBlocks = [...post.blocks].sort((a, b) => a.position - b.position);
                    const imageBlock = sortedBlocks.find(b => b.media && b.media.filename && isImage(b.media.filename));
                    if (imageBlock) {
                        coverImage = imageBlock.media.filename;
                    }
                }

                return (
                  <article key={post['@id'] || post.id || index} className="blog-card">
                    {articleId ? (
                        <Link to={`/blog/${articleId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {coverImage && (
                                <img 
                                    src={`/uploads/media/${coverImage}`} 
                                    alt={post.title || 'Article cover'}
                                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }}
                                />
                            )}
                            <h3>{post.title || post.Title || 'Sans titre'}</h3>
                            <p>
                                {post.summary || post.Summary || post.content || post.Content || 'Pas de contenu.'}
                            </p>
                        </Link>
                    ) : (
                        <>
                            {coverImage && (
                                <img 
                                    src={`/uploads/media/${coverImage}`} 
                                    alt={post.title || 'Article cover'}
                                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }}
                                />
                            )}
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
