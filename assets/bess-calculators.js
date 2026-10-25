"use strict";
(() => {
  const format = (value, unit) => value.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }) + " " + unit;
  function read(form, field, min, max) {
    const input = form.elements.namedItem(field);
    const value = Number(input.value);
    if (!input.value.trim() || !Number.isFinite(value) || value < min || value > max) {
      throw new Error("Enter a finite " + field + " value from " + min + " to " + max + ".");
    }
    return value;
  }
  function calculate(form, kind) {
    const dod = read(form, "dod", 1, 100) / 100;
    const efficiency = read(form, "efficiency", 1, 100) / 100;
    const power = read(form, "power", 0.01, 100000);
    if (kind === "sizing") {
      const target = read(form, "acEnergy", 0.01, 100000);
      return {
        headline: format(target / (dod * efficiency), "MWh DC"),
        detail: "Minimum nominal DC energy under these assumptions. Target duration: " + format(target / power, "hours") + " at " + format(power, "MW") + " AC."
      };
    }
    const dc = read(form, "dcEnergy", 0.01, 100000);
    const deliverable = dc * dod * efficiency;
    return {
      headline: format(deliverable, "MWh AC"),
      detail: "Idealized constant-power runtime: " + format(deliverable / power, "hours") + " at " + format(power, "MW") + " AC."
    };
  }
  function connect(kind) {
    const form = document.getElementById(kind + "-form");
    const output = document.getElementById(kind + "-result");
    if (!form || !output) return;
    form.addEventListener("submit", event => {
      event.preventDefault();
      output.replaceChildren();
      try {
        const value = calculate(form, kind);
        const strong = document.createElement("strong");
        strong.textContent = value.headline;
        const detail = document.createElement("span");
        detail.textContent = value.detail;
        output.append(strong, detail);
        output.dataset.invalid = "false";
      } catch (error) {
        output.textContent = error.message;
        output.dataset.invalid = "true";
      }
    });
  }
  connect("sizing");
  connect("runtime");
})();