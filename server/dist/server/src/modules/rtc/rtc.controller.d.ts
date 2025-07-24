import { RtcOfferDto } from './dto/rtc-offer.dto';
import { RtcAnswerDto } from './dto/rtc-answer.dto';
import { RtcGateway } from './rtc.gateway';
export declare class RtcController {
    private readonly rtcGateway;
    constructor(rtcGateway: RtcGateway);
    handleOffer(dto: RtcOfferDto): Promise<{
        success: boolean;
    }>;
    handleAnswer(dto: RtcAnswerDto): Promise<{
        success: boolean;
    }>;
}
