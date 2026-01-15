import React from 'react';

const RightMenu = ({ currentColor, onColorChange, currentSize, onSizeChange, activeSticker, onStickerSelect, stickerSize, onStickerSizeChange }) => {
  // SVG Data URIs for stickers
  const stickerStar = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iZ29sZCI+PHBhdGggZD0iTTEyIDJsMy4wOSA2LjI2TDIyIDkuMjdsLTUgNC44NyAxLjE4IDYuODhMMTIgMTcuNzdsLTYuMTggMy4yNUw3IDE0LjE0IDIgOS4yN2w2LjkxLTEuMDFMMTIgMnoiLz48L3N2Zz4=";
  const stickerHeart = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0icmVkIj48cGF0aCBkPSJNMTIgMjEuMzVsLTEuNDUtMS4zMkM1LjQgMTUuMzYgMiAxMi4yOCAyIDguNSAyIDUuNDIgNC40MiAzIDcuNSAzYzEuNzQgMCAzLjQxLjgxIDQuNSAyLjA5QzEzLjA5IDMuODEgMTQuNzYgMyAxNi41IDMgMTkuNTggMyAyMiA1LjQyIDIyIDguNWMwIDMuNzgtMy40IDYuODYtOC41NSAxMS41NEwxMiAyMS4zNXoiLz48L3N2Zz4=";
  const stickerLogo = "/stickers/logo.svg";

  const menuStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    width: '250px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  const buttonStyle = (color) => ({
    padding: '10px 15px',
    backgroundColor: color,
    color: color === '#ffffff' ? '#333' : 'white',
    border: (currentColor === color && !activeSticker) ? '3px solid #333' : '1px solid #ccc',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.2s',
  });

  const stickerBtnStyle = (src) => ({
    width: '50px',
    height: '50px',
    padding: '5px',
    backgroundColor: 'white',
    border: activeSticker === src ? '3px solid #333' : '1px solid #ccc',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  });

  const sizeButtonStyle = (size) => ({
    padding: '10px 15px',
    backgroundColor: currentSize === size ? '#333' : '#eee',
    color: currentSize === size ? 'white' : '#333',
    border: '1px solid #ccc',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.2s',
  });

  const basicButtonStyle = {
    padding: '10px 15px',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  return (
    <div style={menuStyle}>
      <h2 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#333' }}>Personnalisation</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label style={{ fontSize: '0.9rem', color: '#666' }}>Outils (Couleur)</label>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          <button style={buttonStyle('#ff0000')} onClick={() => onColorChange('#ff0000')}>Rouge</button>
          <button style={buttonStyle('#0000ff')} onClick={() => onColorChange('#0000ff')}>Bleu</button>
          <button style={buttonStyle('#00ff00')} onClick={() => onColorChange('#00ff00')}>Vert</button>
          <button style={buttonStyle('#000000')} onClick={() =buttonStyle> onColorChange('#000000')}>Noir</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label style={{ fontSize: '0.9rem', color: '#666' }}>Stickers</label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={stickerBtnStyle(stickerStar)} onClick={() => onStickerSelect(stickerStar)}>
             <img src={stickerStar} alt="Star" style={{ width: '100%', height: '100%' }} />
          </div>
          <div style={stickerBtnStyle(stickerHeart)} onClick={() => onStickerSelect(stickerHeart)}>
             <img src={stickerHeart} alt="Heart" style={{ width: '100%', height: '100%' }} />
          </div>
          <div style={stickerBtnStyle(stickerLogo)} onClick={() => onStickerSelect(stickerLogo)}>
             <img src={stickerLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label style={{ fontSize: '0.9rem', color: '#666' }}>Taille du sticker ({stickerSize}px)</label>
        <input 
          type="range" 
          min="50" 
          max="400" 
          value={stickerSize} 
          onChange={(e) => onStickerSizeChange(parseInt(e.target.value))}
          style={{ cursor: 'pointer' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label style={{ fontSize: '0.9rem', color: '#666' }}>Taille T-shirt</label>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button style={sizeButtonStyle('S')} onClick={() => onSizeChange('S')}>S</button>
          <button style={sizeButtonStyle('M')} onClick={() => onSizeChange('M')}>M</button>
          <button style={sizeButtonStyle('L')} onClick={() => onSizeChange('L')}>L</button>
        </div>
      </div>
      
      <button 
        style={{ ...basicButtonStyle, backgroundColor: '#e74c3c', marginTop: '10px' }}
        onClick={() => window.location.reload()}
      >
        Réinitialiser
      </button>
    </div>
  );
};

export default RightMenu;