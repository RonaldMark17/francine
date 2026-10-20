import HomePage from '../../pages/HomePage';
import ShopPage from '../../pages/ShopPage';
import PromotionsPage from '../../pages/PromotionsPage';
import PrintingServicesPage from '../../pages/PrintingServicesPage';
import TransactionsPage from '../../pages/TransactionsPage';
import AboutPage from '../../pages/AboutPage';
import ContactPage from '../../pages/ContactPage';

const corePages = {
  '/': HomePage, '/shop': ShopPage, '/promotions': PromotionsPage,
  '/services': PrintingServicesPage, '/transactions': TransactionsPage,
  '/about': AboutPage, '/contact': ContactPage,
};

export default function CorePageContent({ route }) {
  const Page = corePages[route];
  return Page ? <Page /> : null;
}
