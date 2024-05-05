export class AudioController {
  private audioContext: AudioContext;
  private tracks: { sourceNode: AudioBufferSourceNode; gainNode: GainNode }[] =
    [];

  constructor() {
    this.audioContext = new AudioContext();
  }

  async initAudio(fileNames: string[]): Promise<void> {
    console.log("Loading audio files...")
    if (fileNames.length !== 16) {
      throw new Error("Expected 16 audio files.");
    }

    const filePromises = fileNames.map((fileName) =>
      this.loadAudioFile(fileName)
    );

    const audioBuffers = await Promise.all(filePromises);

    audioBuffers.forEach((buffer) => {
      const sourceNode = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      sourceNode.buffer = buffer;
      gainNode.gain.value = 0; // Start muted

      sourceNode.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      this.tracks.push({ sourceNode, gainNode });
    
      sourceNode.loop = true;
      sourceNode.start(0); // Play immediately in sync
    });
  }

  private async loadAudioFile(url: string): Promise<AudioBuffer> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return this.audioContext.decodeAudioData(arrayBuffer);
  }

  unMuteTrack(trackNumber: number): void {
    console.log("unMuteTrack", trackNumber)
    if (trackNumber == -1) {
      return;
    }
    if (this.tracks[trackNumber]) {
      this.tracks[trackNumber].gainNode.gain.value = 1; // Set gain to 1 to unmute
    } else {
      throw new Error(`Track ${trackNumber} does not exist.`);
    }
  }

  muteTrack(trackNumber: number): void {
    console.log("muteTrack", trackNumber);
    if (trackNumber == -1) {
        return;
    }
    if (this.tracks[trackNumber]) {
      this.tracks[trackNumber].gainNode.gain.value = 0; // Set gain to 0 to mute
    } else {
      throw new Error(`Track ${trackNumber} does not exist.`);
    }
  }

  muteAll(): void {
    for (let i = 0; i < this.tracks.length; i++) {
      this.muteTrack(i);
    }
  }
}
