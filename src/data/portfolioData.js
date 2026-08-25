/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} title
 * @property {string} summary
 * @property {string[]} stack
 * @property {string} impact
 * @property {string} repoUrl
 * @property {'website'|'discord'|'demo'} actionType
 * @property {string} actionLabel
 * @property {string} actionUrl
 * @property {string} image
 */

/**
 * @typedef {Object} ProfileLink
 * @property {string} label
 * @property {string} url
 * @property {'github'|'cv'|'project'|'discord'|'instagram'|'steam'|'spotify'} icon
 * @property {'primary'|'secondary'} priority
 */

/**
 * @typedef {Object} TimelineItem
 * @property {string} period
 * @property {string} title
 * @property {string} description
 * @property {string[]} tags
 */

/** @type {{ title: string, subtitle: string, location: string, availability: string, summary: string, identity: string, studies: string }} */
export const PROFILE = {
    title: 'Clem',
    subtitle: 'Developpeur web passionne, entre code et gaming competitif',
    identity: 'Je m appelle Clement, j ai 17 ans.',
    studies: 'Je suis actuellement etudiant en L1 AES (Administration Economique et Sociale).',
    location: 'France',
    availability: 'Ouvert aux collaborations et projets web',
    summary:
        'J aime creer des interfaces simples, rapides et agreables a utiliser, avec du code propre et maintenable.',
};

/** @type {ProfileLink[]} */
export const PROOF_LINKS = [
    { label: 'GitHub', url: 'https://github.com/Clem94220?tab=repositories', icon: 'github', priority: 'primary' },
    { label: 'CV', url: '/assets/cv-clem.txt', icon: 'cv', priority: 'primary' },
    { label: 'Voir les projets', url: '#projects', icon: 'project', priority: 'secondary' },
];

/** @type {Project[]} */
export const PROJECTS = [
    {
        id: 'crystal',
        title: 'Crystal Solution',
        summary:
            'Projet monte avec Aurelien. On y propose nos logiciels et on gere le support via la communaute.',
        stack: ['Community', 'Software', 'Support'],
        impact: 'Mise en place du serveur, de l offre et du support client au quotidien.',
        repoUrl: 'https://github.com/Clem94220?tab=repositories',
        actionType: 'website',
        actionLabel: 'Website',
        actionUrl: 'https://crystal-solution.sellhub.cx/',
        image: 'https://cdn.discordapp.com/icons/1312098874235813888/33067d0f3e2361db28d44d613d90a4b3.png?size=1024',
    },
    {
        id: 'rd_windows',
        title: 'R&D Logiciels Windows',
        summary:
            'Conception d outils Windows sur mesure, avec un gros focus sur la stabilite et les performances.',
        stack: ['C++', 'Python', 'Reverse Engineering'],
        impact: 'Des outils concrets livres pour des besoins precis, puis ameliores selon les retours.',
        repoUrl: 'https://github.com/Clem94220?tab=repositories',
        actionType: 'discord',
        actionLabel: 'Discord',
        actionUrl: 'https://discord.gg/evhpge7UCE',
        image: 'https://i.pinimg.com/736x/93/d8/04/93d8043b3c06807022c0390b3dfb4017.jpg',
    },
];

export const CRYSTAL = {
    title: 'Crystal Solution',
    icon: 'https://cdn.discordapp.com/icons/1312098874235813888/33067d0f3e2361db28d44d613d90a4b3.png?size=1024',
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
            value: 'paypal.me/clem942',
            copyValue: null,
            link: 'https://www.paypal.me/clem942',
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

/** @type {TimelineItem[]} */
export const TIMELINE = [
    {
        period: '2024 - Aujourd hui',
        title: 'Projets web perso',
        description:
            'Creation de projets React perso, avec beaucoup de tests UI sur mobile et desktop.',
        tags: ['React', 'HTML', 'CSS', 'UI', 'Performance'],
    },
    {
        period: '2023 - 2024',
        title: 'Montee en competence full-stack',
        description:
            'Apprentissage de JavaScript, Node.js, API et bases en C sur des projets concrets.',
        tags: ['JavaScript', 'Node.js', 'API', 'C'],
    },
    {
        period: 'Continu',
        title: 'Esprit competitif gaming',
        description:
            'Le gaming m a appris a iterer vite, analyser mes erreurs et rester regulier.',
        tags: ['Rigueur', 'Execution', 'Iteration'],
    },
];

export const SKILLS = [
    { icon: 'SiC', label: 'C', color: '#A8B9CC' },
    { icon: 'SiCplusplus', label: 'C++', color: '#659AD2' },
    { icon: 'SiReact', label: 'React', color: '#61DAFB' },
    { icon: 'FaJava', label: 'Java', color: '#ED8B00' },
    { icon: 'SiJavascript', label: 'JavaScript', color: '#F7DF1E' },
];

export const GAMING = [
    {
        title: 'Overwatch',
        detail: 'Communication et prise de decision rapide en equipe.',
        image: '/assets/overwatch.webp',
    },
    {
        title: 'Fortnite',
        detail: 'Top 1000 Unreal atteint, avec un vrai focus sur la constance.',
        image: '/assets/fortnite.webp',
    },
    {
        title: 'Valorant',
        detail: 'Jeu tactique: lecture du jeu, info et decisions sous pression.',
        image: '/assets/valorant.webp',
    },
    {
        title: 'Forza Horizon 5',
        detail: 'Precision et regularite sur des sessions longues.',
        image: '/assets/forza.webp',
    },
];

/** @type {ProfileLink[]} */
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
        role: 'Software Developer - C, C++, C# (Co-Founder - Crystal Solution)',
        skills: ['C', 'C++', 'C#', 'Systems', 'Optimization'],
        badges: [{ label: 'Co-fondateur Crystal Solution' }],
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
