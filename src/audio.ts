export class AudioController {
  private audioContext: AudioContext;
  private tracks: {
    sourceNode: AudioBufferSourceNode;
    gainNode: GainNode;
    analyserNode: AnalyserNode;
  }[] = [];
  private slowAverage: number = 39; // orange
  private fx1a: BiquadFilterNode | null = null;
  private fx1b: DelayNode | null = null;
  public loadedFiles: number = 0;

  constructor() {
    this.audioContext = new AudioContext();
  }

  async initAudio(fileNames: string[]): Promise<void> {
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

      // set up an analyser so we can do cool visuals
      const analyserNode = this.audioContext.createAnalyser();
      analyserNode.fftSize = 2048;
      gainNode.connect(analyserNode);

      // set up fx nodes
      this.fx1a = this.audioContext.createBiquadFilter();
      this.fx1a.type = "highpass";
      this.fx1a.frequency.value = 1000;
      this.fx1a.gain.value = 0;
      gainNode.connect(this.fx1a);

      this.fx1b = this.audioContext.createDelay();
      this.fx1b.delayTime.value = 0; // pass through
      this.fx1a.connect(this.fx1b);

      // for now just bypass the FX nodes - not implemented properly yet
      //   this.fx1b.connect(this.audioContext.destination);
      gainNode.connect(this.audioContext.destination);

      this.tracks.push({ sourceNode, gainNode, analyserNode });

      sourceNode.loop = true;
      sourceNode.start(0); // Play immediately in sync
    });
  }

  private async loadAudioFile(url: string): Promise<AudioBuffer> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    this.loadedFiles++;
    console.log(`Loaded ${this.loadedFiles} files.`)
    return this.audioContext.decodeAudioData(arrayBuffer);
  }

  getFrequencyColor(track: number): string {
    const gainNode = this.tracks[track].gainNode;
    if (gainNode.gain.value === 0) {
      return `hsl(${this.slowAverage + track}, 100%, 50%)`;
    }
    const analyserNode = this.tracks[track].analyserNode;
    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteFrequencyData(dataArray);

    // get the highest frequency
    const max = Math.max(...dataArray);
    const maxIndex = dataArray.indexOf(max);
    this.updateSlowAverage(maxIndex);

    const hue = this.slowAverage + track + ((maxIndex * 10) % 240);
    return `hsl(${hue}, 100%, 50%)`;
  }

  updateSlowAverage(value: number) {
    this.slowAverage = this.slowAverage + ((value * 0.001) % 240);
  }

  enableTrack(trackNumber: number, enable: boolean): void {
    if (trackNumber == -1) {
      return;
    }
    if (trackNumber >= this.tracks.length) {
      throw new Error(`Track ${trackNumber} does not exist.`);
    }
    this.tracks[trackNumber].gainNode.gain.value = enable ? 0.5 : 0;
  }

  muteAll(): void {
    for (let i = 0; i < this.tracks.length; i++) {
      this.enableTrack(i, false);
    }
  }

  fx1(x: number, y: number) {
    if (x != 0 && y != 0) {
      if (Math.random() > 0.1) {
        return;
      }
    }
    if (!this.fx1a || !this.fx1b) {
      return;
    }
    console.log("fx1 called with x:", x, "y:", y);
    console.log("AudioContext state:", this.audioContext.state);
    console.log("Current time:", this.audioContext.currentTime);

    console.log("Applying gain:", x * 25, "to fx1a");
    const gain = Math.floor(x * 10);
    this.fx1a.gain.setValueAtTime(gain, this.audioContext.currentTime);
    this.fx1b.delayTime.setValueAtTime(y, this.audioContext.currentTime);

    console.log(this.fx1a, this.fx1b);
  }
}
