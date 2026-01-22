import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import VizBlock from '../components/VizBlock';
import './ArticleDetail.css';

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // State pour le formulaire d'avis
  const [newReview, setNewReview] = useState({ pseudo: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchArticle = async () => {
    try {
      const res = await fetch(`/api/articles/${id}`, { headers: { 'Accept': 'application/ld+json' } });
      if (!res.ok) throw new Error('Article introuvable');
      
      const data = await res.json();

      if (data.blocks && Array.isArray(data.blocks)) {
        data.blocks.sort((a, b) => a.position - b.position);
      }
      
      setArticle(data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ld+json',
          'Accept': 'application/ld+json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          pseudo: newReview.pseudo,
          rating: parseInt(newReview.rating),
          article: `/api/articles/${id}`
        })
      });

      if (!res.ok) {
        throw new Error('Erreur lors de l\'envoi de l\'avis');
      }

      // Réinitialiser le formulaire et recharger l'article
      setNewReview({ pseudo: '', rating: 5 });
      await fetchArticle();

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isImage = (filename) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename);

  const getImageClass = (size) => {
    switch(size) {
      case 'small': return 'article-image small';
      case 'large': return 'article-image large';
      default: return 'article-image medium';
    }
  };

  if (loading) return <div className="page-container"><p>Chargement...</p></div>;
  if (!article) return <div className="page-container"><p>Article introuvable.</p><Link to="/blog">Retour</Link></div>;

  const themeStyle = {
    color: article.theme?.textColor || 'inherit',
    fontFamily: article.theme?.fontFamily || 'inherit',
    fontSize: article.theme?.fontSize || 'inherit',
  };

  const titleStyle = {
    color: article.theme?.titleColor || 'inherit',
  };

  // Helper pour les étoiles interactives
  const renderInteractiveStars = () => {
    return (
      <div className="stars-selector">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            onClick={() => setNewReview({ ...newReview, rating: star })}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={star <= newReview.rating ? '#f39c12' : '#ccc'}
            width="24px"
            height="24px"
            className="star-icon"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="page-container article-detail" style={themeStyle}>
      <Link to="/blog" className="back-link">← Retour</Link>
      <h1 style={titleStyle}>{article.title}</h1>
      
      <div className="article-content">
        {article.summary && <p className="article-summary"><em>{article.summary}</em></p>}
        
        {article.blocks?.map((block, idx) => (
            <div key={block.id || idx} className={`block block-${block.type}`}>
                
                {block.type === 'text' && block.content &&
                 <div dangerouslySetInnerHTML={{ __html: block.content.replace(/\n/g, '<br />') }} />}
                {block.type === 'title' && block.content && <h2 style={titleStyle}>{block.content}</h2>}
                {block.type === 'chart' && <VizBlock block={block} theme={article.theme} />}

                {block.media && block.media.filename && block.type !== 'chart' && isImage(block.media.filename) && (
                    <div className="block-media">
                        <img 
                            src={`/uploads/media/${block.media.filename}`}
                            alt={block.media.altText || ''}
                            className={getImageClass(article.theme?.imageSize)}
                        />
                    </div>
                )}
            </div>
        ))}
        
        {!article.blocks?.length && !article.summary && <p>Pas de contenu.</p>}
      </div>

      {article.createdAt && (
        <div className="article-meta">
                    <p>Publié le : {new Date(article.createdAt).toLocaleDateString('fr-FR')}</p>
        </div>
      )}

      <div className="article-reviews">
        <h3>Note moyenne</h3>

        {/* Affichage de la moyenne */}
        {article.ratings && article.ratings.length > 0 ? (
          <div className="average-rating">
            <span className="rating-score">
              {(article.ratings.reduce((acc, r) => acc + (r.rating || 0), 0) / article.ratings.length).toFixed(1)}
            </span>
            <span className="rating-max"> / 5</span>
            <div className="rating-stars-static">
              {'★'.repeat(Math.round(article.ratings.reduce((acc, r) => acc + (r.rating || 0), 0) / article.ratings.length))}
              {'☆'.repeat(5 - Math.round(article.ratings.reduce((acc, r) => acc + (r.rating || 0), 0) / article.ratings.length))}
            </div>
            <p className="text-muted">Basé sur {article.ratings.length} avis</p>
          </div>
        ) : (
          <p>Aucun avis pour le moment.</p>
        )}

        {/* Formulaire d'ajout d'avis */}
        {localStorage.getItem('token') ? (
          <div className="add-review-form">
            <h4>Laisser une note</h4>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label className="form-label">Pseudo :</label>
                <input
                  type="text"
                  required
                  value={newReview.pseudo}
                  onChange={(e) => setNewReview({ ...newReview, pseudo: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Note :</label>
                {renderInteractiveStars()}
              </div>
              <button 
                type="submit" 
                disabled={submitting}
                className="submit-btn"
              >
                {submitting ? 'Envoi...' : 'Envoyer'}
              </button>
            </form>
          </div>
        ) : (
          <div className="login-prompt">
            <p>Vous devez être connecté pour laisser une note.</p>
            <Link to="/login" className="login-btn">
              Se connecter
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticleDetail;
