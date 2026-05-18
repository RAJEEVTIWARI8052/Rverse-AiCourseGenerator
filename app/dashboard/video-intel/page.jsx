"use client";

import React, { useState } from 'react';
import { IoVideocamOutline, IoDocumentTextOutline, IoListOutline } from 'react-icons/io5';

export default function VideoIntelligence() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    if (!videoUrl) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/course/video-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      setResult(data);
    } catch (err) {
      alert("Error generating Intel: " + err.message + "\n\nMake sure to run: npm install youtube-transcript");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto float-3d perspective-1000">
      <div className="glass p-10 rounded-3xl card-hover relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl -z-10"></div>
        
        <h1 className="text-4xl font-black gradient-text mb-4 flex items-center gap-3">
          <IoVideocamOutline /> Video Intelligence AI
        </h1>
        <p className="text-gray-400 mb-8">Enter a YouTube URL to automatically generate accurate transcription, comprehensive notes, and MCQs.</p>
        
        <div className="flex gap-4 mb-10">
          <input 
            type="text" 
            placeholder="Paste YouTube Video URL here..."
            className="flex-1 p-4 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all backdrop-blur-md"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all disabled:opacity-50"
          >
            {loading ? 'Generating 3D Magic...' : 'Generate Notes & MCQs'}
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-fade-in">
            <div className="glass p-6 rounded-2xl border-l-4 border-l-purple-500 hover:scale-[1.01] transition-transform">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-purple-400">
                <IoDocumentTextOutline /> Generated Notes & MCQs
              </h2>
              <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap">
                {result.studyMaterial}
              </div>
            </div>
            
            <div className="glass p-6 rounded-2xl border-l-4 border-l-pink-500 hover:scale-[1.01] transition-transform">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-pink-400">
                <IoListOutline /> Raw Transcription
              </h2>
              <div className="text-sm text-gray-500 h-48 overflow-y-auto pr-4 custom-scrollbar">
                {result.transcription}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
