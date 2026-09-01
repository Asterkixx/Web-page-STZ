import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const estiloBoton = {
    width: '70px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0)',
    color: '#ffffff',
    border: '0px solid rgba(255, 255, 255, 0.2)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '10px',
    fontWeight: 'bold',
    padding: '4px',
    boxSizing: 'border-box',
  };

  const estiloImagen = {
    width: '50px',
    height: '50px',
    objectFit: 'contain',
    marginBottom: '0px',
  };

  const activo = (ruta) => window.location.pathname === ruta ? 'rgba(249,190,12,0.25)' : 'rgba(255, 255, 255, 0)';

  return (
    <footer style={{ 
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      width: '100%',

      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(10px)',
      height: '80px',
      padding: '0.3rem 0.5rem', 
      zIndex: 999,
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      boxSizing: 'border-box'
    }}>
      <div className="footer-buttons" style={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        alignItems: 'center',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        {/* Botón 1: Álbumes → Álbum principal */}
        <button style={{ ...estiloBoton, backgroundColor: activo('/album') }} onClick={() => navigate('/album')}>
          <img 
            src="/icons/album.png" 
            alt="Álbumes" 
            style={estiloImagen} 
          />
          <span>Álbum</span>
        </button>

        {/* Botón 2: Spotify → Canciones desbloqueadas */}
        <button style={estiloBoton} onClick={() => navigate('/desbloqueadas')}>
          <img 
            src="/icons/spotify_logo.png" 
            alt="Spotify" 
            style={{
              ...estiloImagen,
              filter: 'saturate(0)', // Cambia el tono del color
            }} 
          />
          <span>Playlist</span>
        </button>

        {/* Botón 3: Contacto → Dedicatorias */}
        <button style={estiloBoton} onClick={() => navigate('/dedicatorias')}>
          <img 
            src="/icons/contacto.png" 
            alt="Contacto" 
            style={estiloImagen} 
          />
          <span>Dedicatorias</span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
