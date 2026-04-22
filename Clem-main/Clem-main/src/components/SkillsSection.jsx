import {
    SiC,
    SiCss,
    SiReact,
    SiTypescript,
    SiHtml5,
    SiCplusplus,
    SiPython,
    SiNodedotjs,
    SiTailwindcss,
    SiUnrealengine,
    SiGnubash,
} from 'react-icons/si';
import { SKILLS } from '../data/portfolioData';
import SectionHeading from './SectionHeading';
import SkillBadge from './SkillBadge';

const ICON_MAP = {
    SiC,
    SiCss,
    SiReact,
    SiTypescript,
    SiHtml5,
    SiCplusplus,
    SiPython,
    SiNodedotjs,
    SiTailwindcss,
    SiUnrealengine,
    SiGnubash,
};

export default function SkillsSection() {
    return (
        <div className="space-y-6">
            <SectionHeading
                title="Skills"
                description="Competences principales en developpement avec les icones Simple Icons."
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
