export declare class AudioController {
    private audioContext;
    private tracks;
    constructor();
    initAudio(fileNames: string[]): Promise<void>;
    private loadAudioFile;
    getNoiseColor(track: number): string;
    getFrequencyColor(track: number): string;
    unMuteTrack(trackNumber: number): void;
    muteTrack(trackNumber: number): void;
    muteAll(): void;
}
