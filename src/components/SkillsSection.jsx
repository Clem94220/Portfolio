import {
    SiC,
    SiReact,
    SiCplusplus,
    SiJavascript,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa6';
import { SKILLS } from '../data/portfolioData';
import SectionHeading from './SectionHeading';
import SkillBadge from './SkillBadge';

const ICON_MAP = {
    SiC,
    SiCplusplus,
    SiReact,
    FaJava,
    SiJavascript,
};

export default function SkillsSection() {
    return (
        <div className="space-y-6">
            <SectionHeading
                title="Stack Technique"
                description="Technologies et langages clés maîtrisés."
            />

            <div className="flex flex-wrap gap-3">
                {SKILLS.map((skill) => {
                    const Icon = ICON_MAP[skill.icon];
                    if (!Icon) return null;
                    return (
                        <SkillBadge
                            key={skill.label}
                            icon={Icon}
                            label={skill.label}
                            color={skill.color}
                        />
                    );
                })}
            </div>
        </div>
    );
}
