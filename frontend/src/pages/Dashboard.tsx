import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { accountsAPI } from '../services/api';
import { Instagram, MessageCircle, Settings, MessageSquare, BarChart3 } from 'lucide-react';

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountsAPI.getAll(),
  });

  const accounts = data?.data?.accounts || [];

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>Dashboard</h1>
        <p style={{ color: '#6b7280' }}>Gérez vos comptes Instagram et WhatsApp</p>
      </div>

      {accounts.length === 0 ? (
        <div style={{
          padding: '60px',
          textAlign: 'center',
          backgroundColor: '#fff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
            Aucun compte connecté
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>
            Connectez votre premier compte pour commencer
          </p>
          <Link
            to="/accounts/setup"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#1d4ed8',
              color: '#fff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            Ajouter un compte
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px',
        }}>
          {accounts.map((account: any) => (
            <div
              key={account.id}
              style={{
                padding: '24px',
                backgroundColor: '#fff',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                {account.platform === 'INSTAGRAM' ? (
                  <Instagram size={32} color="#E4405F" />
                ) : (
                  <MessageCircle size={32} color="#25D366" />
                )}
                <div style={{ marginLeft: '15px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    {account.accountName || account.phoneNumber}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    {account.platform === 'INSTAGRAM' ? 'Instagram' : 'WhatsApp'}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  fontSize: '14px',
                }}>
                  <span style={{ color: '#6b7280' }}>Conversations</span>
                  <span style={{ fontWeight: '600' }}>{account._count?.conversations || 0}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '14px',
                }}>
                  <span style={{ color: '#6b7280' }}>Documents</span>
                  <span style={{ fontWeight: '600' }}>{account._count?.knowledgeBase || 0}</span>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '10px',
              }}>
                <Link
                  to={`/accounts/${account.id}/config`}
                  style={{
                    padding: '10px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    color: '#1f2937',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <Settings size={20} />
                  <span style={{ fontSize: '12px' }}>Config</span>
                </Link>
                <Link
                  to={`/accounts/${account.id}/conversations`}
                  style={{
                    padding: '10px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    color: '#1f2937',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <MessageSquare size={20} />
                  <span style={{ fontSize: '12px' }}>Messages</span>
                </Link>
                <Link
                  to={`/accounts/${account.id}/analytics`}
                  style={{
                    padding: '10px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    color: '#1f2937',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <BarChart3 size={20} />
                  <span style={{ fontSize: '12px' }}>Analytics</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


