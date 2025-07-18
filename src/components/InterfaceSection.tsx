
import React, { useState, useEffect } from 'react';
import { ChevronDown, Lock, ArrowUp, Settings } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  isGenerating?: boolean;
  showDownloadButton?: boolean;
}

const InterfaceSection: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState('Text to Video');
  const [prompt, setPrompt] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [outputsPerPrompt, setOutputsPerPrompt] = useState(1);
  const [quality, setQuality] = useState('Fast (Veo 2)');
  
  const { ref, isIntersecting } = useIntersectionObserver();

  const modes = [
    { name: 'Text to Video', available: true },
    { name: 'Frames to Video', available: false },
    { name: 'Ingredients to Video', available: false },
  ];

  const samplePrompts = [
    "A serene mountain lake at sunset with reflections",
    "Bustling Tokyo street at night with neon lights",
    "Waves crashing against rocky cliffs in slow motion",
    "Time-lapse of flowers blooming in a garden",
  ];

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculateGenerationTime = (promptText: string) => {
    const baseTime = 10000; // 10 seconds
    const additionalTime = Math.min(promptText.length * 50, 7000); // up to 7 additional seconds
    return baseTime + additionalTime;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    const userMessage: ChatMessage = { id: Date.now(), text: prompt, isUser: true };
    setChatMessages(prev => [...prev, userMessage]);
    
    const currentPrompt = prompt;
    setPrompt('');
    setIsGenerating(true);

    // First message: "Message sent to model..."
    const sentMessage: ChatMessage = { 
      id: Date.now() + 1, 
      text: 'Message sent to model...', 
      isUser: false 
    };
    setChatMessages(prev => [...prev, sentMessage]);

    // After 2 seconds: "Generation started..."
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev.slice(0, -1),
        { 
          id: Date.now() + 2, 
          text: 'Generation started...', 
          isUser: false 
        }
      ]);

      // Show generating animation
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev.slice(0, -1),
          { 
            id: Date.now() + 3, 
            text: 'Generating video', 
            isUser: false, 
            isGenerating: true 
          }
        ]);

        // Complete generation after calculated time
        const generationTime = calculateGenerationTime(currentPrompt);
        setTimeout(() => {
          const duration = Math.floor(Math.random() * 10) + 10; // 10-19 seconds
          setChatMessages(prev => [
            ...prev.slice(0, -1),
            { 
              id: Date.now() + 4, 
              text: `Video generated successfully! Duration: ${duration}s\nTo see the result you need to download the app.`, 
              isUser: false,
              showDownloadButton: true
            }
          ]);
          setIsGenerating(false);
        }, generationTime - 2000);
      }, 500);
    }, 2000);
  };

  const handleDownloadClick = () => {
    const heroSection = document.querySelector('#hero');
    heroSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const GeneratingDots = () => (
    <div className="dots-animation">
      <span></span>
      <span></span>
      <span></span>
    </div>
  );

  return (
    <section id="interface" className="py-32 px-4 bg-gradient-to-b from-transparent to-black/20">
      <div className="max-w-6xl mx-auto">
        <div 
          ref={ref}
          className={`text-center mb-20 animate-in ${isIntersecting ? 'visible' : ''}`}
        >
          <h2 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-tighter">
            Veo 3 Interface
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Preview</span>
          </h2>
          <p className="text-xl text-white/70 font-light max-w-3xl mx-auto leading-relaxed">
            Experience the power of AI video generation
          </p>
        </div>

        <div className={`glass-card p-8 animate-in ${isIntersecting ? 'visible' : ''}`}>
          {/* Navigation Breadcrumb */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-white/50 font-light text-sm tracking-wide">
              Flow &gt; {getCurrentDate()} &gt; Scenebuilder
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="button-3d p-2"
            >
              <Settings size={20} strokeWidth={1} className="text-white" />
            </button>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="glass-card p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-white/70 text-sm font-light mb-2 block">Outputs per prompt</label>
                  <select 
                    value={outputsPerPrompt}
                    onChange={(e) => setOutputsPerPrompt(Number(e.target.value))}
                    className="w-full glass p-3 rounded-lg text-white bg-transparent border border-white/10"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/70 text-sm font-light mb-2 block">Quality</label>
                  <select 
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="w-full glass p-3 rounded-lg text-white bg-transparent border border-white/10"
                  >
                    <option value="Fast (Veo 2)">Fast (Veo 2)</option>
                    <option value="Quality (Veo 2)">Quality (Veo 2)</option>
                    <option value="Highest Quality (Experimental Audio, Veo 3)">Highest Quality (Experimental Audio, Veo 3) - Upgrade</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Separator line */}
          <div className="border-t border-white/10 mb-8"></div>

          {/* Main prompt text */}
          <div className="text-center mb-8">
            <p className="text-white/70 font-light text-lg">
              Type in the prompt box to start
            </p>
          </div>

          {/* Chat area */}
          <div className="min-h-[300px] mb-8 glass-card p-6 rounded-lg">
            {chatMessages.length === 0 ? (
              <div className="text-white/40 text-center py-16">
                Chat messages will appear here...
              </div>
            ) : (
              <div className="space-y-6 max-h-80 overflow-y-auto">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-xl ${
                      message.isUser 
                        ? 'glass bg-blue-500/20 text-white' 
                        : 'glass bg-gray-600/20 text-white/90'
                    }`}>
                      <p className="text-sm font-light whitespace-pre-line">
                        {message.text}
                        {message.isGenerating && <GeneratingDots />}
                      </p>
                      {message.showDownloadButton && (
                        <button
                          onClick={handleDownloadClick}
                          className="button-3d px-4 py-2 text-white font-light text-sm mt-3"
                        >
                          Download the app
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Mode Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full glass p-4 rounded-lg flex items-center justify-between text-left"
              >
                <span className="text-white font-light">{selectedMode}</span>
                <ChevronDown 
                  size={20} 
                  strokeWidth={1}
                  className={`text-white/70 transition-transform duration-200 ${
                    showDropdown ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {showDropdown && (
                <div className="absolute bottom-full left-0 right-0 mb-2 glass-card rounded-lg overflow-hidden z-10">
                  {modes.map((mode) => (
                    <button
                      key={mode.name}
                      onClick={() => {
                        if (mode.available) {
                          setSelectedMode(mode.name);
                          setShowDropdown(false);
                        }
                      }}
                      className={`w-full p-4 text-left flex items-center justify-between transition-colors duration-200 ${
                        mode.available 
                          ? 'hover:bg-white/10 text-white' 
                          : 'text-white/40 cursor-not-allowed'
                      }`}
                      disabled={!mode.available}
                    >
                      <span className="font-light">{mode.name}</span>
                      {!mode.available && (
                        <Lock size={16} strokeWidth={1} className="text-white/40" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Prompt Input */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the video you want to create..."
                  rows={3}
                  className="flex-1 glass p-4 rounded-lg text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <button
                  type="submit"
                  disabled={!prompt.trim() || isGenerating}
                  className="button-3d p-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowUp size={20} strokeWidth={1} className="text-white" />
                </button>
              </form>
            </div>
          </div>

          {/* Sample Prompts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {samplePrompts.map((samplePrompt, index) => (
              <button
                key={index}
                onClick={() => setPrompt(samplePrompt)}
                className="button-3d p-3 text-white/70 hover:text-white text-sm font-light text-left"
              >
                {samplePrompt}
              </button>
            ))}
          </div>

          {/* Generate button */}
          <div className="flex justify-start">
            <button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isGenerating}
              className="button-3d px-6 py-3 text-white font-light tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : 'Generate Video'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InterfaceSection;
