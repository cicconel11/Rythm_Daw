import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PluginsService {
  private pairings: Map<string, { userId: string; status: string; deviceInfo?: unknown }> = new Map();
  private readonly PAIRING_EXPIRY = 15 * 60 * 1000; // 15 minutes

  constructor(private prisma: PrismaService) {
    // Clean up expired pairings periodically
    setInterval(() => this.cleanupExpiredPairings(), 5 * 60 * 1000);
  }

  async initiatePairing(userId: string, code: string) {
    // Store the pairing with a timestamp
    this.pairings.set(code, {
      userId,
      status: 'pending',
      createdAt: Date.now(),
    });
  }

  async checkPairingStatus(code: string) {
    const pairing = this.pairings.get(code);
    if (!pairing) {
      throw new NotFoundException('Pairing not found');
    }

    return { status: pairing.status };
  }

  async confirmPairing(code: string, deviceInfo?: unknown) {
    const pairing = this.pairings.get(code);
    if (!pairing) {
      throw new NotFoundException('Pairing not found');
    }

    // Update status to paired
    pairing.status = 'paired';
    pairing.deviceInfo = deviceInfo;
    this.pairings.set(code, pairing);

    // Create a new device record in the database
    const device = await this.prisma.device.create({
      data: {
        id: uuidv4(),
        userId: pairing.userId,
        name: deviceInfo?.name || 'DAW Plugin',
        type: 'DAW_PLUGIN',
        info: deviceInfo || {},
        lastActiveAt: new Date(),
      },
    });

    return device;
  }

  private cleanupExpiredPairings() {
    const now = Date.now();
    for (const [code, pairing] of this.pairings.entries()) {
      if (now - pairing.createdAt > this.PAIRING_EXPIRY) {
        this.pairings.delete(code);
      }
    }
  }
}
