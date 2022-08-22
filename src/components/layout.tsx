import Navbar from './navbar';
import Footer from './footer';

interface LayoutProps {
	children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
	return (
		<div className='min-h-screen gap-8 h-full flex flex-col justify-between bg-gray-950 text-white px-6'>
			<Navbar />
			{children}
			<Footer />
		</div>
	);
};

export default Layout