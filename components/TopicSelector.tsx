import React from 'react';
import { Topic } from '../types';

interface TopicSelectorProps {
  onSelect: (topic: Topic) => void;
}

const TOPICS: Topic[] = [
  {
    id: 'resume-mistakes',
    title: '简历避雷指南',
    description: 'HR看到会摇头的简历致命错误，教你如何避免。',
    icon: '💣',
    promptContext: 'Common resume mistakes students make (typos, bad formatting, no metrics). How to fix them instantly.'
  },
  {
    id: 'interview-hacks',
    title: '面试通关秘籍',
    description: '自我介绍、STAR法则、反问环节，全流程话术。',
    icon: '🎤',
    promptContext: 'Interview hacks for fresh graduates. STAR method, how to answer "Tell me about yourself", confident body language.'
  },
  {
    id: 'no-experience',
    title: '零实习写简历',
    description: '大学浑浑噩噩没实习？教你挖掘校园经历亮点。',
    icon: '🌱',
    promptContext: 'How to write a killer resume with zero internship experience. Focusing on course projects, student union roles, and soft skills.'
  },
  {
    id: 'salary-negotiation',
    title: '谈薪不尴尬',
    description: '应届生如何优雅谈薪资？不卑不亢拿到从容Offer。',
    icon: '💰',
    promptContext: 'Salary negotiation tips for first jobs. How to research market rate, what to say, polite phrases.'
  },
  {
    id: 'career-planning',
    title: '职业规划迷茫',
    description: '不知道选什么行业？带你分析性格与赛道。',
    icon: '🧭',
    promptContext: 'Career planning for confused students. Choosing the right industry, analyzing strengths (MBTI), long-term growth.'
  },
  {
    id: 'portfolio-building',
    title: '作品集打造',
    description: '设计/运营/产品岗必看，如何让作品集脱颖而出。',
    icon: '🎨',
    promptContext: 'Building a portfolio for creative or product roles. What to include, layout tips, showing process not just results.'
  }
];

export const TopicSelector: React.FC<TopicSelectorProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {TOPICS.map((topic) => (
        <button
          key={topic.id}
          onClick={() => onSelect(topic)}
          className="flex flex-col items-start p-6 bg-white border border-slate-200 rounded-xl hover:border-rose-400 hover:shadow-lg hover:shadow-rose-100 transition-all duration-300 text-left group"
        >
          <div className="text-4xl mb-3 bg-rose-50 w-14 h-14 flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">
            {topic.icon}
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-rose-600 transition-colors">
            {topic.title}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            {topic.description}
          </p>
        </button>
      ))}
    </div>
  );
};