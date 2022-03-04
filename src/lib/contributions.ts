const computeSss = (salary: number) => {
  const matrix = [
    [1000, 3249.99, 135, 0],
    [3250, 3749.99, 157.5, 0],
    [3750, 4249.99, 180, 0],
    [4250, 4749.99, 202.5, 0],
    [4750, 5249.99, 225, 0],
    [5250, 5749.99, 247.5, 0],
    [5750, 6249.99, 270, 0],
    [6250, 6749.99, 292.5, 0],
    [6750, 7249.99, 315, 0],
    [7250, 7749.99, 337.5, 0],
    [7750, 8249.99, 360, 0],
    [8250, 8749.99, 382.5, 0],
    [8750, 9249.99, 405, 0],
    [9250, 9749.99, 427.5, 0],
    [9750, 10249.99, 450, 0],
    [10250, 10749.99, 472.5, 0],
    [10750, 11249.99, 495, 0],
    [11250, 11749.99, 517.5, 0],
    [11750, 12249.99, 540, 0],
    [12250, 12749.99, 562.5, 0],
    [12750, 13249.99, 585, 0],
    [13250, 13749.99, 607.5, 0],
    [13750, 14249.99, 630, 0],
    [14250, 14749.99, 652.5, 0],
    [14750, 15249.99, 675, 0],
    [15250, 15749.99, 697.5, 0],
    [15750, 16249.99, 720, 0],
    [16250, 16749.99, 742.5, 0],
    [16750, 17249.99, 765, 0],
    [17250, 17749.99, 787.5, 0],
    [17750, 18249.99, 810, 0],
    [18250, 18749.99, 832.5, 0],
    [18750, 19249.99, 855, 0],
    [19250, 19749.99, 877.5, 0],
    [19750, 20249.99, 900, 0],
    [20250, 20749.99, 900, 22.5],
    [20750, 21249.99, 900, 45],
    [21250, 21749.99, 900, 67.5],
    [21750, 22249.99, 990, 90],
    [22250, 22749.99, 900, 112.5],
    [22270, 23249.99, 900, 135],
    [23250, 23749.99, 900, 157.5],
    [23750, 24249.99, 900, 180],
    [24250, 24279.99, 900, 202.5],
    [24750, NaN, 900, 225],
  ];

  const bracket = (lower: number, upper: number) => (income: number) =>
    (Number.isNaN(lower) || income >= lower) &&
    (Number.isNaN(upper) || income <= upper);

  const sss = matrix
    .filter((q) => bracket(q[0], q[1])(salary))
    .reduce((p, q) => (p += q[2]), 0);
  const mpf = matrix
    .filter((q) => bracket(q[0], q[1])(salary))
    .reduce((p, q) => (p += q[3]), 0);
  return { sss, mpf }
};

const computePhilHealth = (monthly: number) => {
  const contrib = monthly * 0.03 * 0.5;
  return contrib >= 1800 ? 1800 : contrib;
};

export const computeContributions = (
  employeeType: IEmployerType,
  monthly: number
): IMandatoryContributions => ({
  sss: employeeType === "pvt" ? computeSss(monthly).sss : NaN,
  sssMpf: employeeType === "pvt" ? computeSss(monthly).mpf : NaN,
  gsis: employeeType === "govt" ? monthly * 0.09 : NaN,
  pagibig: 100,
  philHealth: computePhilHealth(monthly),
});
