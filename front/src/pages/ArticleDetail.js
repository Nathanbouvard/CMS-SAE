import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/articles/${id}`, { headers: { 'Accept': 'application/ld+json' } });
        if (!res.ok) throw new Error('Article introuvable');
        
        const data = await res.json();

        // Avec les groupes de sérialisation, les blocs sont déjà inclus.
        // Il suffit de les trier par position.
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

    fetchArticle();
  }, [id]);

  const isImage = (filename) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename);

  if (loading) return <div className="page-container"><p>Chargement...</p></div>;
  if (!article) return <div className="page-container"><p>Article introuvable.</p><Link to="/blog">Retour</Link></div>;

  return (
    <div className="page-container article-detail">
      <Link to="/blog" className="back-link">← Retour</Link>
      <h1>{article.title}</h1>
      
      <div className="article-content">
        {article.summary && <p className="article-summary"><em>{article.summary}</em></p>}
        
        {article.blocks?.map((block, idx) => (
            <div key={block.id || idx} className={`block block-${block.type}`}>
                
                {block.type === 'text' && block.content && <div dangerouslySetInnerHTML={{ __html: block.content.replace(/\n/g, '<br />') }} />}
                {block.type === 'title' && block.content && <h2>{block.content}</h2>}

                {block.media && block.media.filename && (
                    <div className="block-media" style={{ marginTop: '15px', textAlign: 'center' }}>
                        {isImage(block.media.filename) ? (
                            <img 
                                src={`/uploads/media/${block.media.filename}`}
                                alt={block.media.altText || ''}
                                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
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
          <p>Publié le : {new Date(article.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      )}
    </div>
  );
}

export default ArticleDetail;