import React from 'react';
import { Typewriter } from '../components/Typewriter';

interface SecretViewProps {
    route: string;
}

export const SecretView: React.FC<SecretViewProps> = ({ route }) => {
    const isGenocide = route === 'GENOCIDE';

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Title */}
            <div className="text-center mb-8">
                <h2 className="font-8bit text-2xl md:text-3xl text-ut-yellow mb-2 animate-pulse">
                    ??? SECRET ROUTE UNLOCKED ???
                </h2>
                <p className="font-pixel text-gray-400 text-sm">
                    * You found the hidden path...
                </p>
            </div>

            {/* Developer Message */}
            <div className="bg-black border-2 border-ut-yellow p-6 rounded-lg space-y-4">
                <h3 className="font-8bit text-xl text-ut-yellow flex items-center gap-2">
                    <span className="text-2xl">💬</span> Developer's Message
                </h3>
                <div className="space-y-3 font-pixel text-white text-sm md:text-base">
                    <Typewriter
                        text="* Thanks for exploring every corner of my portfolio!"
                        speed={30}
                        className="block"
                        enableSound={false}
                    />
                    <Typewriter
                        text="* This Undertale-themed portfolio was built with love and determination."
                        speed={30}
                        className="block"
                        enableSound={false}
                    />
                    <Typewriter
                        text="* I hope you enjoyed the experience as much as I enjoyed building it."
                        speed={30}
                        className="block"
                        enableSound={false}
                    />
                    <Typewriter
                        text="* Feel free to reach out if you want to collaborate on something cool!"
                        speed={30}
                        className="block"
                        enableSound={false}
                    />
                </div>
            </div>

            {/* Hidden Stats */}
            <div className="bg-black border-2 border-white p-6 rounded-lg space-y-4">
                <h3 className="font-8bit text-xl text-white flex items-center gap-2">
                    <span className="text-2xl">📊</span> Hidden Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-pixel text-sm">
                    <StatItem label="Total Code Lines" value="~2,500+" />
                    <StatItem label="Development Time" value="40+ hours" />
                    <StatItem label="Coffee Consumed" value="∞ cups" />
                    <StatItem label="Bugs Fixed" value="Too many to count" />
                    <StatItem label="Easter Eggs" value="You found one!" />
                    <StatItem label="Determination" value="MAX" />
                </div>
            </div>

            {/* Tech Stack */}
            <div className="bg-black border-2 border-white p-6 rounded-lg space-y-4">
                <h3 className="font-8bit text-xl text-white flex items-center gap-2">
                    <span className="text-2xl">⚙️</span> Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                    <TechBadge name="React" />
                    <TechBadge name="TypeScript" />
                    <TechBadge name="Tailwind CSS" />
                    <TechBadge name="Vite" />
                    <TechBadge name="Go" />
                    <TechBadge name="Notion API" />
                </div>
            </div>

            {/* Fun Facts */}
            <div className="bg-black border-2 border-ut-blue p-6 rounded-lg space-y-3">
                <h3 className="font-8bit text-xl text-ut-blue flex items-center gap-2">
                    <span className="text-2xl">✨</span> Fun Facts
                </h3>
                <ul className="space-y-2 font-pixel text-white text-sm">
                    <li>* The pixel art avatar was generated using ChatGPT</li>
                    <li>* Sound effects are triggered using the Web Audio API</li>
                    <li>* Your visit count is stored in localStorage</li>
                    <li>* The Genocide route changes the entire UI theme</li>
                    <li>* There are multiple hidden messages based on visit count</li>
                </ul>
            </div>

            {/* Achievement Unlocked */}
            <div className="text-center mt-8 p-4 bg-gradient-to-r from-ut-yellow/20 to-transparent border-l-4 border-ut-yellow">
                <p className="font-8bit text-ut-yellow text-lg">
                    🏆 Achievement Unlocked: "True Explorer"
                </p>
                <p className="font-pixel text-gray-400 text-sm mt-2">
                    You discovered the secret route!
                </p>
            </div>
        </div>
    );
};

// Helper Components
const StatItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-gray-900/50 border border-gray-700 p-3 rounded">
        <div className="text-gray-400 text-xs mb-1">{label}</div>
        <div className="text-white font-bold">{value}</div>
    </div>
);

const TechBadge: React.FC<{ name: string }> = ({ name }) => (
    <span className="bg-ut-blue/20 border border-ut-blue text-ut-blue px-3 py-1 rounded-full text-xs font-pixel">
        {name}
    </span>
);
