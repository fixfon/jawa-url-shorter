import * as trpcNext from '@trpc/server/adapters/next';
import { serverRouter } from '../../../server/router/router';
import { createContext } from '../../../server/router/context';

export default trpcNext.createNextApiHandler({
	router: serverRouter,
	createContext,
});