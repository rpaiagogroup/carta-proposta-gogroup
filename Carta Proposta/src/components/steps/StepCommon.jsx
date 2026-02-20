import React, { useState } from 'react';
import { useForm } from '../../context/FormContext';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { validateStep1 } from '../../utils/validation';
import { VR_RULES } from '../../utils/businessRules';
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

        // Reset type-specific fields when switching jobType
        if (name === 'jobType') {
            // Always reset locationUnit since the options differ between Store and Corporate
            updateField('locationUnit', '');
            updateField('workplaceType', '');
            if (value === 'Corporate') {
                updateField('storeSchedule', '');
            } else if (value === 'Store') {
                updateField('area', '');
                updateField('manager', '');
                updateField('businessUnit', '');
            }
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

        if (state.jobType !== 'Store' && !state.businessUnit) {
            validationErrors.businessUnit = 'Selecione a unidade de negócio';
        }

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
                <div className="col-span-full mb-4">
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Tipo de Vaga</label>
                    <div className="flex p-1 bg-slate-100 rounded-lg w-fit">
                        <button
                            onClick={() => handleChange({ target: { name: 'jobType', value: 'Corporate' } })}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${state.jobType !== 'Store'
                                ? 'bg-white text-brand-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Corporativo / Fábrica
                        </button>
                        <button
                            onClick={() => handleChange({ target: { name: 'jobType', value: 'Store' } })}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${state.jobType === 'Store'
                                ? 'bg-white text-brand-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Loja Física
                        </button>
                    </div>
                </div>

                <Input
                    label="Nome do Candidato"
                    name="candidateName"
                    value={state.candidateName}
                    onChange={handleChange}
                    error={errors.candidateName}
                    placeholder="Ex: João Silva"
                />

                {state.jobType !== 'Store' && (
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
                )}

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
                    label={state.jobType === 'Store' ? "Cargo de Admissão" : "Cargo / Função"}
                    name="roleTitle"
                    value={state.roleTitle}
                    onChange={handleChange}
                    error={errors.roleTitle}
                    placeholder={state.jobType === 'Store' ? "Ex: Vendedor" : "Ex: Desenvolvedor Senior"}
                />

                {state.jobType !== 'Store' && (
                    <Select
                        label="Área / Time"
                        name="area"
                        value={state.area}
                        onChange={handleChange}
                        error={errors.area}
                        options={AREAS.map(a => ({ value: a, label: a }))}
                    />
                )}

                {state.jobType !== 'Store' && (
                    <Input
                        label="Gestor Imediato"
                        name="manager"
                        value={state.manager}
                        onChange={handleChange}
                        error={errors.manager}
                        placeholder="Nome do Gestor"
                    />
                )}

                <Input
                    label="Data de Início"
                    name="startDate"
                    type="date"
                    value={state.startDate}
                    onChange={handleChange}
                    error={errors.startDate}
                />

                {state.jobType === 'Store' && (
                    <Input
                        label="Horário"
                        name="storeSchedule"
                        value={state.storeSchedule}
                        onChange={handleChange}
                        error={errors.storeSchedule}
                        placeholder="Ex: 10:00 - 18:00"
                    />
                )}

                <Select
                    label="Unidade / Local"
                    name="locationUnit"
                    value={state.locationUnit}
                    onChange={handleChange}
                    error={errors.locationUnit}
                    options={state.jobType === 'Store'
                        ? VR_RULES.STORE_LOCATIONS.map(l => ({ value: l, label: l }))
                        : [
                            { value: 'Fortaleza', label: 'Fortaleza' },
                            { value: 'São Paulo', label: 'São Paulo' },
                            { value: 'Extrema', label: 'Extrema' },
                            { value: 'Itapeva', label: 'Itapeva' },
                            { value: 'Itapevi', label: 'Itapevi' },
                        ]
                    }
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

                <div className="col-span-full flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">
                        {state.jobType === 'Store' ? "Feedback do Case de IA (Opcional)" : "Feedback do Case de IA"}
                    </label>
                    <textarea
                        name="aiCase"
                        value={state.aiCase}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Cole aqui o texto de feedback enviado pelo avaliador..."
                        className={`px-3 py-2 rounded-lg border bg-white text-slate-900 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none ${errors.aiCase ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-brand-500'}`}
                    />
                    {errors.aiCase && <span className="text-xs text-red-500">{errors.aiCase}</span>}
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button onClick={handleNext} className="w-full md:w-auto">
                    Próximo Passo
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div >
    );
};

export default StepCommon;
