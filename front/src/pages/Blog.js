import React, { useEffect, useState } from 'react';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupération de données fictives
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=6')
      .then(response => response.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur API:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-container">
      <h1>Derniers Articles</h1>
      {loading ? (
        <p>Chargement des articles...</p>
      ) : (
        <div className="blog-grid">
          {posts.map(post => (
            <article key={post.id} className="blog-card">
              <h3>{post.title}</h3>
              <p>{post.body.substring(0, 100)}...</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Blog;
