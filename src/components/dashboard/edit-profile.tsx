import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { FunctionComponent, useState } from 'react';
import type { Session } from 'next-auth';
import classNames from 'classnames';

type EditProfileProps = {
	session: Session | null;
	status: 'authenticated' | 'loading' | 'unauthenticated';
};

// TODO - Do more styling on sidebar.

const EditProfile: FunctionComponent<EditProfileProps> = ({
	session,
	status,
}) => {
	const username = session?.user?.name;
	const email = session?.user?.email;
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmError, setConfirmError] = useState(false);

	const handlePasswordConfirm = (e) => {
		if (e.target.value !== newPassword) setConfirmError(true);
		else setConfirmError(false);
	};

	const handlePasswordChange = (e) => {
		e.preventDefault();
	};

	const inputClass =
		'text-black w-5/6 self-center p-2 bg-white border shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-920 focus:ring-blue-950 block w-full rounded-md sm:text-sm focus:ring-1';

	const newPasswordInputClass = classNames(inputClass, {
		'focus:border-red-500': confirmError,
		'focus:ring-red-500': confirmError,
		'border-red-500': confirmError,
		'ring-red-500': confirmError,
		'text-red-500': confirmError,
	});

	return (
		<div className='flex h-full w-full min-w-fit flex-col gap-5 bg-blue-920 px-4'>
			{status === 'authenticated' && (
				<>
					<h2 className='text-center text-2xl'>welcome @{username}</h2>
					<div className='editInfo mx-auto my-20'>
						<div className='info flex flex-col'>
							<div className='flex flex-row'>
								<h3 className='pr-4 text-lg'>username</h3>
								<p className='text-lg'>{username}</p>
							</div>
							<div className='flex flex-row'>
								<h3 className='pr-14 text-lg'>email</h3>
								<p className='text-lg'>{email}</p>
							</div>
						</div>
						<div className='changePassword mt-6'>
							<h3 className='py-6 text-xl text-center'>change your password</h3>
							<form
								className='flex flex-col gap-5 text-black'
								onSubmit={handlePasswordChange}>
								<input
									type='password'
									placeholder='current password'
									className={inputClass}
									onChange={(e) => setCurrentPassword(e.target.value)}
									required
								/>
								<input
									type='password'
									className={newPasswordInputClass}
									placeholder='new password'
									onChange={(e) => setNewPassword(e.target.value)}
									required
								/>
								<input
									type='password'
									className={newPasswordInputClass}
									placeholder='confirm new password'
									onChange={handlePasswordConfirm}
									required
								/>
								{confirmError && (
									<p className='block w-2/3 self-center rounded border-2 border-solid border-red-700 bg-red-700 text-center text-sm text-white'>
										confirm new password
									</p>
								)}
								<button
									type='submit'
									disabled={confirmError}
									className='mt-4 cursor-pointer self-center rounded bg-gray-950 p-2 font-semibold text-white transition-colors duration-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:opacity-50'>
									change password
								</button>
							</form>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default EditProfile;
