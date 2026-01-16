import React from 'react';

const RightMenu1 = ({setColor, setSize}) => {
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
    };

    const btnStyle = (color) => ({
        padding: '10px 15px',
        backgroundColor: color,
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'all 0.2s',
    });


    return (
        <div style={menuStyle}>
            <h2 style={{margin: '0 0 5px 0', fontSize: '1.2rem', color: '#333'}}>Costomisation</h2>

            {/*Couleurs*/}
            <div>
                <p style={{color: 'black'}}>Couleur du t-shirt</p>
                <div style={{display: 'flex', gap: '5px', flexWrap: 'wrap'}}>
                    <button style={btnStyle('#ffffff')} onClick={() => setColor('#ffffff')}>Blanc</button>
                    <button style={btnStyle('#52b6ff')}  onClick={() => setColor('#52b6ff')}>Bleu</button>
                    <button style={btnStyle('#ff3b4d')}  onClick={() => setColor('#ff3b4d')}>Rouge</button>
                    <button style={btnStyle('#98ff72')}  onClick={() => setColor('#98ff72')}>Vert</button>
                    <button style={btnStyle('#ffad5a')}  onClick={() => setColor('#ffad5a')}>Orange</button>
                    <button style={btnStyle('#ff5fe5')}  onClick={() => setColor('#ff5fe5')}>Rose</button>
                </div>
            </div>

            {/*Size*/}
            <div>
                <p style={{color: 'black'}}>Taille</p>
                <div style={{display: 'flex', gap: '5px', flexWrap: 'wrap'}}>
                    <button style={btnStyle('#ffffff')} onClick={() => setSize(4.8)}>S</button>
                    <button style={btnStyle('#ffffff')}  onClick={() => setSize(5)}>M</button>
                    <button style={btnStyle('#ffffff')}  onClick={() => setSize(5.5)}>L</button>
                </div>
            </div>

        </div>
    );
};

export default RightMenu1;
