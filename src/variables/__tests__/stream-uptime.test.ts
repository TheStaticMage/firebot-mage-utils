import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";

const mockGetStreamersCurrentStream = jest.fn();
const defaultModules = {
    twitchApi: {
        streams: {
            getStreamersCurrentStream: mockGetStreamersCurrentStream
        }
    }
};

const mockFirebot = {
    modules: defaultModules
};

const mockLogger = {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn()
};

jest.mock('../../main', () => ({
    firebot: mockFirebot,
    logger: mockLogger
}));

import model from '../stream-uptime';

describe('streamUptime variable', () => {
    let mockTrigger: Effects.Trigger;

    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2024-01-01T00:00:05.000Z'));

        mockTrigger = {} as Effects.Trigger;
        mockFirebot.modules = defaultModules;
        mockGetStreamersCurrentStream.mockReset();
        mockLogger.debug.mockReset();
        mockLogger.error.mockReset();
        mockLogger.info.mockReset();
        mockLogger.warn.mockReset();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('returns seconds when the stream is live', async () => {
        mockGetStreamersCurrentStream.mockResolvedValue({
            startDate: new Date('2024-01-01T00:00:00.000Z')
        });

        const result = await model.evaluator(mockTrigger);
        expect(result).toBe('5');
    });

    it('returns -1 when the stream is offline', async () => {
        mockGetStreamersCurrentStream.mockResolvedValue(null);

        const result = await model.evaluator(mockTrigger);
        expect(result).toBe('-1');
    });

    it('returns 0 for very recent streams', async () => {
        mockGetStreamersCurrentStream.mockResolvedValue({
            startDate: new Date('2024-01-01T00:00:05.000Z')
        });

        const result = await model.evaluator(mockTrigger);
        expect(result).toBe('0');
    });

    it('handles long running streams', async () => {
        mockGetStreamersCurrentStream.mockResolvedValue({
            startDate: new Date('2023-12-31T23:00:05.000Z')
        });

        const result = await model.evaluator(mockTrigger);
        expect(result).toBe('3600');
    });

    it('returns -1 when twitchApi is unavailable', async () => {
        mockFirebot.modules = {} as typeof mockFirebot.modules;

        const result = await model.evaluator(mockTrigger);
        expect(result).toBe('-1');
    });

    it('returns -1 when the stream has no startDate', async () => {
        mockGetStreamersCurrentStream.mockResolvedValue({});

        const result = await model.evaluator(mockTrigger);
        expect(result).toBe('-1');
    });

    it('returns -1 when the stream startDate is invalid', async () => {
        mockGetStreamersCurrentStream.mockResolvedValue({
            startDate: new Date('invalid date')
        });

        const result = await model.evaluator(mockTrigger);
        expect(result).toBe('-1');
    });
});
