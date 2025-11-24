import React, { useState } from 'react';
import { GeneratedContent } from '../types';

interface TextEditorProps {
  content: GeneratedContent;
  onChange: (content: GeneratedContent) => void;
  onNext: () => void;
  onRegenerate: () => void;
  isGenerating: boolean;
}

export const TextEditor: React.FC<TextEditorProps> = ({ 
  content, 
  onChange, 
  onNext, 
  onRegenerate,
  isGenerating 
}) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...content, title: e.target.value });
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...content, body: e.target.value });
  };

  const handleHashtagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(' ').filter(t => t.startsWith('#'));
    // Simple parsing, better to just let them edit string and split later if needed
    // For now, let's just keep the display clean. 
    // Actually, showing raw string is easier for user.
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      {/* Editor Side */}
      <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">封面标题 (Hook)</label>
          <input
            type="text"
            value={content.title}
            onChange={handleTitleChange}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none font-bold text-lg"
            placeholder="吸引人的标题..."
          />
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">正文内容</label>
          <textarea
            value={content.body}
            onChange={handleBodyChange}
            className="w-full h-[300px] p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none resize-none"
            placeholder="正文内容..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Hashtags</label>
          <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 min-h-[46px]">
            {content.hashtags.map((tag, idx) => (
              <span key={idx} className="text-rose-600 bg-rose-50 px-2 py-1 rounded text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex gap-4 mt-2">
            <button
                onClick={onRegenerate}
                disabled={isGenerating}
                className="px-6 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium transition-colors disabled:opacity-50"
            >
                {isGenerating ? '重新生成中...' : '重新生成文案'}
            </button>
            <button
                onClick={onNext}
                className="flex-1 px-6 py-2 rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-700 transition-colors shadow-md shadow-rose-200"
            >
                确认并生成图片 &rarr;
            </button>
        </div>
      </div>

      {/* Preview Side (Phone Mockup) */}
      <div className="w-full lg:w-[320px] shrink-0 flex justify-center">
        <div className="w-[300px] bg-white rounded-[32px] border-[8px] border-slate-900 overflow-hidden shadow-2xl relative">
            <div className="bg-slate-100 h-6 w-full absolute top-0 z-10 flex justify-center items-center">
                <div className="w-16 h-4 bg-black rounded-b-xl"></div>
            </div>
            <div className="mt-8 px-4 pb-4 h-[600px] overflow-y-auto custom-scrollbar">
                 <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center text-xs font-bold text-rose-700">GP</div>
                    <span className="text-sm font-semibold text-slate-800">简历成长伙伴</span>
                 </div>
                 
                 {/* Fake Carousel Dot */}
                 <div className="w-full aspect-[3/4] bg-slate-200 rounded-lg mb-4 flex items-center justify-center text-slate-400">
                    <span className="text-xs">图片待生成</span>
                 </div>

                 <h2 className="font-bold text-slate-900 text-lg mb-2 leading-snug">{content.title}</h2>
                 <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{content.body}</p>
                 <div className="mt-4 text-rose-600 text-sm font-medium">
                    {content.hashtags.join(' ')}
                 </div>
                 <div className="h-20"></div> {/* Spacer */}
            </div>
            {/* Bottom Bar Mockup */}
            <div className="absolute bottom-0 w-full h-12 bg-white border-t border-slate-100 flex justify-around items-center px-4">
                <div className="w-24 h-8 bg-slate-100 rounded-full text-xs text-slate-400 flex items-center px-3">说点什么...</div>
                <div className="flex gap-3 text-slate-400 text-xl">
                    <span>❤️</span>
                    <span>⭐</span>
                    <span>💬</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};