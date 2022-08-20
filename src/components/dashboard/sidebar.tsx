import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { FunctionComponent } from 'react';
import type { Session } from 'next-auth';

type SidebarProps = {
	session: Session | null;
	status: 'authenticated' | 'loading' | 'unauthenticated';
};

// TODO - Do more styling on sidebar.

const Sidebar: FunctionComponent<SidebarProps> = ({ session, status }) => {
	const username = session?.user?.name;
	const email = session?.user?.email;
	return (
		<div className='flex h-full w-1/6 min-w-fit flex-col items-center justify-center border-r-4 border-solid border-white bg-blue-920 px-4'>
			<div className='profile-banner mt-4 flex flex-row items-center justify-center gap-5 text-center before:self-stretch before:border before:border-solid before:border-white before:content-[""]'>
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
			<div className='profile-menu my-8 flex flex-col gap-3'>
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
