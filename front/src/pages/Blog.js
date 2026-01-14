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
                    'Accept': 'application/ld+json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des articles');
            }
            
            const data = await response.json();
            let articles = data['hydra:member'] || [];

            // 2. Vérification de la connexion utilisateur
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Décryptage du token pour obtenir l'ID de l'utilisateur
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    
                    if (payload.id) {
                        const userIri = `/api/users/${payload.id}`;
                        
                        // 3. Filtrage côté client : On ne garde que MES articles
                        articles = articles.filter(post => {
                            // L'auteur peut être un objet ou une chaîne (IRI)
                            const authorRef = post.author && post.author['@id'] ? post.author['@id'] : post.author;
                            return authorRef === userIri;
                        });
                    }
                } catch (e) {
                    console.error("Erreur lecture token", e);
                }
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
      <h1>{localStorage.getItem('token') ? 'Mes Articles' : 'Tous les Articles'}</h1>
      {loading ? (
        <p>Chargement des articles...</p>
      ) : (
        <div className="blog-grid">
          {posts.length > 0 ? (
              posts.map(post => (
                <article key={post['@id'] || post.id} className="blog-card">
                  <h3>{post.title}</h3>
                  <p>{post.summary || 'Pas de résumé disponible.'}</p>
                </article>
              ))
          ) : (
              <p>Aucun article trouvé.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Blog;
