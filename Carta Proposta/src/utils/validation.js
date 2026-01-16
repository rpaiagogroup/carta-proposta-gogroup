
const REQUIRED_COMMON = ['candidateName', 'roleTitle', 'area', 'manager', 'startDate', 'locationUnit', 'recruiterName', 'aiCase'];

export const validateStep1 = (data) => {
    const errors = {};
    REQUIRED_COMMON.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            errors[field] = 'Este campo é obrigatório';
        }
    });

    if (data.aiCase) {
        // Simple check: must have at least a dot and 3 chars, or http, or www
        const isValid = data.aiCase.includes('http') || data.aiCase.includes('www.') || data.aiCase.includes('.com');
        if (!isValid) {
            errors.aiCase = 'Insira um link válido (Ex: www.exemplo.com.br)';
        }
    }

    return errors;
};

export const validateStep2 = (data) => {
    const errors = {};
    if (!data.modalidade) {
        errors.modalidade = 'Selecione a modalidade';
        return errors;
    }

    if (data.modalidade === 'CLT') {
        if (!data.salary) {
            errors.salary = 'Salário obrigatório';
        } else {
            // Validation for min salary 1.621,00
            // Salary format is likely "R$ 1.621,00"
            const numericSalary = typeof data.salary === 'number' ? data.salary :
                parseFloat(data.salary.replace(/[^\d,]/g, '').replace(',', '.')) || 0;

            if (numericSalary < 1621) {
                errors.salary = 'O salário não pode ser inferior a R$ 1.621,00';
            }
        }
        // If VR is select type, check if value is chosen?
        // Usually logic handles setting default, but if user must choose:
        // We assume businessRules handles defaults or options. Logic in component ensures one is picked.
    }

    if (data.modalidade === 'PJ') {
        if (!data.contractValue) errors.contractValue = 'Valor do contrato obrigatório';
        if (!data.billingCycle) errors.billingCycle = 'Ciclo de faturamento obrigatório';
        if (!data.pjDescription || data.pjDescription.trim() === '') {
            errors.pjDescription = 'Descrição das funções é obrigatória para PJ';
        }
    }

    if (data.modalidade === 'Estágio') {
        if (!data.bolsa) errors.bolsa = 'Valor da bolsa obrigatório';
    }

    return errors;
};

export const validateStep3 = (data) => {
    const errors = {};
    if (data.cargoEspecifico && (!data.referenceCkLink || data.referenceCkLink.trim() === '')) {
        errors.referenceCkLink = 'Cargo específico exige link de Reference Check';
    }
    return errors;
};
