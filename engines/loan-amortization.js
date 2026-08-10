/**
 * Deterministic Loan Amortization Engine — fixed-rate monthly payments.
 * Schedule settles the final balance to zero with an adjusted last payment.
 */

function validate(principal, annualRate, months) {
  const p = Number(principal);
  const r = Number(annualRate);
  const n = Number(months);
  if (!(p > 0 && r >= 0 && n >= 1 && Number.isInteger(n))) {
    throw new Error('Invalid loan inputs: principal > 0, rate >= 0, months integer >= 1');
  }
  return { p, r, n };
}

function monthlyPayment(principal, annualRate, months) {
  const { p, r, n } = validate(principal, annualRate, months);
  if (r === 0) {
    return Math.round(p / n);
  }
  const mr = r / 12;
  return Math.round((p * mr) / (1 - Math.pow(1 + mr, -n)));
}

function amortizationSchedule(principal, annualRate, months) {
  const { p, r, n } = validate(principal, annualRate, months);
  const payment = monthlyPayment(p, r, n);
  const mr = r / 12;
  const schedule = [];
  let balance = p;
  let totalInterest = 0;
  for (let m = 1; m <= n; m++) {
    const interest = Math.round(balance * mr);
    const isLast = m === n;
    const pay = isLast ? balance + interest : payment;
    const principalPart = pay - interest;
    balance -= principalPart;
    schedule.push({ month: m, payment: pay, interest, principal: principalPart, balance });
    totalInterest += interest;
  }
  return {
    payment,
    schedule,
    totalInterest
  };
}

module.exports = {
  monthlyPayment,
  amortizationSchedule
};