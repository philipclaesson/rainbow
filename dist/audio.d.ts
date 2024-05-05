export declare class AudioController {
    private audioContext;
    private tracks;
    constructor();
    initAudio(fileNames: string[]): Promise<void>;
    private loadAudioFile;
    unMuteTrack(trackNumber: number): void;
    muteTrack(trackNumber: number): void;
    muteAll(): void;
}
