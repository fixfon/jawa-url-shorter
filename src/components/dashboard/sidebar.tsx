import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { FunctionComponent } from 'react';
import type { Session } from 'next-auth';

type SidebarProps = {
	session: Session | null;
	status: 'authenticated' | 'loading' | 'unauthenticated';
};

const Sidebar: FunctionComponent<SidebarProps> = ({ session, status }) => {
	const username = session?.user?.name;
	const email = session?.user?.email;
	return (
		<div className='flex flex-col h-full w-1/6 min-w-fit px-4 justify-center items-center bg-red-400 border-r-4 border-solid border-blue-950'>
			<div className='profile-banner flex flex-row gap-5 mt-4 justify-center items-center text-center before:content-[""] before:border before:border-solid before:border-blue-950 before:self-stretch'>
				<div className='profile-banner-image -order-1'>
					<span>profileImage</span>
				</div>
				<div className='profile-banner-content '>
					{status === 'authenticated' && (
						<>
							<h2 className='text-2xl'>@{username}</h2>
							<h3 className='text-base opacity-70'>{email}</h3>
						</>
					)}
				</div>
			</div>
			<div className='profile-menu flex flex-col gap-3 my-8'>
				<Link href='/'>
					<button type='button'>home</button>
				</Link>
				<Link href='/dashboard'>
					<button type='button'>your jawa!</button>
				</Link>
				<Link href='/dashboard/edit-profile'>
					<button type='button'>edit profile</button>
				</Link>
				<button type='button' onClick={(e) => signOut({ callbackUrl: '/' })}>
					logout
				</button>
			</div>
		</div>
	);
};

export default Sidebar;
