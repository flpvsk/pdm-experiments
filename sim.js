window.onTimeStepState = {
  err: 0.5,
  prevStep: 0,
  div: 1e8,     // defines length of a PDM pulse
  f: (ramp) => 0.5,
  period: 1e6,  // defines period of the result output wave
}

window.onTimeStep = function onTimeStep() {
  const t = this.getTime();
  const state = window.onTimeStepState;
  const { div, period, } = state;

  const timeStep = Math.floor(t * div);

  if (state.prevStep === timeStep) {
    return;
  }

  state.prevStep = timeStep;

  // console.log(t);
  const ramp = (timeStep % period) / period;
  // console.log(timeStep, ramp)
  const tri = 2. * ((ramp > 0.5) * (1. - ramp) + (ramp <= 0.5) * ramp);
  const s = 0.5 + 0.5 * Math.sin(ramp * 2. * Math.PI);
  const randPeriod = 4.;
  const rand = (
    Math.floor(
      ramp * (2 ** randPeriod)) ^
      Math.floor((ramp ** 2) * (2 ** randPeriod))
    ).toString(2).replaceAll('0', '').length / randPeriod;

  const val = Math.min(Math.max(0., state.f(ramp)), 1.);
  // this.setExtVoltage("ext", tri);
  let { err } = state;
  let res = 1.;
  err += val;

  if (err <= 0.5) {
    res = 0.;
  }

  const maxVoltage = 5;
  this.setExtVoltage(
    "ext",
    maxVoltage *
    res
  );
  state.err = err - res;
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

