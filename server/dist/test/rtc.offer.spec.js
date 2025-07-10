"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rtc_controller_1 = require("../src/modules/rtc/rtc.controller");
describe('RtcController', () => {
    let controller;
    let mockRtcGateway;
    beforeEach(() => {
        mockRtcGateway = {
            emitToUser: jest.fn().mockImplementation(() => Promise.resolve(true)),
            server: {
                to: jest.fn().mockReturnThis(),
                emit: jest.fn(),
            },
        };
        controller = new rtc_controller_1.RtcController(mockRtcGateway);
    });
    describe('handleOffer', () => {
        it('should forward offer to target user', async () => {
            const offerData = {
                to: 'target-user-id',
                sdp: 'test-sdp-offer',
                type: 'offer'
            };
            const result = await controller.handleOffer(offerData);
            expect(result).toEqual({ success: true });
            expect(mockRtcGateway.emitToUser).toHaveBeenCalledWith(offerData.to, 'rtcOffer', expect.objectContaining({
                to: offerData.to,
                sdp: offerData.sdp,
                type: 'offer'
            }));
            await Promise.resolve();
        });
    });
});
//# sourceMappingURL=rtc.offer.spec.js.map