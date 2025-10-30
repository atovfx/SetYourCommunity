import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { botAPI } from '../services/api';
import { Upload, Plus, Trash2, Save } from 'lucide-react';

export default function BotConfiguration() {
  const { accountId } = useParams<{ accountId: string }>();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'config' | 'knowledge' | 'faq'>('config');

  // Config
  const [systemPrompt, setSystemPrompt] = useState('');
  const [responseStyle, setResponseStyle] = useState('');
  const [mimics, setMimics] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [temperature, setTemperature] = useState(0.7);
  const [autoReply, setAutoReply] = useState(true);

  // FAQ
  const [faqTitle, setFaqTitle] = useState('');
  const [faqContent, setFaqContent] = useState('');

  // Document upload
  const [file, setFile] = useState<File | null>(null);

  const { data: configData, isLoading } = useQuery({
    queryKey: ['botConfig', accountId],
    queryFn: () => botAPI.getConfig(accountId!),
    onSuccess: (data) => {
      const config = data.data.config;
      if (config) {
        setSystemPrompt(config.systemPrompt || '');
        setResponseStyle(config.responseStyle || '');
        setMimics(config.mimics || '');
        setModel(config.model || 'gpt-3.5-turbo');
        setTemperature(config.temperature || 0.7);
        setAutoReply(config.autoReply !== undefined ? config.autoReply : true);
      }
    },
  });

  const { data: knowledgeData } = useQuery({
    queryKey: ['knowledge', accountId],
    queryFn: () => botAPI.getKnowledgeBase(accountId!),
  });

  const updateConfigMutation = useMutation({
    mutationFn: (data: any) => botAPI.updateConfig(accountId!, data),
    onSuccess: () => {
      alert('Configuration mise à jour avec succès !');
      queryClient.invalidateQueries({ queryKey: ['botConfig', accountId] });
    },
  });

  const addFaqMutation = useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      botAPI.addKnowledge(accountId!, { ...data, type: 'FAQ' }),
    onSuccess: () => {
      setFaqTitle('');
      setFaqContent('');
      queryClient.invalidateQueries({ queryKey: ['knowledge', accountId] });
    },
  });

  const uploadDocMutation = useMutation({
    mutationFn: (file: File) => botAPI.uploadDocument(accountId!, file),
    onSuccess: () => {
      setFile(null);
      queryClient.invalidateQueries({ queryKey: ['knowledge', accountId] });
    },
  });

  const deleteKnowledgeMutation = useMutation({
    mutationFn: (id: string) => botAPI.deleteKnowledge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge', accountId] });
    },
  });

  const handleSaveConfig = () => {
    updateConfigMutation.mutate({
      systemPrompt,
      responseStyle,
      mimics,
      model,
      temperature,
      autoReply,
    });
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    addFaqMutation.mutate({ title: faqTitle, content: faqContent });
  };

  const handleUploadDoc = () => {
    if (file) {
      uploadDocMutation.mutate(file);
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  const knowledge = knowledgeData?.data?.knowledgeBase || [];

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px' }}>
        Configuration du Bot
      </h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '2px solid #e5e7eb' }}>
        <button
          onClick={() => setActiveTab('config')}
          style={{
            padding: '12px 24px',
            border: 'none',
            backgroundColor: 'transparent',
            borderBottom: activeTab === 'config' ? '2px solid #1d4ed8' : 'none',
            color: activeTab === 'config' ? '#1d4ed8' : '#6b7280',
            fontWeight: activeTab === 'config' ? '600' : 'normal',
            cursor: 'pointer',
            marginBottom: '-2px',
          }}
        >
          Configuration générale
        </button>
        <button
          onClick={() => setActiveTab('knowledge')}
          style={{
            padding: '12px 24px',
            border: 'none',
            backgroundColor: 'transparent',
            borderBottom: activeTab === 'knowledge' ? '2px solid #1d4ed8' : 'none',
            color: activeTab === 'knowledge' ? '#1d4ed8' : '#6b7280',
            fontWeight: activeTab === 'knowledge' ? '600' : 'normal',
            cursor: 'pointer',
            marginBottom: '-2px',
          }}
        >
          Documents
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          style={{
            padding: '12px 24px',
            border: 'none',
            backgroundColor: 'transparent',
            borderBottom: activeTab === 'faq' ? '2px solid #1d4ed8' : 'none',
            color: activeTab === 'faq' ? '#1d4ed8' : '#6b7280',
            fontWeight: activeTab === 'faq' ? '600' : 'normal',
            cursor: 'pointer',
            marginBottom: '-2px',
          }}
        >
          FAQs
        </button>
      </div>

      {/* Config Tab */}
      {activeTab === 'config' && (
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
              Prompt système
            </label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Ex: Tu es un assistant commercial expert..."
              rows={4}
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

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
              Style de réponse
            </label>
            <textarea
              value={responseStyle}
              onChange={(e) => setResponseStyle(e.target.value)}
              placeholder="Ex: Ton amical et professionnel, réponses courtes et directes..."
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

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
              Expressions et mimics
            </label>
            <textarea
              value={mimics}
              onChange={(e) => setMimics(e.target.value)}
              placeholder="Ex: Utilise souvent 'Super !', 'Absolument', finir par des emojis..."
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                Modèle LLM
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              >
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                Température ({temperature})
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={autoReply}
                onChange={(e) => setAutoReply(e.target.checked)}
                style={{ marginRight: '10px', width: '18px', height: '18px' }}
              />
              <span style={{ fontSize: '14px', fontWeight: '600' }}>
                Réponses automatiques activées
              </span>
            </label>
          </div>

          <button
            onClick={handleSaveConfig}
            disabled={updateConfigMutation.isPending}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: '#1d4ed8',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: updateConfigMutation.isPending ? 'not-allowed' : 'pointer',
              opacity: updateConfigMutation.isPending ? 0.7 : 1,
            }}
          >
            <Save size={20} />
            {updateConfigMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      )}

      {/* Knowledge Tab */}
      {activeTab === 'knowledge' && (
        <div>
          <div style={{
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            marginBottom: '20px',
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
              Uploader un document
            </h3>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                  }}
                />
              </div>
              <button
                onClick={handleUploadDoc}
                disabled={!file || uploadDocMutation.isPending}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  backgroundColor: '#1d4ed8',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: (!file || uploadDocMutation.isPending) ? 'not-allowed' : 'pointer',
                  opacity: (!file || uploadDocMutation.isPending) ? 0.5 : 1,
                }}
              >
                <Upload size={20} />
                Uploader
              </button>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '15px',
          }}>
            {knowledge.filter((k: any) => k.type === 'DOCUMENT').map((doc: any) => (
              <div
                key={doc.id}
                style={{
                  padding: '20px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', flex: 1 }}>
                    {doc.title}
                  </h4>
                  <button
                    onClick={() => deleteKnowledgeMutation.mutate(doc.id)}
                    style={{
                      padding: '6px',
                      backgroundColor: '#fee2e2',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={16} color="#dc2626" />
                  </button>
                </div>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                  {doc.content.substring(0, 150)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div>
          <form
            onSubmit={handleAddFaq}
            style={{
              backgroundColor: '#fff',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              marginBottom: '20px',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
              Ajouter une FAQ
            </h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                Question
              </label>
              <input
                type="text"
                value={faqTitle}
                onChange={(e) => setFaqTitle(e.target.value)}
                required
                placeholder="Ex: Quel est le prix de la formation ?"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                Réponse
              </label>
              <textarea
                value={faqContent}
                onChange={(e) => setFaqContent(e.target.value)}
                required
                placeholder="La formation coûte..."
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
            <button
              type="submit"
              disabled={addFaqMutation.isPending}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                backgroundColor: '#1d4ed8',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: addFaqMutation.isPending ? 'not-allowed' : 'pointer',
                opacity: addFaqMutation.isPending ? 0.7 : 1,
              }}
            >
              <Plus size={20} />
              Ajouter la FAQ
            </button>
          </form>

          <div style={{ display: 'grid', gap: '15px' }}>
            {knowledge.filter((k: any) => k.type === 'FAQ').map((faq: any) => (
              <div
                key={faq.id}
                style={{
                  padding: '20px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                      {faq.title}
                    </h4>
                    <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                      {faq.content}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteKnowledgeMutation.mutate(faq.id)}
                    style={{
                      padding: '6px',
                      backgroundColor: '#fee2e2',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      marginLeft: '15px',
                    }}
                  >
                    <Trash2 size={16} color="#dc2626" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


