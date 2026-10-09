import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// Loudness is the RMS of the waveform, where 1 is full scale.
const MIN_THRESHOLD = 0.12; // quietest sound that counts as a blow
const FULL_BLOW = 0.4; // loudness treated as the strongest possible blow
const HOLD = 0.12; // seconds the noise must last, so claps and clicks don't count

const GESTURES = ['pointerdown', 'keydown', 'touchend'];

/**
 * Listens to the microphone while `active` and reports blowing ("pooof") into it.
 * Audio is analysed locally and never recorded or sent anywhere.
 *
 * handlers.onLevel(level)        – every frame, 0..1 loudness above the room's noise
 * handlers.onBlow(strength, dt)  – every frame of a sustained blow, strength 0.25..1
 *
 * Returns the status: idle | requesting | suspended | listening | denied | unavailable.
 */
export function useBlowDetector(active, handlers) {
  const [status, setStatus] = useState('idle');
  const handlersRef = useRef(handlers);

  useLayoutEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    if (!active) {
      setStatus('idle');
      return undefined;
    }
    // Safari before 14.1 only has the prefixed constructor.
    const AudioCtx = window.AudioContext || /** @type {any} */ (window).webkitAudioContext;
    if (!navigator.mediaDevices?.getUserMedia || !AudioCtx) {
      setStatus('unavailable');
      return undefined;
    }

    let cancelled = false;
    let stream = null;
    let ctx = null;
    let raf = 0;
    // Browsers keep audio paused until the visitor interacts with the page once.
    const resume = () => ctx?.resume().catch(() => {});

    setStatus('requesting');
    navigator.mediaDevices
      // Noise suppression would filter out exactly the sound we're listening for.
      .getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } })
      .then((media) => {
        if (cancelled) {
          media.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = media;
        ctx = new AudioCtx();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        ctx.createMediaStreamSource(stream).connect(analyser);
        const samples = new Uint8Array(analyser.fftSize);

        const sync = () => setStatus(ctx.state === 'running' ? 'listening' : 'suspended');
        ctx.onstatechange = sync;
        sync();
        if (ctx.state !== 'running') {
          resume();
          GESTURES.forEach((type) => document.addEventListener(type, resume, { passive: true }));
        }

        let floor = 0.02; // the room's background noise, tracked as we go
        let loud = 0;
        let last = performance.now();
        const tick = (now) => {
          raf = requestAnimationFrame(tick);
          const dt = Math.min(0.1, (now - last) / 1000);
          last = now;

          analyser.getByteTimeDomainData(samples);
          let sum = 0;
          for (let i = 0; i < samples.length; i++) {
            const x = (samples[i] - 128) / 128;
            sum += x * x;
          }
          const rms = Math.sqrt(sum / samples.length);

          // Drop to quieter readings at once, rise only slowly, so a blow doesn't raise the floor.
          floor = rms < floor ? rms : floor + (rms - floor) * 0.002;
          const threshold = Math.max(MIN_THRESHOLD, floor * 5);
          handlersRef.current.onLevel?.(Math.min(1, Math.max(0, (rms - floor) / (FULL_BLOW - floor))));

          loud = rms > threshold ? loud + dt : 0;
          if (loud >= HOLD) {
            const strength = Math.min(1, Math.max(0.25, (rms - threshold) / (FULL_BLOW - threshold)));
            handlersRef.current.onBlow?.(strength, dt);
          }
        };
        raf = requestAnimationFrame(tick);
      })
      .catch((error) => {
        if (cancelled) return;
        setStatus(error?.name === 'NotAllowedError' || error?.name === 'SecurityError' ? 'denied' : 'unavailable');
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      GESTURES.forEach((type) => document.removeEventListener(type, resume));
      stream?.getTracks().forEach((track) => track.stop());
      ctx?.close().catch(() => {});
      handlersRef.current.onLevel?.(0);
    };
  }, [active]);

  return status;
}
