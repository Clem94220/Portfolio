// Données du site (liens, images, stack). Tous les textes affichés vivent dans translations.js.

/** @typedef {{ type: 'github'|'website'|'discord', url: string }} ProjectLink */

export const PROOF_LINKS = {
    github: 'https://github.com/Clem94220?tab=repositories',
    cv: '/assets/cv-clem.txt',
};

/** Ordre d'affichage des projets ; les textes sont dans translations.projects[id]. */
export const PROJECTS = [
    {
        id: 'portfolio',
        stack: ['React', 'Vite', 'Cloudflare Pages', 'Workers KV', 'WebSocket'],
        // Vérifie que ce dépôt est public avant de mettre en ligne.
        links: [{ type: 'github', url: 'https://github.com/Clem94220/Portfolio' }],
    },
    {
        id: 'crystal',
        stack: ['Communauté', 'Logiciels', 'Support'],
        mark: '/assets/logokronos.webp',
        links: [
            { type: 'website', url: 'https://crystal-solution.sellhub.cx/' },
            { type: 'discord', url: 'https://discord.gg/evhpge7UCE' },
        ],
    },
    {
        id: 'rd_windows',
        stack: ['C++', 'Python', 'Reverse Engineering'],
        links: [{ type: 'discord', url: 'https://discord.gg/evhpge7UCE' }],
    },
];

export const CRYSTAL = {
    title: 'Kronos Solution',
    icon: '/assets/logokronos.webp',
    description:
        'Projet cofonde avec Aurelien. On developpe nos propres logiciels et on accompagne les utilisateurs sur Discord.',
    shopUrl: 'https://crystal-solution.sellhub.cx/',
    discordUrl: 'https://discord.gg/evhpge7UCE',
};

export const CRYSTAL_FEATURES = [
    {
        key: 'code',
        title: 'CUSTOM SOFTWARE',
        description:
            'On cree des outils en C/C++ et des applis web selon les besoins.',
    },
    {
        key: 'web',
        title: 'WEB EXPERIENCES',
        description:
            'Des interfaces React propres, rapides et faciles a maintenir.',
    },
    {
        key: 'tools',
        title: 'PRIVATE TOOLS',
        description:
            'Des produits prives disponibles sur la boutique, avec suivi et support.',
    },
];

export const CRYSTAL_SCREENSHOTS = [
    { src: '/assets/kronos-loader-1.webp', fr: 'Connexion avec clé de licence', en: 'License key sign-in' },
    { src: '/assets/kronos-loader-2.webp', fr: 'Accueil et infos système', en: 'Home and system info' },
    { src: '/assets/kronos-loader-3.webp', fr: 'Choix du jeu', en: 'Game selection' },
    { src: '/assets/kronos-loader-4.webp', fr: 'Modules personnalisés', en: 'Custom modules' },
];

export const CRYSTAL_DURATIONS = ['1 day', '1 week', '1 month', 'lifetime'];

export const CRYSTAL_OFFERS = [
    {
        id: 'spoofers',
        title: 'Spoofers / Woofers',
        badge: 'Temp & Perm',
        badgeColor: '#00f0ff',
        description: 'Solutions de contournement et protection hardware anti-ban HWID pour vos jeux favoris (Valorant, Fortnite, etc.). Disponibles en formules Temporaire ou Permanente.',
        tags: ['Temp Spoofer', 'Perm Woofer', 'HWID Cleaner', 'Safe & Tested'],
    },
    {
        id: 'software',
        title: 'Logiciels Sur Mesure',
        badge: 'C / C++ & Web',
        badgeColor: '#a855f7',
        description: 'Développement d outils et logiciels privés haute performance, optimisations Windows et utilitaires taillés sur mesure.',
        tags: ['Custom Tools', 'High Performance', 'R&D Windows', 'Support 24/7'],
    },
    {
        id: 'accounts',
        title: 'Comptes Gaming & VOD',
        badge: 'Stock Varié',
        badgeColor: '#10b981',
        description: 'Comptes gaming (Valorant, Fortnite...) et abonnements streaming premium (Spotify, Netflix, Disney+) selon arrivages et disponibilités.',
        tags: ['Valorant', 'Fortnite', 'Spotify', 'Netflix', 'Disney+'],
    },
    {
        id: 'services',
        title: 'Services & Boosts',
        badge: 'Discord & More',
        badgeColor: '#f59e0b',
        description: 'Discord Nitro, boosts serveurs et commandes sur mesure personnalisées avec livraison rapide.',
        tags: ['Discord Nitro', 'Server Boosts', 'Sur Mesure'],
    },
];

export const CRYSTAL_PRICING_INFO = {
    note: 'Les prix sont flexibles et s adaptent a votre demande, aux options choisies et au type de produit.',
    startingAt: 'A partir de 5 EUR selon les formules et formats disponibles.',
};

