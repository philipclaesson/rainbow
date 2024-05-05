export declare class AudioController {
    private audioContext;
    private tracks;
    private slowAverage;
    constructor();
    initAudio(fileNames: string[]): Promise<void>;
    private loadAudioFile;
    getNoiseColor(track: number): string;
    getFrequencyColor(track: number): string;
    updateSlowAverage(value: number): void;
    unMuteTrack(trackNumber: number): void;
    muteTrack(trackNumber: number): void;
    muteAll(): void;
}
