/**
 * @typedef {Object} Project
 * @property {string} title
 * @property {string} summary
 * @property {string[]} stack
 * @property {string} impact
 * @property {string} repoUrl
 * @property {string} demoUrl
 * @property {string} image
 */

/**
 * @typedef {Object} ProfileLink
 * @property {string} label
 * @property {string} url
 * @property {'github'|'cv'|'project'|'discord'|'instagram'|'steam'} icon
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
    studies: 'Je suis en Terminale generale (SES et HGGSP).',
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
        title: 'Crystal Solution',
        summary:
            'Projet monte avec Aurelien. On y propose nos logiciels et on gere le support via la communaute.',
        stack: ['Community', 'Software', 'Support'],
        impact: 'Mise en place du serveur, de l offre et du support client au quotidien.',
        repoUrl: 'https://github.com/Clem94220?tab=repositories',
        demoUrl: 'https://crystal-solution.sellhub.cx/',
        image: 'https://cdn.discordapp.com/icons/1312098874235813888/33067d0f3e2361db28d44d613d90a4b3.png?size=1024',
    },
    {
        title: 'R&D Logiciels Windows',
        summary:
            'Conception d outils Windows sur mesure, avec un gros focus sur la stabilite et les performances.',
        stack: ['C++', 'Python', 'Reverse Engineering'],
        impact: 'Des outils concrets livres pour des besoins precis, puis ameliores selon les retours.',
        repoUrl: 'https://github.com/Clem94220?tab=repositories',
        demoUrl: 'https://github.com/Clem94220?tab=repositories',
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

export const CRYSTAL_PRICING = [
    {
        title: 'A partir de',
        price: '5 EUR',
        description: 'Certaines cles en formule 1 day commencent a 5 EUR.',
    },
    {
        title: 'Unlock All Lifetime',
        price: '50 EUR',
        description:
            'L option la plus prisee: acces a vie au contenu cosmetique associe.',
        featured: true,
    },
    {
        title: 'Repere',
        price: '50 EUR',
        description: 'Repere: Unlock All est a 50 EUR, alors qu un couteau Valorant seul coute aussi 50 EUR.',
    },
];

export const CRYSTAL_CATALOG = [
    {
        title: 'Comptes gaming',
        description: 'Comptes Valorant, Fortnite et autres selon le stock du moment.',
    },
    {
        title: 'Comptes abonnements',
        description: 'Netflix, Spotify, Disney+ et autres selon disponibilite.',
    },
    {
        title: 'Services communautaires',
        description: 'Nitro et boosts serveur.',
    },
];

export const PAYMENT_METHODS = [
    {
        key: 'stripe',
        name: 'Stripe (Carte Bancaire)',
        value: null,
        copyValue: null,
        link: null,
    },
    {
        key: 'paypal',
        name: 'PayPal',
        value: 'paypal.me/clem942',
        copyValue: null,
        link: 'https://www.paypal.me/clem942',
    },
    {
        key: 'btc',
        name: 'Bitcoin (BTC)',
        value: 'bc1qqnkvd7v9tjx5z2t9wkdad36ygpzrtht5d6x0d3',
        copyValue: 'bc1qqnkvd7v9tjx5z2t9wkdad36ygpzrtht5d6x0d3',
        link: null,
    },
    {
        key: 'ltc',
        name: 'Litecoin (LTC)',
        value: 'LbinPaBsPB7HGzFaDpR73AjhoZ8ay23GaV',
        copyValue: 'LbinPaBsPB7HGzFaDpR73AjhoZ8ay23GaV',
        link: null,
    },
    {
        key: 'eth',
        name: 'Ethereum (ETH)',
        value: '0x22459Be47Cd368EF75085D15d98F374b053f6056',
        copyValue: '0x22459Be47Cd368EF75085D15d98F374b053f6056',
        link: null,
    },
];

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
    { icon: 'SiReact', label: 'React', color: '#61DAFB' },
    { icon: 'SiTypescript', label: 'TypeScript', color: '#3178C6' },
    { icon: 'SiCplusplus', label: 'C++', color: '#00599C' },
    { icon: 'SiC', label: 'C', color: '#A8B9CC' },
    { icon: 'SiHtml5', label: 'HTML', color: '#E34F26' },
    { icon: 'SiCss', label: 'CSS', color: '#1572B6' },
    { icon: 'SiPython', label: 'Python', color: '#3776AB' },
    { icon: 'SiNodedotjs', label: 'Node.js', color: '#339933' },
    { icon: 'SiTailwindcss', label: 'Tailwind CSS', color: '#06B6D4' },
    { icon: 'SiUnrealengine', label: 'Unreal Engine', color: '#FFFFFF' },
    { icon: 'SiGnubash', label: 'Reverse Engineering', color: '#4EAA25' },
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
    { label: 'Instagram', url: 'https://www.instagram.com/clem94_220', icon: 'instagram', priority: 'secondary' },
    { label: 'Steam', url: 'https://steamcommunity.com/id/947616406464/', icon: 'steam', priority: 'secondary' },
];

export const STAFF_SERVERS = [
    {
        name: 'Eon',
        icon: 'https://cdn.discordapp.com/icons/1295075156498317434/22c40ecaef78fdb06c5eaef833dfc104.png',
    },
    {
        name: 'Jinx',
        icon: 'https://cdn.discordapp.com/icons/1124276483846836224/993c299f53496859540974235a39e30b.png',
    },
    {
        name: 'Fairgame',
        icon: 'https://cdn.discordapp.com/icons/1475953315329081455/eb832513d611fa61c20a3a012f5f90f0.png',
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
        avatar: 'https://cdn.discordapp.com/avatars/1323387708973908140/f24da3abf6fffbb91f082efa895d2939.png?size=4096',
        role: 'Competitive Gamer & CRT Trader',
        stats: 'Fortnite Unreal Top 1000 - Sea of Thieves High Rank - CRT Trader',
        skills: ['Fortnite', 'Sea of Thieves', 'CRT Trading', 'Strategy', 'Analytics'],
        badges: [],
    },
];
