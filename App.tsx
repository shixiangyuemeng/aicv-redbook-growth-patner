import React, { useState } from 'react';
import { Topic, AppState, ImageRatio, ImageStyle, GeneratedContent } from './types';
import { generateRedBookText, generateRedBookCover } from './services/geminiService';
import { TopicSelector } from './components/TopicSelector';
import { TextEditor } from './components/TextEditor';
import { ImageGenerator } from './components/ImageGenerator';

const INITIAL_CONTENT: GeneratedContent = {
  title: '',
  body: '',
  hashtags: []
};

export default function App() {
  const [state, setState] = useState<AppState>({
    step: 1,
    selectedTopic: null,
    generatedContent: INITIAL_CONTENT,
    isGeneratingText: false,
    imageRatio: ImageRatio.PORTRAIT,
    imageStyle: ImageStyle.MINIMALIST,
    generatedImageBase64: null,
    isGeneratingImage: false
  });

  // STEP 1: Select Topic
  const handleTopicSelect = async (topic: Topic) => {
    setState(prev => ({ ...prev, selectedTopic: topic, isGeneratingText: true }));
    
    try {
      // Trigger AI generation
      const content = await generateRedBookText(topic.promptContext);
      setState(prev => ({ 
        ...prev, 
        selectedTopic: topic, 
        generatedContent: content, 
        step: 2, 
        isGeneratingText: false 
      }));
    } catch (error) {
      alert("Failed to generate text. Please check your API key.");
      setState(prev => ({ ...prev, isGeneratingText: false, selectedTopic: null }));
    }
  };

  // STEP 2: Edit Text
  const handleTextUpdate = (content: GeneratedContent) => {
    setState(prev => ({ ...prev, generatedContent: content }));
  };

  const handleRegenerateText = async () => {
    if (!state.selectedTopic) return;
    setState(prev => ({ ...prev, isGeneratingText: true }));
    try {
      const content = await generateRedBookText(state.selectedTopic.promptContext, "Regenerate with a slightly different angle.");
      setState(prev => ({ ...prev, generatedContent: content, isGeneratingText: false }));
    } catch (error) {
        setState(prev => ({ ...prev, isGeneratingText: false }));
    }
  };

  // STEP 3: Generate Image
  const handleImageGenerate = async () => {
    setState(prev => ({ ...prev, isGeneratingImage: true }));
    try {
      const base64 = await generateRedBookCover(
        state.generatedContent.title,
        state.imageStyle,
        state.imageRatio
      );
      setState(prev => ({ ...prev, generatedImageBase64: base64, isGeneratingImage: false }));
    } catch (error) {
      alert("Image generation failed.");
      setState(prev => ({ ...prev, isGeneratingImage: false }));
    }
  };

  // Export Logic
  const handleExportCSV = () => {
    // Basic CSV construction
    const headers = ["Title", "Content", "Hashtags", "ImageStyle", "Date"];
    const row = [
        `"${state.generatedContent.title.replace(/"/g, '""')}"`,
        `"${state.generatedContent.body.replace(/"/g, '""')}"`,
        `"${state.generatedContent.hashtags.join(' ')}"`,
        state.imageStyle,
        new Date().toLocaleDateString()
    ];
    
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), row.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "redbook_content.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadImage = () => {
    if (!state.generatedImageBase64) return;
    const link = document.createElement("a");
    link.href = state.generatedImageBase64;
    link.download = `cover_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleReset = () => {
      if(confirm('Start over? Current work will be lost.')) {
          setState({
            step: 1,
            selectedTopic: null,
            generatedContent: INITIAL_CONTENT,
            isGeneratingText: false,
            imageRatio: ImageRatio.PORTRAIT,
            imageStyle: ImageStyle.MINIMALIST,
            generatedImageBase64: null,
            isGeneratingImage: false
          });
      }
  }

  return (
    <div className="min-h-screen pb-12 bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-purple-600">
                    RedBook Growth Partner
                </h1>
            </div>
            {state.step > 1 && (
                 <button onClick={handleReset} className="text-sm text-slate-500 hover:text-rose-600">
                    Restart
                 </button>
            )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        
        {/* Progress Bar */}
        <div className="mb-8">
            <div className="flex justify-between mb-2">
                {['选择灵感', '编辑文案', '生成封面', '导出发布'].map((label, idx) => {
                    const stepNum = idx + 1;
                    const isActive = state.step >= stepNum;
                    return (
                        <div key={idx} className={`text-sm font-medium ${isActive ? 'text-rose-600' : 'text-slate-400'}`}>
                            {stepNum}. {label}
                        </div>
                    )
                })}
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-rose-500 transition-all duration-500 ease-out"
                    style={{ width: `${state.step * 25}%` }}
                ></div>
            </div>
        </div>

        {/* Loading Overlay for Step 1 */}
        {state.isGeneratingText && state.step === 1 && (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                <div className="text-4xl animate-bounce mb-4">🤔</div>
                <h2 className="text-xl font-bold text-slate-800">正在思考创意切入点...</h2>
                <p className="text-slate-500 mt-2">AI 正在撰写一篇爆款小红书文案</p>
            </div>
        )}

        {/* Step 1: Inspiration */}
        {state.step === 1 && (
            <div className="animate-fade-in-up">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">今天想分享什么干货？</h2>
                    <p className="text-slate-500">选择一个主题，AI 将为你自动生成适合大学生的营销软文。</p>
                </div>
                <TopicSelector onSelect={handleTopicSelect} />
            </div>
        )}

        {/* Step 2: Content Editor */}
        {state.step === 2 && (
             <div className="animate-fade-in">
                <TextEditor 
                    content={state.generatedContent}
                    onChange={handleTextUpdate}
                    onNext={() => setState(prev => ({ ...prev, step: 3 }))}
                    onRegenerate={handleRegenerateText}
                    isGenerating={state.isGeneratingText}
                />
             </div>
        )}

        {/* Step 3: Image & Finalize */}
        {state.step === 3 && (
            <div className="animate-fade-in">
                <ImageGenerator 
                    style={state.imageStyle}
                    ratio={state.imageRatio}
                    onStyleChange={(s) => setState(prev => ({ ...prev, imageStyle: s }))}
                    onRatioChange={(r) => setState(prev => ({ ...prev, imageRatio: r }))}
                    onGenerate={handleImageGenerate}
                    isGenerating={state.isGeneratingImage}
                    imageData={state.generatedImageBase64}
                    postTitle={state.generatedContent.title}
                />
                
                {state.generatedImageBase64 && (
                    <div className="mt-8 p-6 bg-rose-50 border border-rose-100 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-rose-800">🎉 内容准备就绪!</h3>
                            <p className="text-rose-600/80 text-sm">文案和图片已生成，请下载后前往小红书发布。</p>
                        </div>
                        <div className="flex gap-4">
                             <button 
                                onClick={handleDownloadImage}
                                className="px-6 py-2 bg-white text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50 font-medium"
                            >
                                下载无字配图
                            </button>
                            <button 
                                onClick={handleExportCSV}
                                className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-medium shadow-md shadow-rose-200"
                            >
                                导出 CSV 表格 (文案)
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )}
      </main>
    </div>
  );
}