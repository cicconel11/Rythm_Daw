"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rtc_controller_1 = require("../src/modules/rtc/rtc.controller");
describe('RtcController', () => {
    let controller;
    let rtcGateway;
    beforeEach(() => {
        rtcGateway = {
            emitToUser: jest.fn().mockReturnValue(true)
        };
        controller = new rtc_controller_1.RtcController(rtcGateway);
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
            expect(rtcGateway.emitToUser).toHaveBeenCalledWith(offerData.to, 'rtcOffer', offerData);
        });
        it('should handle emitToUser returning false', async () => {
            rtcGateway.emitToUser.mockReturnValueOnce(false);
            const offerData = {
                to: 'non-existent-user',
                sdp: 'test-sdp',
                type: 'offer'
            };
            const result = await controller.handleOffer(offerData);
            expect(result).toEqual({ success: false });
            expect(rtcGateway.emitToUser).toHaveBeenCalledWith(offerData.to, 'rtcOffer', offerData);
        });
        it('should handle emitToUser throwing an error', async () => {
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
            expect(rtcGateway.emitToUser).toHaveBeenCalledWith(answerData.to, 'rtcAnswer', answerData);
        });
        it('should handle emitToUser returning false', async () => {
            rtcGateway.emitToUser.mockReturnValueOnce(false);
            const answerData = {
                to: 'non-existent-user',
                sdp: 'test-sdp',
                type: 'answer'
            };
            const result = await controller.handleAnswer(answerData);
            expect(result).toEqual({ success: false });
            expect(rtcGateway.emitToUser).toHaveBeenCalledWith(answerData.to, 'rtcAnswer', answerData);
        });
        it('should handle emitToUser throwing an error', async () => {
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
//# sourceMappingURL=rtc.controller.spec.js.map