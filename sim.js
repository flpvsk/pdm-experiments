window.onTimeStepState = {
  err: 0.5,
}
window.onTimeStep = function onTimeStep() {
  const t = this.getTime();
  // console.log(t);
  const ramp = (t % 0.01) * 100;
  const tri = 2. * ((ramp > 0.5) * (1. - ramp) + (ramp <= 0.5) * ramp);
  const s = 0.5 + 0.5 * Math.sin(ramp * 2. * Math.PI);
  const fn = s;
  // this.setExtVoltage("ext", tri);
  let { err } = window.onTimeStepState;
  let res = 1.;
  err += fn;

  if (err <= 0.5) {
    res = 0.;
  }

  this.setExtVoltage("ext", 5 * res);
  window.onTimeStepState.err = err - res;
}

function run() {
  const sim = CircuitJS1;

  return {
    stop: () => {
      sim.ontimestep = undefined;
    },
    start: () => {
      sim.ontimestep = function() {
        window.onTimeStep.apply(sim, arguments)
      }
    }
  }
}

const { start, stop } = run();