export const PAYMENT_METHODS = {
    paypal: [
        {
            key: 'paypal',
            name: 'PayPal',
            value: 'paypal.me/LightDark23',
            copyValue: null,
            link: 'https://www.paypal.me/LightDark23',
        },
    ],
    crypto: [
        {
            key: 'btc',
            name: 'Bitcoin (BTC)',
            value: 'bc1qqnkvd7v9tjx5z2t9wkdad36ygpzrtht5d6x0d3',
            copyValue: 'bc1qqnkvd7v9tjx5z2t9wkdad36ygpzrtht5d6x0d3',
            link: null,
        },
        {
            key: 'eth',
            name: 'Ethereum (ETH)',
            value: '0x22459Be47Cd368EF75085D15d98F374b053f6056',
            copyValue: '0x22459Be47Cd368EF75085D15d98F374b053f6056',
            link: null,
        },
        {
            key: 'ltc',
            name: 'Litecoin (LTC)',
            value: 'LbinPaBsPB7HGzFaDpR73AjhoZ8ay23GaV',
            copyValue: 'LbinPaBsPB7HGzFaDpR73AjhoZ8ay23GaV',
            link: null,
        },
    ],
};

export const SKILLS = [
    { icon: 'SiC', label: 'C', color: '#A8B9CC' },
    { icon: 'SiCplusplus', label: 'C++', color: '#659AD2' },
    { icon: 'SiReact', label: 'React', color: '#61DAFB' },
    { icon: 'FaJava', label: 'Java', color: '#ED8B00' },
    { icon: 'SiJavascript', label: 'JavaScript', color: '#F7DF1E' },
];

export const GAME_ICONS = {
    Fortnite: '/assets/fortnite.webp',
    Valorant: '/assets/valorant.webp',
    Overwatch: '/assets/overwatch.webp',
    'Forza Horizon 5': '/assets/forza.webp',
};

export const CONTACT_LINKS = [
    { label: 'Discord', url: 'https://discord.gg/evhpge7UCE', icon: 'discord', priority: 'primary' },
    { label: 'Spotify', url: 'https://open.spotify.com/user/31nasvp5d3r2h2n2ivecywukzmje', icon: 'spotify', priority: 'secondary' },
    { label: 'Instagram', url: 'https://www.instagram.com/clem94_220', icon: 'instagram', priority: 'secondary' },
    { label: 'Steam', url: 'https://steamcommunity.com/id/947616406464/', icon: 'steam', priority: 'secondary' },
];

export const STAFF_SERVERS = [
    {
        name: 'Eon',
        icon: 'https://cdn.discordapp.com/icons/1295075156498317434/22c40ecaef78fdb06c5eaef833dfc104.png',
        role: 'Ancien Staff',
    },
    {
        name: 'Jinx',
        icon: 'https://cdn.discordapp.com/icons/1124276483846836224/993c299f53496859540974235a39e30b.png',
        role: 'Ancien Staff',
    },
    {
        name: 'Fairgame',
        icon: 'https://cdn.discordapp.com/icons/1475953315329081455/eb832513d611fa61c20a3a012f5f90f0.png',
        role: 'Ancien Staff',
    },
];

export const TEAM_FRIENDS = [
    {
        name: 'Aurelien',
        handle: 'aurelien6707',
        avatar: 'https://cdn.discordapp.com/avatars/968376926064492595/8c1f3c9d63dd157ddd2273529b1a1df6.png?size=4096',
        role: 'Software Developer - C, C++, C# (Co-Founder - Kronos Solution)',
        skills: ['C', 'C++', 'C#', 'Systems', 'Optimization'],
        badges: [{ label: 'Co-fondateur Kronos Solution' }],
    },
    {
        name: 'Vardox',
        handle: 'vardox58',
        discordId: '1373318082461962333',
        avatar: 'https://cdn.discordapp.com/avatars/1373318082461962333/9de58badd7be6af309bb8f85c4f029e6.png?size=4096',
        role: 'Full-Stack Web Developer & C/C++ Developer - React, Node.js, Tailwind, HTML/CSS',
        stats: 'Valorant Diamond - Fortnite Player',
        skills: ['React', 'Node.js', 'Tailwind', 'HTML/CSS', 'C', 'C++'],
        badges: [
            {
                label: 'Staff at Arp',
                icon: 'https://cdn.discordapp.com/icons/1471986667509387391/185dc8cf6c9fa8a33de8f9ff93777410.png',
            },
        ],
    },
    {
        name: 'Wayp',
        handle: 'waypx3',
        avatar: 'https://i.imgur.com/pns1uJE.png',
        role: 'Competitive Gamer & CRT Trader',
        stats: 'Fortnite Unreal Top 1000 - Sea of Thieves High Rank - CRT Trader',
        skills: ['Fortnite', 'Sea of Thieves', 'CRT Trading', 'Strategy', 'Analytics'],
        badges: [],
    },
];

export const DISCORD_INVITE_CODE = 'evhpge7UCE';
export const DISCORD_TICKET_URL = 'https://discord.com/channels/1312098874235813888/1472372111883632791';
export const DISCORD_DM_URL = 'https://discord.com/users/1145418060010901636';

export const CRYSTAL_VOUCHES = [
    { src: '/assets/vouch-1.webp' },
    { src: '/assets/vouch-2.webp' },
    { src: '/assets/vouch-3.webp' },
    { src: '/assets/vouch-4.webp' },
    { src: '/assets/vouch-5.webp' },
    { src: '/assets/vouch-6.webp' },
];
