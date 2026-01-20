import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import VizBlock from '../components/VizBlock';

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
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ld+json',
          'Accept': 'application/ld+json'
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

  const getImageStyle = (size) => {
    let maxWidth = '60%'; // medium par défaut
    if (size === 'small') maxWidth = '30%';
    if (size === 'large') maxWidth = '100%';
    
    return { 
      maxWidth, 
      'block-size': 'auto', 
      borderRadius: '8px',
      margin: '0 auto', // Centrer l'image
      display: 'block'
    };
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
      <div style={{ display: 'flex', cursor: 'pointer' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            onClick={() => setNewReview({ ...newReview, rating: star })}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={star <= newReview.rating ? '#f39c12' : '#ccc'}
            width="24px"
            height="24px"
            style={{ marginRight: '5px' }}
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
                
                {block.type === 'text' && block.content && <div dangerouslySetInnerHTML={{ __html: block.content.replace(/\n/g, '<br />') }} />}
                {block.type === 'title' && block.content && <h2 style={titleStyle}>{block.content}</h2>}
                {block.type === 'chart' && <VizBlock block={block} theme={article.theme} />}

                {block.media && block.media.filename && block.type !== 'chart' && (
                    <div className="block-media" style={{ marginTop: '15px', textAlign: 'center' }}>
                        {isImage(block.media.filename) ? (
                            <img 
                                src={`/uploads/media/${block.media.filename}`}
                                alt={block.media.altText || ''}
                                style={getImageStyle(article.theme?.imageSize)}
                            />
                        ) : (
                            <a 
                                href={`/uploads/media/${block.media.filename}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ display: 'inline-block', padding: '10px 15px', backgroundColor: '#444', color: 'white', textDecoration: 'none', borderRadius: '4px' }}
                            >
                                📄 Voir le fichier : {block.media.filename}
                            </a>
                        )}
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

      <div className="article-reviews" style={{ marginTop: '40px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
        <h3>Avis ({article.ratings ? article.ratings.length : 0})</h3>

        {/* Formulaire d'ajout d'avis */}
        <div className="add-review-form" style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
          <h4>Laisser une note</h4>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleReviewSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Pseudo :</label>
              <input
                type="text"
                required
                value={newReview.pseudo}
                onChange={(e) => setNewReview({ ...newReview, pseudo: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Note :</label>
              {renderInteractiveStars()}
            </div>
            <button 
              type="submit" 
              disabled={submitting}
              style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}
            >
              {submitting ? 'Envoi...' : 'Envoyer'}
            </button>
          </form>
        </div>

        {article.ratings && article.ratings.length > 0 ? (
          <div className="reviews-list">
            {article.ratings.map((rating, idx) => (
              <div key={rating.id || idx} className="review-item" style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <strong>{rating.pseudo || 'Anonyme'}</strong>
                  <span style={{ color: '#f39c12' }}>{'★'.repeat(rating.rating || 0)}{'☆'.repeat(5 - (rating.rating || 0))}</span>
                </div>
                {rating.createdAt && <small style={{ color: '#888' }}>Le {new Date(rating.createdAt).toLocaleDateString('fr-FR')}</small>}
              </div>
            ))}
          </div>
        ) : (
          <p>Aucun avis pour cet article.</p>
        )}
      </div>
    </div>
  );
}

export default ArticleDetail;