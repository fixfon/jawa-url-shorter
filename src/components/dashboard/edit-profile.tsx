import {
	ChangeEvent,
	FunctionComponent,
	useEffect,
	useRef,
	useState,
} from 'react';
import type { Session } from 'next-auth';
import classNames from 'classnames';
import { trpc } from '../../common/client/trpc';

type EditProfileProps = {
	session: Session | null;
	status: 'authenticated' | 'loading' | 'unauthenticated';
};

const EditProfile: FunctionComponent<EditProfileProps> = ({
	session,
	status,
}) => {
	const username = session?.user?.name;
	const email = session?.user?.email;
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

	const [confirmError, setConfirmError] = useState(false);
	const [newOldConflict, setNewOldConflict] = useState(false);
	const [oldPasswordError, setOldPasswordError] = useState(false);
	const [internalError, setInternalError] = useState(false);
	const [success, setSuccess] = useState(false);

	const formRef = useRef<HTMLFormElement>(null);

	const changePasswordMutation = trpc.useMutation('changePassword', {
		onError: (error) => {
			if (error.message === 'Your current password is not correct.') {
				setOldPasswordError(true);
			} else if (error.message === 'User not found') {
				setInternalError(true);
			} else if (
				error.message === 'Your new password is the same as your old password.'
			) {
				setNewOldConflict(true);
			}
		},
		onSuccess: (data) => {
			setSuccess(true);
		},
	});

	useEffect(() => {
		if (currentPassword.length == 0 && newPassword.length == 0) return;
		if (newPassword !== newPasswordConfirm) setConfirmError(true);
		else if (currentPassword === newPassword) {
			setNewOldConflict(true);
			setConfirmError(false);
		} else {
			setConfirmError(false);
			setNewOldConflict(false);
		}
	}, [currentPassword, newPassword, newPasswordConfirm]);

	const handlePasswordChange = (e: ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		formRef.current?.reset();
		changePasswordMutation.mutate({
			oldPassword: currentPassword,
			newPassword: newPassword,
		});
	};

	const inputClass =
		'text-black lg:w-5/6 self-center p-2 bg-white border shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-920 focus:ring-blue-950 block rounded-md sm:text-sm focus:ring-1';

	const newPasswordInputClass = classNames(inputClass, {
		'focus:border-red-500': confirmError,
		'focus:ring-red-500': confirmError,
		'border-red-500': confirmError,
		'ring-red-500': confirmError,
		'text-red-500': confirmError,
	});

	return (
		<div className='flex h-full w-full min-w-fit flex-col gap-5 rounded-xl bg-blue-920 shadow-blueCustom'>
			{status === 'authenticated' && (
				<>
					<h2 className='pt-6 text-center text-2xl'>welcome @{username}</h2>
					<div className='editInfo mx-auto p-4 pb-8'>
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
							<h3 className='py-6 text-center text-xl'>change your password</h3>
							<form
								className='flex flex-col gap-5 text-black'
								onSubmit={handlePasswordChange}
								ref={formRef}>
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
									onChange={(e) => setNewPasswordConfirm(e.target.value)}
									required
								/>
								{confirmError && (
									<p className='block w-2/3 self-center rounded border-2 border-solid border-red-700 bg-red-700 text-center text-sm text-white'>
										confirm new password
									</p>
								)}
								{oldPasswordError && (
									<p className='block w-2/3 self-center rounded border-2 border-solid border-red-700 bg-red-700 text-center text-sm text-white'>
										you entered your current password incorrectly
									</p>
								)}
								{newOldConflict && (
									<p className='block w-2/3 self-center rounded border-2 border-solid border-red-700 bg-red-700 text-center text-sm text-white'>
										your new password is the same as your old password
									</p>
								)}
								{internalError && (
									<p className='block w-2/3 self-center rounded border-2 border-solid border-red-700 bg-red-700 text-center text-sm text-white'>
										there was an internal error, please try again
									</p>
								)}
								{success && (
									<p className='block w-2/3 self-center rounded border-2 border-solid border-green-600 bg-green-600 text-center text-sm text-white'>
										your password has been changed successfully.
									</p>
								)}
								<button
									type='submit'
									disabled={confirmError || newOldConflict}
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
