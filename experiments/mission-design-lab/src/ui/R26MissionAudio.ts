export type R26MissionCue = 'choice' | 'launch' | 'success' | 'failure' | 'invalid';

// Original sine tones. Each tuple is [frequency Hz, start seconds, duration seconds].
const notes: Record<R26MissionCue, readonly (readonly [number, number, number])[]> = {
  choice: [[620, 0, .075]],
  launch: [[330, 0, .12], [440, .09, .14]],
  success: [[523.25, 0, .13], [659.25, .10, .13], [783.99, .20, .16]],
  failure: [[330, 0, .14], [261.63, .12, .16]],
  invalid: [[220, 0, .065], [220, .10, .065]],
};

export function r26CueSamples(cue: R26MissionCue, sampleRate: number) {
  const tones = notes[cue];
  const duration = Math.max(...tones.map(([, start, length]) => start + length));
  const samples = new Float32Array(Math.ceil((duration + .01) * sampleRate));
  for (const [frequency, start, length] of tones) {
    const offset = Math.round(start * sampleRate);
    for (let i = 0; i < Math.ceil(length * sampleRate); i++) {
      const time = i / sampleRate;
      const envelope = Math.sin(Math.min(1, time / .008) * Math.PI / 2) * (1 - time / length) ** 2;
      samples[offset + i]! += .045 * envelope * Math.sin(2 * Math.PI * frequency * time);
    }
  }
  return samples;
}

interface Voice { source: AudioBufferSourceNode; gain: GainNode }

export function createR26MissionAudio() {
  let context: AudioContext | null = null;
  let enabled = false;
  let disposed = false;
  let revision = 0;
  let lastCue: R26MissionCue | null = null;
  let lastStart = -Infinity;
  const buffers = new Map<R26MissionCue, AudioBuffer>();
  const voices = new Set<Voice>();

  function release(voice: Voice) {
    voice.source.onended = null;
    voice.source.disconnect();
    voice.gain.disconnect();
    voices.delete(voice);
  }

  function silence() {
    for (const voice of voices) {
      voice.gain.gain.cancelScheduledValues(0);
      voice.gain.gain.value = 0;
      voice.source.stop();
      release(voice);
    }
  }

  function mute() {
    enabled = false;
    revision++;
    silence();
    const previous = context;
    context = null;
    buffers.clear();
    lastCue = null;
    lastStart = -Infinity;
    if (previous && previous.state !== 'closed') void previous.close().catch(() => {});
  }

  async function enable() {
    if (disposed) return false;
    if (enabled && context?.state === 'running') return true;
    mute();
    const request = revision;
    const Audio = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Audio) return false;
    try {
      const candidate = new Audio({ latencyHint: 'interactive' });
      context = candidate;
      await candidate.resume();
      if (disposed || request !== revision) return false;
      enabled = candidate.state === 'running';
      if (!enabled) mute();
      return enabled;
    } catch {
      if (request === revision) mute();
      return false;
    }
  }

  function play(cue: R26MissionCue) {
    if (!enabled || !context || context.state !== 'running' || document.hidden) return false;
    const now = context.currentTime;
    if (cue === lastCue && now - lastStart < .06) return false;
    // Keep at most one fading cue and the new cue, including rapid alternating inputs.
    while (voices.size > 1) {
      const oldest = voices.values().next().value!;
      oldest.source.stop();
      release(oldest);
    }
    for (const voice of voices) {
      voice.gain.gain.setValueAtTime(1, now);
      voice.gain.gain.linearRampToValueAtTime(0, now + .008);
      voice.source.stop(now + .01);
    }
    let buffer = buffers.get(cue);
    if (!buffer) {
      const samples = r26CueSamples(cue, context.sampleRate);
      buffer = context.createBuffer(1, samples.length, context.sampleRate);
      buffer.copyToChannel(samples, 0);
      buffers.set(cue, buffer);
    }
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    source.connect(gain);
    gain.connect(context.destination);
    const voice = { source, gain };
    voices.add(voice);
    source.onended = () => release(voice);
    source.start();
    lastCue = cue;
    lastStart = now;
    return true;
  }

  const onVisibility = () => { if (document.hidden) silence(); };
  document.addEventListener('visibilitychange', onVisibility);
  return {
    enable, mute, play,
    dispose() {
      disposed = true;
      document.removeEventListener('visibilitychange', onVisibility);
      mute();
    },
  };
}
