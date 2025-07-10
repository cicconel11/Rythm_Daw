import { RtcController } from '../src/modules/rtc/rtc.controller';
import { RtcGateway } from '../src/modules/rtc/rtc.gateway';

describe('RtcController', () => {
  let controller: RtcController;
  let rtcGateway: jest.Mocked<RtcGateway>;

  beforeEach(() => {
    // Create a mock RtcGateway
    rtcGateway = {
      emitToUser: jest.fn().mockReturnValue(true)
    } as any; // Using 'as any' to avoid implementing the entire RtcGateway interface

    // Create the controller instance with the mock gateway
    controller = new RtcController(rtcGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleOffer', () => {
    it('should call emitToUser with correct parameters', async () => {
      const offerData = {
        to: 'test-target-user',
        sdp: 'test-sdp',
        type: 'offer'
      };

      const result = await controller.handleOffer(offerData);

      expect(result).toEqual({ success: true });
      expect(rtcGateway.emitToUser).toHaveBeenCalledWith(
        offerData.to,
        'rtcOffer',
        offerData
      );
    });

    it('should handle emitToUser returning false', async () => {
      // Mock emitToUser to return false (message not sent)
      rtcGateway.emitToUser.mockReturnValueOnce(false);
      
      const offerData = {
        to: 'non-existent-user',
        sdp: 'test-sdp',
        type: 'offer'
      };

      const result = await controller.handleOffer(offerData);

      expect(result).toEqual({ success: false });
      expect(rtcGateway.emitToUser).toHaveBeenCalledWith(
        offerData.to,
        'rtcOffer',
        offerData
      );
    });

    it('should handle emitToUser throwing an error', async () => {
      // Mock emitToUser to throw an error
      rtcGateway.emitToUser.mockImplementationOnce(() => {
        throw new Error('Failed to send offer');
      });
      
      const offerData = {
        to: 'error-user',
        sdp: 'test-sdp',
        type: 'offer'
      };

      await expect(controller.handleOffer(offerData)).rejects.toThrow('Failed to send offer');
    });
  });

  describe('handleAnswer', () => {
    it('should call emitToUser with correct parameters', async () => {
      const answerData = {
        to: 'test-target-user',
        sdp: 'test-sdp',
        type: 'answer'
      };

      const result = await controller.handleAnswer(answerData);

      expect(result).toEqual({ success: true });
      expect(rtcGateway.emitToUser).toHaveBeenCalledWith(
        answerData.to,
        'rtcAnswer',
        answerData
      );
    });

    it('should handle emitToUser returning false', async () => {
      // Mock emitToUser to return false (message not sent)
      rtcGateway.emitToUser.mockReturnValueOnce(false);
      
      const answerData = {
        to: 'non-existent-user',
        sdp: 'test-sdp',
        type: 'answer'
      };

      const result = await controller.handleAnswer(answerData);

      expect(result).toEqual({ success: false });
      expect(rtcGateway.emitToUser).toHaveBeenCalledWith(
        answerData.to,
        'rtcAnswer',
        answerData
      );
    });

    it('should handle emitToUser throwing an error', async () => {
      // Mock emitToUser to throw an error
      rtcGateway.emitToUser.mockImplementationOnce(() => {
        throw new Error('Failed to send answer');
      });
      
      const answerData = {
        to: 'error-user',
        sdp: 'test-sdp',
        type: 'answer'
      };

      await expect(controller.handleAnswer(answerData)).rejects.toThrow('Failed to send answer');
    });
  });
});
