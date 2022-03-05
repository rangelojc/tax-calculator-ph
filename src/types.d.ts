interface IMandatoryContributions {
  philHealth: number;
  pagibig: number;
  sss: number;
  sssMpf: number;
  gsis: number;
}

type IEmployerType = "govt" | "pvt";

interface ITaxable {
  gross: number;
  taxable: number;
  nonTaxable: number;
  totalContribution: number;
  deminimis: number;
}

interface IBracket {
  condition: (taxableIncome: number) => bool;
  calculate: (taxableIncome: number) => number;
}

interface ITaxSummary extends ITaxable {
  taxDue: number;
  takeHome: number;
  period: ISummaryPeriod;
}

interface IIncomeForm {
  monthly: string;
  deminimis: string;
  employerType: IEmployerType;
}

type ISummaryPeriod = "Annual" | "Monthly" | "Biweekly";
