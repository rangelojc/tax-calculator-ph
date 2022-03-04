export const computeAnnual = (monthlySalary: number) => monthlySalary * 12;
export const computeTaxableIncome = (annualSalary: number, contributions: IMandatoryContributions, benefits: number): ITaxable => {
    let gross = annualSalary + benefits
    let totalContribution = Object.keys(contributions)
        .map(q => q as keyof typeof contributions)
        .filter(q => !isNaN(contributions[q]))
        .reduce((total, key) => total += contributions[key], 0) * 12
    let nonTaxable = totalContribution

    if (benefits > 90000) {
        nonTaxable += 90000
    }
    return {
        gross,
        nonTaxable,
        totalContribution,
        taxable: gross - nonTaxable
    }
}

const bracketCondition =
    (lower: number, upper: number) =>
        (income: number) =>
            (Number.isNaN(lower) || income > lower) && (Number.isNaN(upper) || income <= upper)



const brackets: { [key: string]: IBracket[] } = {
    2018: [
        {
            condition: bracketCondition(NaN, 250000),
            calculate: (_) => 0
        },
        {
            condition: bracketCondition(250000, 400000),
            calculate: (q) => 0 + ((q - 250000) * .20)
        },
        {
            condition: bracketCondition(400000, 800000),
            calculate: (q) => 30000 + ((q - 400000) * .25)
        },
        {
            condition: bracketCondition(800000, 2000000),
            calculate: (q) => 130000 + ((q - 800000) * .30)
        },
        {
            condition: bracketCondition(2000000, 8000000),
            calculate: (q) => 490000 + ((q - 2000000) * .32)
        },
        {
            condition: bracketCondition(8000000, NaN),
            calculate: (q) => 2410000 + ((q - 8000000) * .35)
        }
    ],
    2023: [
        {
            condition: bracketCondition(NaN, 250000),
            calculate: (_) => 0
        },
        {
            condition: bracketCondition(250000, 400000),
            calculate: (q) => 0 + ((q - 250000) * .15)
        },
        {
            condition: bracketCondition(400000, 800000),
            calculate: (q) => 22500 + ((q - 400000) * .20)
        },
        {
            condition: bracketCondition(800000, 2000000),
            calculate: (q) => 102500 + ((q - 800000) * .25)
        },
        {
            condition: bracketCondition(2000000, 8000000),
            calculate: (q) => 402500 + ((q - 2000000) * .30)
        },
        {
            condition: bracketCondition(8000000, NaN),
            calculate: (q) => 2202500 + ((q - 8000000) * .35)
        }
    ]
}

export const computeTaxDue = (taxableIncome: number, period: '2018' | '2023' = '2018') =>
    brackets[period].filter(q => q.condition(taxableIncome)).reduce((total, bracket) => total += bracket.calculate(taxableIncome), 0)
