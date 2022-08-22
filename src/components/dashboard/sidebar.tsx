import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { FunctionComponent } from 'react';
import type { Session } from 'next-auth';
import { GiDwarfFace } from 'react-icons/gi';

type SidebarProps = {
	session: Session | null;
	status: 'authenticated' | 'loading' | 'unauthenticated';
};


const Sidebar: FunctionComponent<SidebarProps> = ({ session, status }) => {
	const username = session?.user?.name;
	const email = session?.user?.email;
	return (
		<div className='flex w-1/6 min-w-fit flex-col gap-5 justify-self-stretch rounded-xl border-none bg-blue-920 px-4 py-[calc(100vh/10)] shadow-blueCustom'>
			<div className='profile-banner mt-4 flex flex-row items-center justify-center gap-5 text-center before:self-stretch before:border before:border-solid before:border-white before:opacity-50 before:content-[""]'>
				<div className='profile-banner-image -order-1'>
					<span>
						<GiDwarfFace size={64} />
					</span>
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
			<div className='profile-menu my-auto flex w-full flex-col gap-3 before:border before:border-solid before:border-white before:opacity-50 before:content-[""] after:border after:border-solid after:border-white after:opacity-50 after:content-[""]'>
				<Link href='/'>
					<button type='button'>home</button>
				</Link>
				<Link href='/dashboard'>
					<button type='button'>your jawa!</button>
				</Link>
				<Link href='/dashboard/edit-profile'>
					<button type='button'>edit profile</button>
				</Link>
				<button type='button' onClick={() => signOut({ callbackUrl: '/' })}>
					logout
				</button>
			</div>
		</div>
	);
};

export default Sidebar;
