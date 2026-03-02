import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import RamadanBanner from '../branding/RamadanBanner';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <RamadanBanner />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
