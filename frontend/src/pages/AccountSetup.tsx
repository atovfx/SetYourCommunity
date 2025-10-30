import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountsAPI } from '../services/api';
import { Instagram, MessageCircle, AlertCircle, CheckCircle } from 'lucide-react';

export default function AccountSetup() {
  const [platform, setPlatform] = useState<'instagram' | 'whatsapp' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [accountId, setAccountId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showInstagramModal, setShowInstagramModal] = useState(false);
  const navigate = useNavigate();

  const handleInstagramConnect = async () => {
    try {
      setLoading(true);
      const response = await accountsAPI.connectInstagram();
      window.location.href = response.data.authUrl;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la connexion');
      setLoading(false);
    }
  };

  const openInstagramPrerequisites = () => {
    setShowInstagramModal(true);
  };

  const confirmInstagramPrerequisites = () => {
    setShowInstagramModal(false);
    handleInstagramConnect();
  };

  const handleWhatsAppConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await accountsAPI.connectWhatsApp({ phoneNumber, accessToken, accountId });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  if (!platform) {
    return (
      <>
        <div>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
          Ajouter un compte
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '30px' }}>
          Choisissez la plateforme que vous souhaitez connecter
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          maxWidth: '800px',
        }}>
          <button
            onClick={openInstagramPrerequisites}
            style={{
              padding: '40px',
              backgroundColor: '#fff',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#E4405F';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Instagram size={48} color="#E4405F" style={{ margin: '0 auto 15px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
              Instagram Business
            </h3>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              Connectez votre compte Instagram Business pour gérer vos DMs
            </p>
          </button>

          <button
            onClick={() => setPlatform('whatsapp')}
            style={{
              padding: '40px',
              backgroundColor: '#fff',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#25D366';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <MessageCircle size={48} color="#25D366" style={{ margin: '0 auto 15px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
              WhatsApp Business
            </h3>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              Connectez votre compte WhatsApp Business pour gérer vos conversations
            </p>
          </button>
        </div>
      </div>

        {showInstagramModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}>
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '40px',
              width: '90%',
              maxWidth: '600px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <AlertCircle size={32} color="#f59e0b" style={{ marginRight: '15px' }} />
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                  Prérequis Instagram Business
                </h2>
              </div>

              <p style={{ color: '#6b7280', marginBottom: '30px', lineHeight: '1.6' }}>
                Avant de connecter votre compte Instagram, veuillez vérifier que vous remplissez 
                les conditions suivantes :
              </p>

              <div style={{ marginBottom: '30px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: '15px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  border: '1px solid #e5e7eb',
                }}>
                  <CheckCircle size={24} color="#1d4ed8" style={{ marginRight: '15px', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '5px' }}>
                      Compte Professionnel
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                      Votre compte Instagram doit être de type <strong>Business</strong> ou <strong>Creator</strong> 
                      (pas un compte personnel)
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: '15px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  border: '1px solid #e5e7eb',
                }}>
                  <CheckCircle size={24} color="#1d4ed8" style={{ marginRight: '15px', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '5px' }}>
                      Page Facebook Liée
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                      Votre compte Instagram doit être connecté à une Page Facebook
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: '15px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                }}>
                  <CheckCircle size={24} color="#1d4ed8" style={{ marginRight: '15px', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '5px' }}>
                      Administrateur de la Page
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                      Vous devez être <strong>administrateur</strong> de la Page Facebook liée
                    </p>
                  </div>
                </div>
              </div>

              <div style={{
                padding: '15px',
                backgroundColor: '#fef3c7',
                borderRadius: '8px',
                marginBottom: '30px',
                border: '1px solid #fbbf24',
              }}>
                <p style={{ fontSize: '14px', color: '#92400e', margin: 0, lineHeight: '1.5' }}>
                  <strong>💡 Besoin d'aide ?</strong><br />
                  Si votre compte n'est pas professionnel, allez dans les paramètres Instagram → 
                  "Compte" → "Passer à un compte professionnel"
                </p>
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    setShowInstagramModal(false);
                    setPlatform(null);
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#f3f4f6',
                    color: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Annuler
                </button>
                <button
                  onClick={confirmInstagramPrerequisites}
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#1d4ed8',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? 'Connexion...' : 'Je confirme, continuer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (platform === 'instagram') {
    return (
      <div style={{ maxWidth: '600px' }}>
        <button
          onClick={() => setPlatform(null)}
          style={{
            marginBottom: '20px',
            padding: '8px 16px',
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          ← Retour
        </button>

        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
          Connecter Instagram
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '30px' }}>
          Autorisez DM Manager à accéder à vos messages Instagram
        </p>

        {error && (
          <div style={{
            padding: '12px',
            marginBottom: '20px',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            borderRadius: '8px',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleInstagramConnect}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#E4405F',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Connexion...' : 'Connecter avec Instagram'}
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <button
        onClick={() => setPlatform(null)}
        style={{
          marginBottom: '20px',
          padding: '8px 16px',
          backgroundColor: '#f3f4f6',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        ← Retour
      </button>

      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
        Connecter WhatsApp
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '30px' }}>
        Configurez votre compte WhatsApp Business API
      </p>

      {error && (
        <div style={{
          padding: '12px',
          marginBottom: '20px',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          borderRadius: '8px',
          fontSize: '14px',
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleWhatsAppConnect}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            Numéro de téléphone
          </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            placeholder="+33612345678"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            Access Token
          </label>
          <input
            type="text"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            Account ID
          </label>
          <input
            type="text"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#25D366',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Connexion...' : 'Connecter WhatsApp'}
        </button>
      </form>
    </div>
  );
}

