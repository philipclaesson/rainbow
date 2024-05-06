export declare class AudioController {
    private audioContext;
    private tracks;
    private slowAverage;
    private fx1a;
    private fx1b;
    constructor();
    initAudio(fileNames: string[]): Promise<void>;
    private loadAudioFile;
    getFrequencyColor(track: number): string;
    updateSlowAverage(value: number): void;
    unMuteTrack(trackNumber: number): void;
    muteTrack(trackNumber: number): void;
    muteAll(): void;
    fx1(x: number, y: number): void;
}
