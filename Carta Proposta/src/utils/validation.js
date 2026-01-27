
const REQUIRED_COMMON = ['candidateName', 'roleTitle', 'startDate', 'locationUnit', 'recruiterName'];

export const validateStep1 = (data) => {
    const errors = {};
    REQUIRED_COMMON.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            errors[field] = 'Este campo é obrigatório';
        }
    });

    if (data.jobType === 'Store') {
        if (!data.storeSchedule || data.storeSchedule.trim() === '') {
            errors.storeSchedule = 'Horário é obrigatório';
        }
        // Area/Manager/BusinessUnit skipped for Store
    } else {
        // Corporate Mandatory Fields
        if (!data.area) errors.area = 'Selecione a área';
        if (!data.manager) errors.manager = 'Informe o gestor';
        // Business Unit is handled in component but good to add here if possible, 
        // but let's stick to what was there or move it here. 
        // StepCommon does manual BU check. We can leave it there or move it.
    }

    // AI Case validation (Optional for Store)
    if (data.jobType !== 'Store') {
        if (!data.aiCase || data.aiCase.trim() === '') {
            errors.aiCase = 'Este campo é obrigatório';
        }
    }

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
        //if (!data.billingCycle) errors.billingCycle = 'Ciclo de faturamento obrigatório';
        if (!data.pjDescription || data.pjDescription.trim() === '') {
            errors.pjDescription = 'Descrição das funções é obrigatória para PJ';
        }
    }

    if (data.modalidade === 'Estágio') {
        if (!data.bolsa) errors.bolsa = 'Valor da bolsa obrigatório';
    }

    if (data.hasVariableRemuneration) {
        if ((!data.variableValue || data.variableValue.trim() === '') &&
            (!data.annualBonusValue || data.annualBonusValue.trim() === '')) {
            errors.variableValue = 'Informe a remuneração variável ou o bônus anual';
        }
    }

    return errors;
};

export const validateStep3 = (data) => {
    const errors = {};

    if (data.cargoEspecifico && (!data.referenceCkLink || data.referenceCkLink.trim() === '')) {
        errors.referenceCkLink = 'Cargo específico exige link de Reference Check';
    }

    if (!data.bgcJuridico) {
        errors.bgcJuridico = 'Confirmação do BGC com jurídico é obrigatória';
    }

    return errors;
};
