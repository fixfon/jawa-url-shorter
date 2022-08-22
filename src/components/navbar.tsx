import Link from 'next/link';
import { useSession } from 'next-auth/react';

const Header = () => {
	const { status } = useSession();
	return (
		<div className='flex items-center justify-between px-5 pt-10 text-center lg:px-20'>
			<Link href='/'>
				<button type='button' className='text-4xl font-bold text-white'>
					jawa!
				</button>
			</Link>
			<div className='flex items-center justify-center gap-8 text-xl font-semibold'>
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
