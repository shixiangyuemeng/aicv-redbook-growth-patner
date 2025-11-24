import React, { useRef, useEffect } from 'react';
import { ImageRatio, ImageStyle } from '../types';

interface ImageGeneratorProps {
  style: ImageStyle;
  ratio: ImageRatio;
  onStyleChange: (s: ImageStyle) => void;
  onRatioChange: (r: ImageRatio) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  imageData: string | null;
  postTitle: string;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  style,
  ratio,
  onStyleChange,
  onRatioChange,
  onGenerate,
  isGenerating,
  imageData,
  postTitle
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Function to draw image + text overlay
  useEffect(() => {
    if (imageData && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        // Set canvas size based on ratio
        // Base width 1080px
        const width = 1080;
        let height = 1080;
        if (ratio === ImageRatio.PORTRAIT) height = 1440; // 3:4
        if (ratio === ImageRatio.LANDSCAPE) height = 810; // 4:3
        
        canvas.width = width;
        canvas.height = height;

        // Draw Image
        ctx?.drawImage(img, 0, 0, width, height);

        // Simple Overlay Gradient for text readability
        if(ctx) {
            const gradient = ctx.createLinearGradient(0, height - 400, 0, height);
            gradient.addColorStop(0, "transparent");
            gradient.addColorStop(0.7, "rgba(0,0,0,0.6)");
            gradient.addColorStop(1, "rgba(0,0,0,0.8)");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, height / 2, width, height / 2);

            // Draw Title Text
            ctx.font = "bold 80px Inter, sans-serif";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            
            // Very simple text wrapping
            const words = postTitle.split(''); // Char by char for Chinese
            let line = '';
            const lineHeight = 100;
            let y = height - 150; 
            // Reverse loop to draw from bottom up? No, let's keep it simple.
            
            // Basic Wrap logic
            const maxWidth = width - 100;
            const lines = [];
            
            for(let n = 0; n < words.length; n++) {
              const testLine = line + words[n];
              const metrics = ctx.measureText(testLine);
              const testWidth = metrics.width;
              if (testWidth > maxWidth && n > 0) {
                lines.push(line);
                line = words[n];
              } else {
                line = testLine;
              }
            }
            lines.push(line);

            // Draw lines
            let startY = height - 80 - (lines.length * lineHeight);
            lines.forEach((l, i) => {
                ctx.fillText(l, width / 2, startY + (i * lineHeight));
            });
        }
      };
      img.src = imageData;
    }
  }, [imageData, ratio, postTitle]);


  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Controls */}
      <div className="flex-1 space-y-8 bg-white p-6 rounded-xl border border-slate-200">
        <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">1. 图片风格</h3>
            <div className="grid grid-cols-2 gap-3">
            {Object.entries(ImageStyle).map(([key, value]) => (
                <button
                key={key}
                onClick={() => onStyleChange(value)}
                className={`p-4 rounded-lg border text-left text-sm transition-all ${
                    style === value 
                    ? 'border-rose-500 bg-rose-50 ring-1 ring-rose-500' 
                    : 'border-slate-200 hover:border-rose-300'
                }`}
                >
                <div className="font-semibold mb-1 capitalize text-slate-800">
                    {key.replace('_', ' ').toLowerCase()}
                </div>
                <div className="text-xs text-slate-500 line-clamp-2">{value}</div>
                </button>
            ))}
            </div>
        </div>

        <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">2. 图片比例</h3>
            <div className="flex gap-4">
                {[
                    { val: ImageRatio.PORTRAIT, label: '竖版 (3:4)', icon: '📱' },
                    { val: ImageRatio.LANDSCAPE, label: '横版 (4:3)', icon: '💻' },
                    { val: ImageRatio.SQUARE, label: '方形 (1:1)', icon: '🔲' },
                ].map((opt) => (
                    <button
                        key={opt.val}
                        onClick={() => onRatioChange(opt.val)}
                        className={`flex-1 p-4 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all ${
                            ratio === opt.val
                             ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold'
                             : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <span className="text-2xl">{opt.icon}</span>
                        <span>{opt.label}</span>
                    </button>
                ))}
            </div>
        </div>

        <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full py-4 bg-rose-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
            {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AI 绘图中...
                </>
            ) : (
                '生成封面图片 ✨'
            )}
        </button>
      </div>

      {/* Preview */}
      <div className="flex-1 bg-slate-100 rounded-xl p-6 flex flex-col items-center justify-center min-h-[400px]">
        {imageData ? (
            <div className="flex flex-col items-center gap-4 w-full">
                <h3 className="text-sm font-semibold text-slate-500">预览 (包含标题叠加效果)</h3>
                <canvas 
                    ref={canvasRef} 
                    className="max-w-full h-auto rounded shadow-xl border border-white"
                    style={{ maxHeight: '500px' }}
                />
                <p className="text-xs text-slate-400">注意：最终导出时将包含图片与文案数据</p>
            </div>
        ) : (
            <div className="text-center text-slate-400">
                <div className="text-6xl mb-4">🎨</div>
                <p>配置参数并点击生成</p>
            </div>
        )}
      </div>
    </div>
  );
};