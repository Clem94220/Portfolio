import { motion } from 'framer-motion';
import { SiStripe, SiPaypal, SiBitcoin, SiLitecoin, SiEthereum } from 'react-icons/si';
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

const PAYMENTS = [
    { icon: SiStripe, name: 'Stripe (Credit Card)', value: null, copyValue: null, color: '#e0e0e0' },
    { icon: SiPaypal, name: 'PayPal', value: 'paypal.me/clem942', copyValue: null, link: 'https://www.paypal.me/clem942', color: '#c2c2c2' },
    { icon: SiBitcoin, name: 'Bitcoin (BTC)', value: 'bc1qqnkvd7v9tjx5z2t9wkdad36ygpzrtht5d6x0d3', copyValue: 'bc1qqnkvd7v9tjx5z2t9wkdad36ygpzrtht5d6x0d3', color: '#ffffff' },
    { icon: SiLitecoin, name: 'Litecoin (LTC)', value: 'LbinPaBsPB7HGzFaDpR73AjhoZ8ay23GaV', copyValue: 'LbinPaBsPB7HGzFaDpR73AjhoZ8ay23GaV', color: '#a8a8a8' },
    { icon: SiEthereum, name: 'Ethereum (ETH)', value: '0x22459Be47Cd368EF75085D15d98F374b053f6056', copyValue: '0x22459Be47Cd368EF75085D15d98F374b053f6056', color: '#909090' },
];

/**
 * PaymentsTab — payment methods with cascading card reveal
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
            <motion.div variants={fadeBlur}>
                <h2 className="text-xl font-semibold text-txt-primary mb-5 flex items-center gap-2 font-display tracking-wider uppercase text-sm">
                    <span className="section-heading-bar" />
                    Payment Methods
                </h2>
                <motion.div
                    variants={cardContainerStagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {PAYMENTS.map((p) => (
                        <motion.div key={p.name} variants={cardItem}>
                            <PaymentCard {...p} />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
