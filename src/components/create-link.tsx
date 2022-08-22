import type { NextPage } from 'next';
import { useState } from 'react';
import classNames from 'classnames';
import { nanoid } from 'nanoid';
import debounce from 'lodash/debounce';
import { trpc } from '../common/client/trpc';
import copy from 'copy-to-clipboard';

type Form = {
	slug: string;
	url: string;
};

const CreateLinkForm: NextPage = () => {
	// const [copied, setCopied] = useState(false);
	const [form, setForm] = useState<Form>({ slug: '', url: '' });
	const url = window.location.origin.split('//').slice(1) + '/';

	const slugCheck = trpc.useQuery(['slugCheck', { slug: form.slug }], {
		refetchOnReconnect: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});
	const createSlug = trpc.useMutation(['createSlug']);

	const input =
		'text-black my-1 p-2 bg-white border shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-920 focus:ring-blue-950 block w-full rounded-md sm:text-sm focus:ring-1';

	const slugInput = classNames(input, {
		'focus:border-red-500': slugCheck.isFetched && slugCheck.data!.used,
		'focus:ring-red-500': slugCheck.isFetched && slugCheck.data!.used,
		'border-blue-920': slugCheck.isFetched,
		'border-red-500': slugCheck.isFetched && slugCheck.data!.used,
		'text-red-500': slugCheck.isFetched && slugCheck.data!.used,
	});

	const disabledButton = 'bg-gray-500 cursor-not-allowed opacity-50';

	if (createSlug.status === 'success') {
		return (
			<>
				<h2 className='mb-4 text-xl'>copied to clipboard</h2>
				<div className='flex items-center justify-center'>
					<h1>{`https://${url}${form.slug}`}</h1>
					<button
						type='button'
						className='ml-2 cursor-pointer rounded bg-blue-920 py-1.5 px-1 font-semibold transition-colors duration-200 hover:bg-blue-950'
						onClick={() => {
							// setCopied(true);
							copy(`https://${url}${form.slug}`);
						}}>
						copy again
					</button>
				</div>
				<button
					type='button'
					value='Reset'
					className='m-5 cursor-pointer rounded bg-blue-920 py-1.5 px-5 font-semibold transition-colors duration-200 hover:bg-blue-950'
					onClick={() => {
						createSlug.reset();
						setForm({ slug: '', url: '' });
					}}>
					create another
				</button>
			</>
		);
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				createSlug.mutate({ ...form });
				copy(`https://${url}${form.slug}`);
			}}
			className='flex h-[75vh] flex-col justify-center sm:w-2/3 md:w-1/2 lg:w-1/3'>
			<div className='flex items-center justify-center'>
				<input
					type='url'
					onChange={(e) => setForm({ ...form, url: e.target.value })}
					placeholder='your url'
					className={input + ' w-3/4 border-blue-920'}
					required></input>
			</div>
			<div className='flex items-center'>
				<span>{url}</span>
				<input
					type='text'
					onChange={(e) => {
						setForm({ ...form, slug: e.target.value });
						debounce(slugCheck.refetch, 100);
					}}
					minLength={1}
					placeholder='jawa!'
					className={slugInput}
					value={form.slug}
					pattern={'^[-a-zA-Z0-9]+$'}
					title='Only alphanumeric character and hypens are allowed. No spaces.'
					required></input>
				<button
					type='button'
					className='ml-2 cursor-pointer rounded bg-blue-920 py-1.5 px-1 font-semibold transition-colors duration-200 hover:bg-blue-950'
					onClick={() => {
						const slug = nanoid(10);
						setForm({
							...form,
							slug,
						});
						slugCheck.refetch();
					}}>
					random
				</button>
			</div>
			{(slugCheck.data?.used ) && (
				<span className='mt-2 text-center font-normal text-red-500'>
					slug already in use.
				</span>
			)}
			<button
				type='submit'
				className={
					'mt-4 w-1/4 cursor-pointer self-center rounded bg-blue-920 p-2 font-semibold  transition-colors duration-200 hover:bg-blue-950 disabled:cursor-not-allowed disabled:bg-blue-980 disabled:opacity-50'
				}
				disabled={slugCheck.isFetched && slugCheck.data!.used}>
				create
			</button>
		</form>
	);
};

export default CreateLinkForm;
