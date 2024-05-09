export declare class AudioController {
    private audioContext;
    private tracks;
    private slowAverage;
    private fx1a;
    private fx1b;
    loadedFiles: number;
    constructor();
    initAudio(fileNames: string[]): Promise<void>;
    private loadAudioFile;
    getFrequencyColor(track: number): string;
    updateSlowAverage(value: number): void;
    enableTrack(trackNumber: number, enable: boolean): void;
    muteAll(): void;
    fx1(x: number, y: number): void;
}
