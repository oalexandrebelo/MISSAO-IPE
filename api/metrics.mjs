import runtime from '../server/metrics/runtime.mjs';

export default function metrics(req, res) {
  return runtime(req, res);
}
