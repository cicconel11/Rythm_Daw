import { RtcController } from '../src/modules/rtc/rtc.controller';
import { RtcGateway } from '../src/modules/rtc/rtc.gateway';
import { RtcOfferDto } from '../src/modules/rtc/dto/rtc-offer.dto';

describe('RtcController', () => {
  let controller: RtcController;
  let mockRtcGateway: jest.Mocked<RtcGateway>;

  beforeEach(() => {
    // Create a mock RtcGateway
    mockRtcGateway = {
      emitToUser: jest.fn().mockImplementation(() => Promise.resolve(true)),
      server: {
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
      },
    } as unknown as jest.Mocked<RtcGateway>;

    // Create an instance of the controller with the mock gateway
    controller = new RtcController(mockRtcGateway);
  });

  describe('handleOffer', () => {
    it('should forward offer to target user', async () => {
      // Arrange
      const offerData: RtcOfferDto = {
        to: 'target-user-id',
        sdp: 'test-sdp-offer',
        type: 'offer'
      };

      // Act
      const result = await controller.handleOffer(offerData);
      
      // Assert
      expect(result).toEqual({ success: true });
      expect(mockRtcGateway.emitToUser).toHaveBeenCalledWith(
        offerData.to,
        'rtcOffer',
        expect.objectContaining({
          to: offerData.to,
          sdp: offerData.sdp,
          type: 'offer'
        })
      );
      
      // Ensure the promise from emitToUser is resolved
      await Promise.resolve();
    });
  });
});
