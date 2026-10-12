// Speech Synthesis utility using Web Speech API

class SpeechManager {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState: boolean = false;
  private onStateChangeCallbacks: Array<(speaking: boolean) => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public subscribe(cb: (speaking: boolean) => void) {
    this.onStateChangeCallbacks.push(cb);
    return () => {
      this.onStateChangeCallbacks = this.onStateChangeCallbacks.filter(c => c !== cb);
    };
  }

  private notify(speaking: boolean) {
    this.isSpeakingState = speaking;
    this.onStateChangeCallbacks.forEach(cb => cb(speaking));
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices().filter(v => v.lang.startsWith('es') || v.lang.startsWith('en'));
  }

  public speak(text: string, rate: number = 1.0, onEnd?: () => void) {
    if (!this.synth) return;
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Pick Spanish voice if available
    const voices = this.synth.getVoices();
    const esVoice = voices.find(v => v.lang.startsWith('es-') || v.lang === 'es');
    if (esVoice) {
      utterance.voice = esVoice;
      utterance.lang = esVoice.lang;
    } else {
      utterance.lang = 'es-ES';
    }

    utterance.onstart = () => {
      this.notify(true);
    };

    utterance.onend = () => {
      this.notify(false);
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.notify(false);
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public stop() {
    if (!this.synth) return;
    this.synth.cancel();
    this.notify(false);
    this.currentUtterance = null;
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }
}

export const speechManager = new SpeechManager();
