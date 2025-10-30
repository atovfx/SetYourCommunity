import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { conversationsAPI } from '../services/api';
import { Send, Hand, DollarSign } from 'lucide-react';

export default function Conversations() {
  const { accountId } = useParams<{ accountId: string }>();
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [revenue, setRevenue] = useState('');
  const [notes, setNotes] = useState('');

  const { data: conversationsData, isLoading } = useQuery({
    queryKey: ['conversations', accountId, statusFilter],
    queryFn: () => conversationsAPI.getByAccount(accountId!, statusFilter || undefined),
  });

  const { data: messagesData } = useQuery({
    queryKey: ['messages', selectedConversation],
    queryFn: () => conversationsAPI.getMessages(selectedConversation!),
    enabled: !!selectedConversation,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) =>
      conversationsAPI.sendManualReply(selectedConversation!, content),
    onSuccess: () => {
      setMessageText('');
      queryClient.invalidateQueries({ queryKey: ['messages', selectedConversation] });
    },
  });

  const takeoverMutation = useMutation({
    mutationFn: () => conversationsAPI.takeover(selectedConversation!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations', accountId] });
    },
  });

  const markConvertedMutation = useMutation({
    mutationFn: (data: { revenue?: number; notes?: string }) =>
      conversationsAPI.markAsConverted(selectedConversation!, data),
    onSuccess: () => {
      setShowConversionModal(false);
      setRevenue('');
      setNotes('');
      queryClient.invalidateQueries({ queryKey: ['conversations', accountId] });
    },
  });

  const conversations = conversationsData?.data?.conversations || [];
  const messages = messagesData?.data?.messages || [];
  const currentConversation = conversations.find((c: any) => c.id === selectedConversation);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMessageMutation.mutate(messageText);
    }
  };

  const handleMarkConverted = (e: React.FormEvent) => {
    e.preventDefault();
    markConvertedMutation.mutate({
      revenue: revenue ? parseFloat(revenue) : undefined,
      notes: notes || undefined,
    });
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
        Conversations
      </h1>

      <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 200px)' }}>
        {/* Liste des conversations */}
        <div style={{
          width: '350px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            >
              <option value="">Toutes les conversations</option>
              <option value="ACTIVE">Actives</option>
              <option value="MANUAL">Mode manuel</option>
              <option value="CONVERTED">Converties</option>
              <option value="CLOSED">Fermées</option>
            </select>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {conversations.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                Aucune conversation
              </div>
            ) : (
              conversations.map((conv: any) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  style={{
                    padding: '15px 20px',
                    borderBottom: '1px solid #e5e7eb',
                    cursor: 'pointer',
                    backgroundColor: selectedConversation === conv.id ? '#eff6ff' : 'transparent',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>
                      {conv.contactName || conv.contactId}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: conv.status === 'CONVERTED' ? '#dcfce7' : '#f3f4f6',
                      color: conv.status === 'CONVERTED' ? '#16a34a' : '#6b7280',
                    }}>
                      {conv.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                    {conv.messages[0]?.content?.substring(0, 50)}...
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Zone de messages */}
        <div style={{
          flex: 1,
          backgroundColor: '#fff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {!selectedConversation ? (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
            }}>
              Sélectionnez une conversation
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{
                padding: '20px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                    {currentConversation?.contactName || currentConversation?.contactId}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#6b7280' }}>
                    {currentConversation?.platform}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {currentConversation?.status !== 'MANUAL' && (
                    <button
                      onClick={() => takeoverMutation.mutate()}
                      disabled={takeoverMutation.isPending}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        backgroundColor: '#f59e0b',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        cursor: takeoverMutation.isPending ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <Hand size={16} />
                      Prendre le contrôle
                    </button>
                  )}
                  {currentConversation?.status !== 'CONVERTED' && (
                    <button
                      onClick={() => setShowConversionModal(true)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        backgroundColor: '#16a34a',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        cursor: 'pointer',
                      }}
                    >
                      <DollarSign size={16} />
                      Marquer converti
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div style={{
                flex: 1,
                padding: '20px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
              }}>
                {messages.map((msg: any) => (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: msg.senderType === 'CONTACT' ? 'flex-start' : 'flex-end',
                      maxWidth: '70%',
                    }}
                  >
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      backgroundColor: msg.senderType === 'CONTACT' ? '#f3f4f6' : '#1d4ed8',
                      color: msg.senderType === 'CONTACT' ? '#1f2937' : '#fff',
                    }}>
                      <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
                        {msg.content}
                      </p>
                    </div>
                    <p style={{
                      fontSize: '11px',
                      color: '#9ca3af',
                      marginTop: '5px',
                      textAlign: msg.senderType === 'CONTACT' ? 'left' : 'right',
                    }}>
                      {msg.senderType === 'BOT' ? '🤖 Bot' : msg.senderType === 'USER' ? '👤 Vous' : '💬 Client'}
                    </p>
                  </div>
                ))}
              </div>

              {/* Input */}
              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: '20px',
                  borderTop: '1px solid #e5e7eb',
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Écrivez votre message..."
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                />
                <button
                  type="submit"
                  disabled={!messageText.trim() || sendMessageMutation.isPending}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#1d4ed8',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: (!messageText.trim() || sendMessageMutation.isPending) ? 'not-allowed' : 'pointer',
                    opacity: (!messageText.trim() || sendMessageMutation.isPending) ? 0.5 : 1,
                  }}
                >
                  <Send size={20} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Modal de conversion */}
      {showConversionModal && (
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
            padding: '30px',
            width: '90%',
            maxWidth: '500px',
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
              Marquer comme converti
            </h2>
            <form onSubmit={handleMarkConverted}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                  Revenue (optionnel)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  placeholder="Ex: 997.00"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                  Notes (optionnel)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Informations supplémentaires..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowConversionModal(false)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#f3f4f6',
                    color: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={markConvertedMutation.isPending}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#16a34a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: markConvertedMutation.isPending ? 'not-allowed' : 'pointer',
                  }}
                >
                  Confirmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


