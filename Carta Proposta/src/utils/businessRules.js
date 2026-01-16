
export const VR_RULES = {
    // Logic: 
    // IF Location in {Extrema, Itapeva, Itapevi}:
    //    IF WorkplaceType == 'Fábrica' -> Composite (200 + 200)
    //    IF WorkplaceType == 'Escritório' -> Fixed 400
    // IF Location in {SP, Fortaleza}:
    //    -> Select options (CX 17, AZBUY 28, GRA 25, ESCRITORIO CE 25, ESCRITORIO SP 40)

    FACTORY_LOCATIONS: ['Extrema', 'Itapeva', 'Itapevi'],
    OFFICE_only_OPTIONS: [
        { value: 'CX - R$ 17,00', label: 'CX - R$ 17,00' },
        { value: 'AZBUY - R$ 28,00', label: 'AZBUY - R$ 28,00' },
        { value: 'GRA - SHIMECKS - R$ 25,00', label: 'GRA - SHIMECKS - R$ 25,00' },
        { value: 'ESCRITORIO CE - R$ 25,00', label: 'ESCRITORIO CE - R$ 25,00' },
        { value: 'ESCRITORIO SP - R$ 40,00', label: 'ESCRITORIO SP - R$ 40,00' },
    ],

    FACTORY_COMPOSITE: {
        base: 200,
        assiduidade: 200,
        total: 400
    },

    OFFICE_FIXED_VALUE: 400,

    ESTAGIO_FIXED: 200
};

export const calculateVR = (location, modalidade, workplaceType) => {
    if (modalidade === 'PJ') return null;
    if (modalidade === 'Estágio') return { value: VR_RULES.ESTAGIO_FIXED, type: 'fixed', label: 'Estágio' };

    // CLT Logic
    const isFactoryLoc = VR_RULES.FACTORY_LOCATIONS.includes(location);

    if (isFactoryLoc) {
        if (workplaceType === 'Fábrica') {
            return {
                value: VR_RULES.FACTORY_COMPOSITE.total,
                details: VR_RULES.FACTORY_COMPOSITE,
                type: 'composite',
                label: `${location} - Fábrica`
            };
        }
        if (workplaceType === 'Escritório') {
            return {
                value: VR_RULES.OFFICE_FIXED_VALUE,
                type: 'fixed',
                label: `${location} - Escritório`
            };
        }
        return null; // Waiting for workplace selection
    }

    if (['São Paulo', 'Fortaleza'].includes(location)) {
        return {
            options: VR_RULES.OFFICE_only_OPTIONS,
            type: 'select',
            label: 'Selecione o benefício'
        };
    }

    return { value: 0, type: 'manual', label: 'Outro' };
};
