import React, { useState } from 'react';
import { useForm } from '../../context/FormContext';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { validateStep1 } from '../../utils/validation';
import { ArrowRight } from 'lucide-react';

const AREAS = [
    "Growth", "Marketing", "Logística", "Financeiro", "Fiscal", "Contábil",
    "FP&A", "M&A", "CX", "B2B", "Tecnologia", "Dados", "RPA",
    "Gente e Gestão", "Compliance", "Operações", "Projetos e Integrações",
    "CSC", "Supply", "Produto", "Ilustração", "E-commerce", "Offline", "Qualidade"
].sort();

const RECRUITERS = [
    "Ester", "Glaucio", "Jaiane", "Jhenyfer", "Karol", "Nicole", "Nislane", "Sabrina", "Thais Julia"
];

const StepCommon = () => {
    const { state, updateField, setStep } = useForm();
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateField(name, value);
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }

        // Reset workplace type if location changes to one that doesn't need it
        if (name === 'locationUnit') {
            const factoryLocs = ['Extrema', 'Itapeva', 'Itapevi'];
            if (!factoryLocs.includes(value)) {
                updateField('workplaceType', '');
            }
        }
    };

    const handleNext = () => {
        const validationErrors = validateStep1(state);

        // Custom validation for Workplace Type
        const factoryLocs = ['Extrema', 'Itapeva', 'Itapevi'];
        if (factoryLocs.includes(state.locationUnit) && !state.workplaceType) {
            validationErrors.workplaceType = 'Selecione o tipo de local de trabalho';
        }

        if (!state.businessUnit) validationErrors.businessUnit = 'Selecione a unidade de negócio';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setStep(2);
    };

    const showWorkplaceType = ['Extrema', 'Itapeva', 'Itapevi'].includes(state.locationUnit);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-semibold text-slate-900">Informações do Candidato e Vaga</h2>
                <p className="text-slate-500 text-sm mt-1">Preencha os dados básicos para iniciar a proposta.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Nome do Candidato"
                    name="candidateName"
                    value={state.candidateName}
                    onChange={handleChange}
                    error={errors.candidateName}
                    placeholder="Ex: João Silva"
                />

                <Select
                    label="Unidade de Negócio"
                    name="businessUnit"
                    value={state.businessUnit}
                    onChange={handleChange}
                    error={errors.businessUnit}
                    options={[
                        { value: 'Gocase', label: 'Gocase' },
                        { value: 'Gobeaute', label: 'Gobeaute' },
                        { value: 'Gogroup', label: 'Gogroup' },
                    ]}
                />

                <div className="col-span-full h-px bg-slate-100 my-2" />

                <Select
                    label="Recrutador Responsável"
                    name="recruiterName"
                    value={state.recruiterName}
                    onChange={handleChange}
                    error={errors.recruiterName}
                    options={RECRUITERS.map(r => ({ value: r, label: r }))}
                />

                <Input
                    label="Cargo / Função"
                    name="roleTitle"
                    value={state.roleTitle}
                    onChange={handleChange}
                    error={errors.roleTitle}
                    placeholder="Ex: Desenvolvedor Senior"
                />

                <Select
                    label="Área / Time"
                    name="area"
                    value={state.area}
                    onChange={handleChange}
                    error={errors.area}
                    options={AREAS.map(a => ({ value: a, label: a }))}
                />

                <Input
                    label="Gestor Imediato"
                    name="manager"
                    value={state.manager}
                    onChange={handleChange}
                    error={errors.manager}
                    placeholder="Nome do Gestor"
                />

                <Input
                    label="Data de Início"
                    name="startDate"
                    type="date"
                    value={state.startDate}
                    onChange={handleChange}
                    error={errors.startDate}
                />

                <Select
                    label="Unidade / Local"
                    name="locationUnit"
                    value={state.locationUnit}
                    onChange={handleChange}
                    error={errors.locationUnit}
                    options={[
                        { value: 'Fortaleza', label: 'Fortaleza' },
                        { value: 'São Paulo', label: 'São Paulo' },
                        { value: 'Extrema', label: 'Extrema' },
                        { value: 'Itapeva', label: 'Itapeva' },
                        { value: 'Itapevi', label: 'Itapevi' },
                    ]}
                />

                {showWorkplaceType && (
                    <div className="animate-in fade-in slide-in-from-top-1">
                        <Select
                            label="Tipo de Local de Trabalho"
                            name="workplaceType"
                            value={state.workplaceType}
                            onChange={handleChange}
                            error={errors.workplaceType}
                            options={[
                                { value: 'Fábrica', label: 'Fábrica' },
                                { value: 'Escritório', label: 'Escritório' },
                            ]}
                        />
                    </div>
                )}

                <div className="col-span-full h-px bg-slate-100 my-2" />

                <div className="col-span-full">
                    <Input
                        label="Link do Case de IA"
                        name="aiCase"
                        value={state.aiCase}
                        onChange={handleChange}
                        error={errors.aiCase}
                        placeholder="www.exemplo.com.br"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button onClick={handleNext} className="w-full md:w-auto">
                    Próximo Passo
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
};

export default StepCommon;
