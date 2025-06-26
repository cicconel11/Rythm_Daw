import { NextApiRequest, NextApiResponse } from 'next';
import { NextAuthOptions } from 'next-auth';
export declare const authOptions: NextAuthOptions;
declare const _default: any;
export default _default;
export declare function handleDeviceCodeRequest(req: NextApiRequest, res: NextApiResponse): Promise<any>;
export declare function handleDeviceToken(req: NextApiRequest, res: NextApiResponse): Promise<any>;
