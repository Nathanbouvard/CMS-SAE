import React, { useEffect, useState } from 'react';

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
            
            if (!response.ok) {
                console.error("HTTP Error:", response.status, response.statusText);
                throw new Error('Erreur lors de la récupération des articles');
            }
            
            const data = await response.json();
            console.log("API Data received:", data); // <--- DEBUG LOG
            
            // Support both Hydra (JSON-LD) and standard JSON array
            let articles = [];
            if (data['hydra:member']) {
                articles = data['hydra:member'];
            } else if (data['member']) { 
                articles = data['member'];
            } else if (Array.isArray(data)) {
                articles = data;
            }
            
            console.log("Parsed articles:", articles); // <--- DEBUG LOG

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
                // Debugging individual post fields
                console.log(`Article ${index}:`, post);
                
                return (
                  <article key={post['@id'] || post.id || index} className="blog-card">
                    <h3>{post.title || post.Title || 'Sans titre'}</h3>
                    <p>
                        {post.summary || post.Summary || post.content || post.Content || 'Pas de contenu.'}
                    </p>
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
