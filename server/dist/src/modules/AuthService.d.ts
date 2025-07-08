import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { type NextAuthOptions, type DefaultSession } from 'next-auth';
declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string;
            email: string;
            name?: string | null;
        } & DefaultSession['user'];
    }
}
type NextApiRequest = ExpressRequest & {
    body: any;
    method?: string;
};
type NextApiResponse = ExpressResponse & {
    status: (code: number) => NextApiResponse;
    json: (data: any) => void;
};
export declare const authOptions: NextAuthOptions;
declare const _default: any;
export default _default;
export declare function handleDeviceCodeRequest(req: NextApiRequest, res: NextApiResponse): Promise<NextApiResponse>;
export declare function handleDeviceToken(req: NextApiRequest, res: NextApiResponse): Promise<NextApiResponse>;
