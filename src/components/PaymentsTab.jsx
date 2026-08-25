import { motion } from 'framer-motion';
import { SiPaypal, SiBitcoin, SiLitecoin, SiEthereum } from 'react-icons/si';
import { FaCoins, FaPaypal } from 'react-icons/fa';
import PaymentCard from './PaymentCard';

const sectionStagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const fadeBlur = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
const cardContainerStagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const cardItem = {
    hidden: { opacity: 0, y: 25, scale: 0.95, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

const PAYPAL = [
    { icon: SiPaypal, name: 'PayPal', value: 'paypal.me/clem942', copyValue: null, link: 'https://www.paypal.me/clem942', color: '#0079C1' },
];

const CRYPTOS = [
    { icon: SiBitcoin, name: 'Bitcoin (BTC)', value: 'bc1qqnkvd7v9tjx5z2t9wkdad36ygpzrtht5d6x0d3', copyValue: 'bc1qqnkvd7v9tjx5z2t9wkdad36ygpzrtht5d6x0d3', color: '#F7931A' },
    { icon: SiEthereum, name: 'Ethereum (ETH)', value: '0x22459Be47Cd368EF75085D15d98F374b053f6056', copyValue: '0x22459Be47Cd368EF75085D15d98F374b053f6056', color: '#627EEA' },
    { icon: SiLitecoin, name: 'Litecoin (LTC)', value: 'LbinPaBsPB7HGzFaDpR73AjhoZ8ay23GaV', copyValue: 'LbinPaBsPB7HGzFaDpR73AjhoZ8ay23GaV', color: '#345D9D' },
];

/**
 * PaymentsTab — payment methods with distinct PayPal and Crypto sections
 */
export default function PaymentsTab() {
    return (
        <motion.div
            variants={sectionStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="space-y-8"
        >
            <motion.div variants={fadeBlur} className="space-y-6">
                <h2 className="text-xl font-semibold text-txt-primary mb-5 flex items-center gap-2 font-display tracking-wider uppercase text-sm">
                    <span className="section-heading-bar" />
                    Moyens de Paiement
                </h2>

                {/* PayPal */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <FaPaypal className="text-sm text-[#0079C1]" />
                        <span className="text-xs uppercase font-mono tracking-wider text-txt-muted">PayPal</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {PAYPAL.map((p) => (
                            <PaymentCard key={p.name} {...p} />
                        ))}
                    </div>
                </div>

                {/* Crypto */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <FaCoins className="text-sm text-[#F7931A]" />
                        <span className="text-xs uppercase font-mono tracking-wider text-txt-muted">Cryptomonnaies</span>
                    </div>
                    <motion.div
                        variants={cardContainerStagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        {CRYPTOS.map((p) => (
                            <motion.div key={p.name} variants={cardItem}>
                                <PaymentCard {...p} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
}
