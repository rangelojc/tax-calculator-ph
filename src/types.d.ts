interface IMandatoryContributions {
  philHealth: number;
  pagibig: number;
  sss: number;
  gsis: number;
}

interface ITaxable {
  gross: number;
  taxable: number;
  nonTaxable: number;
  totalContribution: number;
}

interface IBracket {
  condition: (taxableIncome: number) => bool;
  calculate: (taxableIncome: number) => number;
}

interface ITaxSummary extends ITaxable {
  taxDue: number;
  takeHome: number;
}

type IEmployerType = "govt" | "pvt";
