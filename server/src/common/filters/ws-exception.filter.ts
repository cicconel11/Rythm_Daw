import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException, Error)
export class WsExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(WsExceptionFilter.name);

  catch(exception: WsException | Error, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient<Socket>();
    
    let error: string | object;
    let status = 'error';
    
    if (exception instanceof WsException) {
      error = exception.getError();
      status = 'ws_error';
    } else {
      error = exception.message || 'Internal server error';
      this.logger.error(`WebSocket error: ${exception.message}`, exception.stack);
    }

    const errorResponse = {
      status,
      timestamp: new Date().toISOString(),
      message: error,
      error: exception.name || 'WebSocketError',
    };

    // Send error to the client
    client.emit('error', errorResponse);
    
    // For non-WsException errors, log the full stack trace
    if (!(exception instanceof WsException)) {
      this.logger.error(
        `WebSocket error for client ${client.id}: ${exception.message}`,
        exception.stack,
      );
    }
  }
}
