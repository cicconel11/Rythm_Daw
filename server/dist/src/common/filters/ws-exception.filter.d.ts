import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
export declare class WsExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: WsException | Error, host: ArgumentsHost): void;
}
