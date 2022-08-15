import Link from 'next/link';
import { useSession } from 'next-auth/react';

const Header = () => {
	const { status } = useSession();
	return (
		<div className='flex text-center items-center justify-between pl-20 pr-20 pt-10'>
			<Link href='/'>
				<span className='text-4xl font-bold text-white'>jawa!</span>
			</Link>
			<div className='text-xl font-semibold flex items-center justify-center gap-8'>
				{status === 'unauthenticated' ? (
					<>
						<Link href='/login'>
							<button type='button'>login</button>
						</Link>
						<Link href='/register'>
							<button type='button'>register</button>
						</Link>
					</>
				) : (
					<Link href='/dashboard'>
						<button type='button'>dashboard</button>
					</Link>
				)}
			</div>
		</div>
	);
};

export default Header;
