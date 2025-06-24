import { Controller, Post, Body, HttpStatus, UseGuards, Req, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { QosService } from './qos.service';
import { WebRtcMetricDto } from './dto/webrtc-metric.dto';
import { CrashReportDto } from './dto/crash-report.dto';
import { Request } from 'express';

@ApiTags('QoS')
@Controller('api/qos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class QosController {
  constructor(private readonly qosService: QosService) {}

  @Post('webrtc')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ 
    summary: 'Record WebRTC metrics',
    description: 'Records WebRTC connection quality metrics for monitoring and analytics.'
  })
  @ApiResponse({ 
    status: HttpStatus.ACCEPTED, 
    description: 'Metrics accepted for processing' 
  })
  @ApiBody({
    type: WebRtcMetricDto,
    examples: {
      basic: {
        summary: 'Basic WebRTC metrics',
        value: {
          peerConnectionId: 'pc_1234567890',
          rttMs: 45.2,
          jitterMs: 2.5,
          packetLoss: 1.2,
          networkType: 'wifi',
          effectiveType: '4g',
          downlinkMbps: 10.5
        }
      }
    }
  })
  async recordWebRtcMetrics(
    @Body() dto: WebRtcMetricDto,
    @GetUser() user: JwtPayload,
  ) {
    await this.qosService.recordWebRtcMetrics(dto, user?.sub);
    return { success: true, message: 'Metrics accepted for processing' };
  }

  @Post('crash')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ 
    summary: 'Submit a crash report',
    description: 'Submits a crash report with encrypted stack trace and diagnostic information.'
  })
  @ApiResponse({ 
    status: HttpStatus.ACCEPTED, 
    description: 'Crash report accepted' 
  })
  @ApiBody({
    type: CrashReportDto,
    examples: {
      basic: {
        summary: 'Basic crash report',
        value: {
          type: 'uncaught',
          name: 'TypeError',
          message: 'Cannot read property of undefined',
          stack: 'TypeError: Cannot read property of undefined\n    at App.componentWillMount (webpack-internal:///./src/App.js:24:7)',
          platform: 'web',
          os: 'Windows 10',
          browser: 'Chrome 91.0.4472.124',
          url: 'https://example.com/dashboard',
          memoryUsage: {
            jsHeapSizeLimit: 2330000000,
            usedJSHeapSize: 12345678,
            totalJSHeapSize: 23456789
          }
        }
      }
    }
  })
  async recordCrashReport(
    @Body() dto: CrashReportDto,
    @GetUser() user: JwtPayload,
    @Req() req: Request
  ) {
    // Add IP and user agent if not provided
    const enhancedReport = {
      ...dto,
      userAgent: dto.userAgent || req.headers['user-agent'],
    };

    await this.qosService.recordCrashReport(enhancedReport, user?.sub);
    return { success: true, message: 'Crash report submitted' };
  }
}
