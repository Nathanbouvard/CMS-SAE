import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isImage = (filename) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename);

  // Helper to render star ratings
  const renderStars = (rating) => {
    const rounded = Math.round(rating);
    return (
      <span style={{ color: '#f39c12' }}>
        {'★'.repeat(rounded)}{'☆'.repeat(5 - rounded)}
      </span>
    );
  };

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

            // L'API de liste ne renvoie pas forcément les blocks ni les ratings. On récupère les détails pour chaque article.
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
      <h1>Actualités de la marque</h1>
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

                // Calcul de la note moyenne
                const ratings = post.ratings || [];
                const avgRating = ratings.length > 0
                    ? ratings.reduce((acc, r) => acc + (r.rating || 0), 0) / ratings.length
                    : 0;

                const CardContent = () => (
                    <div className="blog-card-inner">
                        {coverImage && (
                            <div className="blog-card-image-wrapper">
                                <img 
                                    src={`/uploads/media/${coverImage}`} 
                                    alt={post.title || 'Article cover'}
                                    className="blog-card-image"
                                />
                            </div>
                        )}
                        <div className="blog-card-info">
                            <h3>{post.title || post.Title || 'Sans titre'}</h3>
                            
                            <p className="blog-card-summary">
                                {post.summary || post.Summary || post.content || post.Content || 'Pas de contenu.'}
                            </p>

                            {ratings.length > 0 && (
                                <div className="blog-card-rating">
                                    {renderStars(avgRating)} 
                                    <span style={{ fontWeight: 'bold', marginLeft: '5px', color: '#f39c12' }}>{avgRating.toFixed(1)}</span>
                                    <small style={{ color: '#666', marginLeft: '5px' }}>({ratings.length})</small>
                                </div>
                            )}
                        </div>
                    </div>
                );

                return (
                  <article key={post['@id'] || post.id || index} className="blog-card">
                    {articleId ? (
                        <Link to={`/blog/${articleId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <CardContent />
                        </Link>
                    ) : (
                        <CardContent />
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