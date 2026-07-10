import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../utils/api';

export default function Workspace() {
  const { id } = useParams();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [workspace, setWorkspace] = useState(null);
  const [messages, setMessages] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatFile, setChatFile] = useState(null);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [isConnected, setIsConnected] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const messagesEndRef = useRef(null);

  const [link, setLink] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    Promise.all([
      api.get(`/workspaces/${id}`),
      api.get(`/workspaces/${id}/messages`),
      api.get(`/workspaces/${id}/submissions`)
    ]).then(([workspaceRes, msgsRes, subsRes]) => {
      setWorkspace(workspaceRes.data.data);
      setMessages(msgsRes.data.data);
      setSubmissions(subsRes.data.data);
    }).catch(console.error);
  }, [id]);

  useEffect(() => {
    if (!socket || !workspace) return;

    setIsConnected(socket.connected);

    const joinRoom = () => {
      socket.emit('join_workspace', id);
      setIsConnected(true);
      // Re-fetch messages in case we missed any while offline
      api.get(`/workspaces/${id}/messages`).then(res => {
        setMessages(res.data.data);
      }).catch(console.error);
    };
    
    if (socket.connected) {
      joinRoom();
    }
    
    socket.on('connect', joinRoom);

    const handleNewMessage = (message) => setMessages(prev => [...prev, message]);
    const handleDisconnect = () => setIsConnected(false);
    
    socket.on('message:new', handleNewMessage);
    socket.on('disconnect', handleDisconnect);
    
    return () => {
      socket.off('connect', joinRoom);
      socket.off('message:new', handleNewMessage);
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket, workspace, id]);

  useEffect(() => {
    if (activeTab === 'chat') messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeTab]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !chatFile) || !socket) return;
    
    setSendingMsg(true);
    try {
      let attachmentUrl = null;
      if (chatFile) {
        const formData = new FormData();
        formData.append('file', chatFile);
        const uploadRes = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
        attachmentUrl = uploadRes.data.data.url;
      }
      
      socket.emit('message:send', { workspaceId: id, content: newMessage || (chatFile ? 'Sent an attachment' : ''), attachmentUrl });
      setNewMessage('');
      setChatFile(null);
    } catch (err) {
      alert('Error sending message or uploading file');
    } finally {
      setSendingMsg(false);
    }
  };

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData();
    formData.append('link', link);
    formData.append('notes', notes);
    if (file) formData.append('file', file);
    
    try {
      const res = await api.post(`/workspaces/${id}/submissions`, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
      setSubmissions([res.data.data, ...submissions]);
      setLink(''); setNotes(''); setFile(null);
      alert('Work submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting work');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAISummarize = async () => {
    setLoadingAI(true);
    try {
      const res = await api.post('/ai/summarize-chat', { workspaceId: id });
      setAiSummary(res.data.summary);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to summarize conversation.');
    } finally {
      setLoadingAI(false);
    }
  };

  const handleReviewSubmission = async (subId, status, feedback) => {
    try {
      const res = await api.patch(`/submissions/${subId}/review`, { status, feedback });
      setSubmissions(submissions.map(s => s._id === subId ? res.data.data : s));
      if (status === 'accepted') {
        alert('Work accepted! Please leave a review.');
        setWorkspace({ ...workspace, project: { ...workspace.project, status: 'completed' } });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating submission');
    }
  };

  const handleLeaveReview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', {
        projectId: workspace.project._id,
        toUserId: workspace.student._id,
        rating: reviewRating,
        comment: reviewComment
      });
      alert('Review submitted! Thank you.');
      setReviewComment('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error leaving review');
    }
  };

  if (!workspace) return <div className="text-center p-24 font-bold uppercase tracking-widest text-sm">INITIALIZING WORKSPACE...</div>;

  const partner = user.role === 'student' ? workspace.client : workspace.student;

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 h-[calc(100vh-100px)] flex flex-col font-sans">
      <div className="bg-background border-4 border-black flex flex-col z-10">
        <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-4 border-black swiss-dots bg-muted">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-[var(--color-swiss-red)] text-white font-bold px-3 py-1 text-sm tracking-widest">W/S</span>
              <h2 className="font-bold text-sm tracking-widest uppercase bg-white px-2">COLLABORATION ENVIRONMENT</h2>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase mb-2 leading-none">{workspace.project.title}</h1>
            <p className="text-sm font-bold uppercase tracking-widest opacity-60">ENGAGED WITH: <span className="font-black text-black">{partner.name}</span></p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <span className="border-4 border-black px-6 py-3 text-sm font-black uppercase tracking-widest bg-black text-white">
              {workspace.project.status.replace('_', ' ')}
            </span>
            <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-black ${isConnected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {isConnected ? 'LIVE SYNC: ONLINE' : 'LIVE SYNC: OFFLINE'}
            </span>
          </div>
        </div>
        
        <div className="flex bg-white">
          <button onClick={() => setActiveTab('chat')} className={`flex-1 py-6 text-sm font-black uppercase tracking-widest border-r-4 border-black transition-colors ${activeTab === 'chat' ? 'bg-[var(--color-swiss-red)] text-white' : 'hover:bg-muted text-black'}`}>COMMUNICATIONS</button>
          <button onClick={() => setActiveTab('submissions')} className={`flex-1 py-6 text-sm font-black uppercase tracking-widest transition-colors ${activeTab === 'submissions' ? 'bg-[var(--color-swiss-red)] text-white' : 'hover:bg-muted text-black'}`}>DELIVERABLES</button>
        </div>
      </div>
      
      {activeTab === 'chat' ? (
        <div className="flex-grow flex flex-col mt-6 border-4 border-black bg-white overflow-hidden relative">
          <div className="flex justify-between items-center border-b-4 border-black p-4 bg-muted swiss-noise relative z-20">
            <h3 className="font-bold text-sm tracking-widest uppercase">COMMUNICATION LOG</h3>
            <button 
              onClick={handleAISummarize} 
              disabled={loadingAI || messages.length === 0}
              className="bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-swiss-red)] transition-colors disabled:opacity-50"
            >
              {loadingAI ? 'SUMMARIZING...' : '✨ SUMMARIZE CONVERSATION'}
            </button>
          </div>
          <div className="absolute inset-0 swiss-grid-pattern opacity-20 pointer-events-none mt-14"></div>
          <div className="flex-grow overflow-y-auto p-10 flex flex-col gap-8 relative z-10 mt-14">
            {messages.map(msg => {
              const isMine = msg.sender._id === user._id || msg.sender === user._id;
              return (
                <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] md:max-w-[70%] p-6 border-4 border-black ${isMine ? 'bg-[var(--color-swiss-red)] text-white border-[var(--color-swiss-red)]' : 'bg-white text-black'}`}>
                      {!isMine && <span className="block text-[10px] font-black uppercase tracking-widest mb-3 opacity-60">{msg.sender.name}</span>}
                      {msg.attachmentUrl && (
                        <div className="mb-4">
                          {msg.attachmentUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                            <img src={msg.attachmentUrl} alt="attachment" className="w-full max-w-sm border-2 border-black" />
                          ) : (
                            <a href={msg.attachmentUrl} target="_blank" rel="noreferrer" className={`inline-block border-2 ${isMine ? 'border-white hover:bg-white hover:text-black' : 'border-black hover:bg-black hover:text-white'} px-4 py-2 font-black text-xs uppercase tracking-widest transition-colors`}>
                              VIEW ATTACHMENT
                            </a>
                          )}
                        </div>
                      )}
                      <p className="font-medium text-xl leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={sendMessage} className="border-t-4 border-black flex flex-wrap bg-white relative z-10">
            {chatFile && (
              <div className="w-full bg-muted border-b-4 border-black p-4 flex justify-between items-center text-sm font-bold uppercase tracking-widest swiss-noise">
                <span>ATTACHED: {chatFile.name}</span>
                <button type="button" onClick={() => setChatFile(null)} className="text-[var(--color-swiss-red)] hover:text-black">REMOVE</button>
              </div>
            )}
            <div className="flex-grow flex items-center border-r-4 border-black">
              <label className="cursor-pointer p-6 hover:bg-muted transition-colors border-r-4 border-black group">
                <input type="file" className="hidden" onChange={e => setChatFile(e.target.files[0])} />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:text-[var(--color-swiss-red)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
              </label>
              <input className="flex-grow p-6 font-medium text-xl outline-none focus:bg-muted transition-colors" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="ENTER TRANSMISSION..." disabled={sendingMsg} />
            </div>
            <button type="submit" disabled={sendingMsg} className="bg-black text-white font-black text-lg uppercase tracking-widest px-12 hover:bg-[var(--color-swiss-red)] transition-colors outline-none disabled:opacity-50">
              {sendingMsg ? 'UPLOADING...' : 'TRANSMIT'}
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-grow flex flex-col mt-6 overflow-y-auto">
          {user.role === 'student' && workspace.project.status === 'in_progress' && (
            <div className="bg-white p-10 md:p-14 border-4 border-black mb-10 relative">
              <h3 className="font-black text-4xl uppercase tracking-tighter mb-10">SUBMIT DELIVERABLE</h3>
              <form onSubmit={handleSubmitWork} className="space-y-8 relative z-10">
                <div><label className="block text-sm font-bold uppercase tracking-widest mb-3">REPOSITORY / ASSET URL</label><input value={link} onChange={e => setLink(e.target.value)} className="w-full border-b-4 border-black p-4 font-bold text-xl focus:border-[var(--color-swiss-red)] outline-none transition-colors bg-transparent" required /></div>
                <div><label className="block text-sm font-bold uppercase tracking-widest mb-3">TECHNICAL NOTES</label><textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full border-4 border-black p-6 font-medium text-lg focus:border-[var(--color-swiss-red)] outline-none transition-colors h-40 bg-transparent" /></div>
                <div><label className="block text-sm font-bold uppercase tracking-widest mb-3">FILE ATTACHMENT</label><input type="file" onChange={e => setFile(e.target.files[0])} className="w-full border-4 border-black p-4 bg-transparent cursor-pointer font-bold text-sm" /></div>
                <button disabled={submitting} type="submit" className="w-full bg-black text-white font-black text-xl uppercase tracking-widest py-8 border-4 border-black hover:bg-[var(--color-swiss-red)] hover:border-[var(--color-swiss-red)] transition-colors mt-8 disabled:opacity-50">SUBMIT PACKAGE</button>
              </form>
            </div>
          )}

          {user.role === 'client' && workspace.project.status === 'completed' && (
             <div className="bg-[var(--color-swiss-red)] text-white p-10 md:p-14 border-4 border-black mb-10">
               <h3 className="font-black text-4xl uppercase tracking-tighter mb-10">POST-PROJECT EVALUATION</h3>
               <form onSubmit={handleLeaveReview} className="space-y-8">
                 <div><label className="block text-sm font-bold uppercase tracking-widest mb-3">RATING (1-5)</label><input type="number" min="1" max="5" value={reviewRating} onChange={e => setReviewRating(e.target.value)} className="w-full border-b-4 border-white p-4 font-black text-3xl focus:border-black outline-none transition-colors bg-transparent text-white" required /></div>
                 <div><label className="block text-sm font-bold uppercase tracking-widest mb-3">EVALUATION REMARKS</label><textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} className="w-full border-4 border-white p-6 font-medium text-xl focus:border-black outline-none transition-colors h-40 bg-transparent text-white" required /></div>
                 <button type="submit" className="w-full bg-black text-white font-black text-xl uppercase tracking-widest py-8 border-4 border-black hover:bg-white hover:text-black transition-colors mt-8">SUBMIT EVALUATION</button>
               </form>
             </div>
          )}

          <div className="flex items-center gap-6 mb-8 mt-4">
             <h3 className="font-black text-3xl tracking-tighter uppercase">ARCHIVE</h3>
             <span className="flex-grow h-2 bg-black opacity-10"></span>
          </div>
          
          <div className="space-y-8">
            {submissions.map(sub => (
              <div key={sub._id} className="bg-white p-10 border-4 border-black">
                <div className="flex justify-between items-center border-b-4 border-black pb-6 mb-8">
                  <span className="font-bold text-sm uppercase tracking-widest">{new Date(sub.createdAt).toLocaleDateString()}</span>
                  <span className="bg-black text-white px-4 py-2 text-sm font-black uppercase tracking-widest">{sub.status}</span>
                </div>
                <div className="font-bold text-sm mb-8 flex flex-col gap-4">
                  <p className="flex justify-between border-b-2 border-black/10 pb-2"><span className="uppercase tracking-widest">RESOURCE LINK</span> <a href={sub.link} target="_blank" rel="noreferrer" className="text-[var(--color-swiss-red)] hover:bg-[var(--color-swiss-red)] hover:text-white px-2">ACCESS URL</a></p>
                  {sub.fileUrl && <p className="flex justify-between border-b-2 border-black/10 pb-2"><span className="uppercase tracking-widest">ATTACHED FILE</span> <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="text-[var(--color-swiss-red)] hover:bg-[var(--color-swiss-red)] hover:text-white px-2">DOWNLOAD</a></p>}
                </div>
                
                <h4 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-60">TECHNICAL NOTES</h4>
                <div className="font-medium text-xl leading-relaxed whitespace-pre-wrap border-l-4 border-[var(--color-swiss-red)] pl-6 mb-8">
                  {sub.notes}
                </div>
                
                {user.role === 'client' && sub.status === 'pending' && (
                  <div className="flex flex-col md:flex-row gap-6 pt-8 border-t-4 border-black">
                    <button onClick={() => handleReviewSubmission(sub._id, 'accepted', prompt('Add feedback for accepted work:'))} className="flex-1 bg-[var(--color-swiss-red)] text-white font-black text-lg uppercase tracking-widest py-6 border-4 border-[var(--color-swiss-red)] hover:bg-black hover:border-black transition-colors">APPROVE</button>
                    <button onClick={() => handleReviewSubmission(sub._id, 'rejected', prompt('Reason for rejection:'))} className="flex-1 bg-transparent text-black font-black text-lg uppercase tracking-widest py-6 border-4 border-black hover:bg-black hover:text-white transition-colors">REJECT</button>
                  </div>
                )}
              </div>
            ))}
            {submissions.length === 0 && (
              <div className="p-16 border-4 border-black text-center bg-muted swiss-noise">
                <p className="font-bold text-lg uppercase tracking-widest">NO DELIVERABLES ARCHIVED.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Summary Modal */}
      {aiSummary && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white border-8 border-black p-10 w-full max-w-3xl max-h-[85vh] overflow-y-auto relative shadow-[16px_16px_0px_0px_rgba(255,0,0,1)]">
            <button onClick={() => setAiSummary(null)} className="absolute top-6 right-6 text-2xl font-black hover:text-[var(--color-swiss-red)] transition-colors">X</button>
            <h2 className="font-black text-4xl uppercase tracking-tighter mb-8 border-b-8 border-[var(--color-swiss-red)] pb-4">AI SYNOPSIS.</h2>
            <div className="font-medium text-lg leading-relaxed whitespace-pre-wrap prose prose-h2:font-black prose-h2:text-xl prose-h2:uppercase prose-h2:tracking-widest prose-h2:mt-8 prose-h2:mb-4 prose-p:mb-4">
              {aiSummary}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
