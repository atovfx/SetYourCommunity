import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { analyticsAPI } from '../services/api';
import { TrendingUp, MessageSquare, DollarSign, Users } from 'lucide-react';

export default function Analytics() {
  const { accountId } = useParams<{ accountId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['analytics', accountId],
    queryFn: () => analyticsAPI.get(accountId!),
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  const analytics = data?.data?.analytics;
  const conversions = data?.data?.conversions || [];

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px' }}>
        Analytics & Conversions
      </h1>

      {/* Statistiques principales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
      }}>
        <div style={{
          padding: '24px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{
              padding: '12px',
              backgroundColor: '#eff6ff',
              borderRadius: '12px',
              marginRight: '15px',
            }}>
              <MessageSquare size={24} color="#1d4ed8" />
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '5px' }}>
                Conversations totales
              </p>
              <p style={{ fontSize: '28px', fontWeight: 'bold' }}>
                {analytics?.totalConversations || 0}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          padding: '24px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{
              padding: '12px',
              backgroundColor: '#fef3c7',
              borderRadius: '12px',
              marginRight: '15px',
            }}>
              <Users size={24} color="#f59e0b" />
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '5px' }}>
                Conversations actives
              </p>
              <p style={{ fontSize: '28px', fontWeight: 'bold' }}>
                {analytics?.activeConversations || 0}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          padding: '24px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{
              padding: '12px',
              backgroundColor: '#dcfce7',
              borderRadius: '12px',
              marginRight: '15px',
            }}>
              <TrendingUp size={24} color="#16a34a" />
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '5px' }}>
                Taux de conversion
              </p>
              <p style={{ fontSize: '28px', fontWeight: 'bold' }}>
                {analytics?.conversionRate || 0}%
              </p>
            </div>
          </div>
        </div>

        <div style={{
          padding: '24px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{
              padding: '12px',
              backgroundColor: '#fef3c7',
              borderRadius: '12px',
              marginRight: '15px',
            }}>
              <DollarSign size={24} color="#f59e0b" />
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '5px' }}>
                Revenue total
              </p>
              <p style={{ fontSize: '28px', fontWeight: 'bold' }}>
                ${analytics?.totalRevenue?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques des messages */}
      <div style={{
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        marginBottom: '30px',
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
          Messages échangés
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
              Total
            </p>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {analytics?.totalMessages || 0}
            </p>
          </div>
          {analytics?.messagesByType?.map((item: any) => (
            <div key={item.senderType}>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                {item.senderType === 'BOT' ? '🤖 Par le bot' : 
                 item.senderType === 'USER' ? '👤 Manuels' : 
                 '💬 Des clients'}
              </p>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {item._count}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Liste des conversions */}
      <div style={{
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
          Clients convertis
        </h2>

        {conversions.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>
            Aucune conversion pour le moment
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>
                    Client
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>
                    Plateforme
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>
                    Revenue
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>
                    Date
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {conversions.map((conv: any) => (
                  <tr key={conv.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px', fontSize: '14px' }}>
                      {conv.conversation.contactName || conv.conversation.contactId}
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>
                      {conv.conversation.platform}
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '600', color: '#16a34a' }}>
                      {conv.revenue ? `$${conv.revenue.toFixed(2)}` : '-'}
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>
                      {new Date(conv.conversionDate).toLocaleDateString('fr-FR')}
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>
                      {conv.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


