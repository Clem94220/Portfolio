import { FaDiscord, FaFileAlt, FaGithub, FaInstagram, FaLink, FaSpotify, FaSteam } from 'react-icons/fa';

const ICONS = {
    github: FaGithub,
    cv: FaFileAlt,
    project: FaLink,
    discord: FaDiscord,
    instagram: FaInstagram,
    steam: FaSteam,
    spotify: FaSpotify,
};

export default function LinkIcon({ name, className = 'text-sm' }) {
    const Icon = ICONS[name] || FaLink;
    return <Icon className={className} aria-hidden="true" />;
}
