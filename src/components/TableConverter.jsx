import React, { useState, useEffect } from 'react';
import { markdownToTextTable } from '../utils/tableConverter';

export default function TableConverter() {
    const [input, setInput] = useState('| Header 1 | Header 2 |\n|---|---|\n| Cell 1 | Cell 2 |');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);
    const [style, setStyle] = useState('grid'); // Default to grid as requested

    useEffect(() => {
        try {
            const result = markdownToTextTable(input, { style });
            setOutput(result);
        } catch (e) {
            setOutput('Error parsing table.');
        }
    }, [input, style]);

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 h-[calc(100vh-100px)]">
            {/* Input Section */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        Markdown Input
                    </label>
                    <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-500 uppercase font-semibold">Style</label>
                        <select
                            value={style}
                            onChange={(e) => setStyle(e.target.value)}
                            className="bg-gray-800 text-gray-200 text-sm rounded-lg border border-gray-700 px-3 py-1 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="grid">Grid (ASCII)</option>
                            <option value="unicode">Unicode (Smooth)</option>
                            <option value="simple">Simple</option>
                        </select>
                    </div>
                </div>
                <textarea
                    className="w-full flex-1 bg-gray-800 text-gray-100 p-4 rounded-xl border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono text-sm resize-none shadow-lg transition-all"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="| header | header |\n|---|---|\n| cell | cell |"
                />
            </div>

            {/* Output Section */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        Text Output
                    </label>
                    <button
                        onClick={handleCopy}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 
                ${copied
                                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500/30'
                            }`}
                    >
                        {copied ? 'Copied!' : 'Copy Result'}
                    </button>
                </div>

                <div className="relative flex-1 group">
                    <pre className="w-full h-full bg-[#1e1e1e] text-gray-100 p-4 rounded-xl border border-gray-700 overflow-auto font-mono text-sm leading-relaxed shadow-lg">
                        {output}
                    </pre>
                    {/* Glossy Overlay Effect */}
                    <div className="absolute inset-0 pointer-events-none rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
            </div>
        </div>
    );
}
