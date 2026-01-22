import React, { useEffect, useState } from 'react';
import { useForm } from '../../context/FormContext';
import { calculateVR } from '../../utils/businessRules';
import { formatCurrency, parseCurrency } from '../../utils/formatters';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { validateStep2 } from '../../utils/validation';
import { Check, Coins, GraduationCap, Building2, ArrowLeft, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

const ModalidadeCard = ({ label, icon: Icon, selected, onClick }) => (
    <button
        onClick={onClick}
        className={clsx(
            "flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 w-full h-32 gap-3",
            selected ? "border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500" : "border-slate-200 bg-white hover:border-slate-300 text-slate-600"
        )}
    >
        <Icon className={clsx("w-8 h-8", selected ? "text-brand-600" : "text-slate-400")} />
        <span className="font-medium">{label}</span>
        {selected && <div className="absolute top-3 right-3 text-brand-500"><Check className="w-5 h-5" /></div>}
    </button>
);

const VariableRemunerationSection = ({ state, updateField, handleChange, errors }) => (
    <div className="md:col-span-full mt-4 p-4 border rounded-lg bg-slate-50">
        <label className="flex items-center gap-2 cursor-pointer mb-4 w-fit">
            <input
                type="checkbox"
                name="hasVariableRemuneration"
                checked={state.hasVariableRemuneration}
                onChange={(e) => updateField('hasVariableRemuneration', e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm font-medium text-slate-700">Este cargo possui remuneração variável / bônus?</span>
        </label>

        {state.hasVariableRemuneration && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                <Input
                    label="Variável (Descrição/Valor)"
                    name="variableValue"
                    value={state.variableValue}
                    onChange={handleChange}
                    placeholder="Ex: Até 2 salários conforme metas..."
                    error={errors?.variableValue}
                />
                <Input
                    label="Bônus Anual (Descrição/Valor)"
                    name="annualBonusValue"
                    value={state.annualBonusValue}
                    onChange={handleChange}
                    placeholder="Ex: Bônus de performance anual..."
                />
            </div>
        )}
    </div>
);

const StepModalidade = () => {
    const { state, updateField, setStep } = useForm();
    const [vrInfo, setVrInfo] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Auto-select CLT for Store
        if (state.jobType === 'Store' && state.modalidade !== 'CLT') {
            updateField('modalidade', 'CLT');
        }

        // Recalculate VR whenever: location, modalidade, OR workplaceType changes
        if (state.locationUnit && state.modalidade) {
            const info = calculateVR(state.locationUnit, state.modalidade, state.workplaceType, state.jobType);
            setVrInfo(info);

            // Auto-set VR value if fixed or composite
            if (info) {
                if (info.type === 'fixed') updateField('vrValue', info.value);
                if (info.type === 'composite') updateField('vrValue', info.value);
                if (info.type === 'manual') updateField('vrValue', 0);
            }
        } else {
            setVrInfo(null);
        }
    }, [state.locationUnit, state.modalidade, state.workplaceType, state.jobType]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateField(name, value);
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleCurrencyChange = (e) => {
        const { name, value } = e.target;
        // value comes in as whatever the user types. 
        // If it's empty, set empty.
        // Else, we format it.

        // Remove non-numeric to check content
        const raw = value.replace(/\D/g, '');
        if (raw === '') {
            updateField(name, '');
            return;
        }

        const formatted = formatCurrency(raw);
        updateField(name, formatted);

        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleNext = () => {
        const validationErrors = validateStep2(state);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setStep(3);
    };

    const currentMod = state.modalidade;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-semibold text-slate-900">Modalidade de Contratação</h2>
                <p className="text-slate-500 text-sm mt-1">Escolha o modelo e preencha os detalhes da oferta.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ModalidadeCard
                    label="CLT"
                    icon={Building2}
                    selected={currentMod === 'CLT'}
                    onClick={() => updateField('modalidade', 'CLT')}
                />
                <ModalidadeCard
                    label="Pessoa Jurídica"
                    icon={Coins}
                    selected={currentMod === 'PJ'}
                    onClick={() => updateField('modalidade', 'PJ')}
                />
                <ModalidadeCard
                    label="Estágio"
                    icon={GraduationCap}
                    selected={currentMod === 'Estágio'}
                    onClick={() => updateField('modalidade', 'Estágio')}
                />
            </div>
            {errors.modalidade && <p className="text-sm text-red-500 font-medium text-center">{errors.modalidade}</p>}

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 animate-in fade-in slide-in-from-top-2">
                {!currentMod && <p className="text-center text-slate-400">Selecione uma modalidade acima.</p>}

                {currentMod === 'CLT' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Salário Mensal"
                            name="salary"
                            value={state.salary}
                            onChange={handleCurrencyChange}
                            error={errors.salary}
                            placeholder="R$ 0,00"
                        />

                        {/* VR Display */}
                        <div className="md:col-span-2 p-4 bg-white rounded-lg border border-slate-200">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-sm font-medium text-slate-700">Vale Refeição / Alimentação</h4>
                                {vrInfo?.label && <span className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-500">{vrInfo.label}</span>}
                            </div>

                            {vrInfo?.type === 'select' ? (
                                <Select
                                    label="Selecione o benefício"
                                    name="vrValue"
                                    value={state.vrValue}
                                    onChange={handleChange}
                                    options={vrInfo.options}
                                />
                            ) : vrInfo?.type === 'composite' ? (
                                <div className="text-sm text-slate-600">
                                    <p>Base: <strong>R$ {vrInfo.details.base},00</strong></p>
                                    <p>Assiduidade: <strong>R$ {vrInfo.details.assiduidade},00</strong></p>
                                    <div className="mt-2 text-brand-600 font-medium text-base">Total: R$ {vrInfo.value},00</div>
                                </div>
                            ) : vrInfo?.type === 'fixed' ? (
                                <p className="text-sm text-slate-900 font-medium text-lg">R$ {vrInfo.value},00</p>
                            ) : (
                                <p className="text-sm text-slate-500">
                                    {state.locationUnit === 'Outro' ? 'Defina manualmente ou não aplicável.' : 'Selecione os dados da unidade.'}
                                </p>
                            )}
                        </div>

                        <VariableRemunerationSection state={state} updateField={updateField} handleChange={handleChange} errors={errors} />
                    </div>
                )}

                {currentMod === 'PJ' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Valor do Contrato"
                            name="contractValue"
                            value={state.contractValue}
                            onChange={handleCurrencyChange}
                            error={errors.contractValue}
                            placeholder="R$ 0,00"
                        />

                        <div className="md:col-span-2 flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-700">Descrição das Funções</label>
                            <textarea
                                className={clsx(
                                    "px-3 py-2 rounded-lg border bg-white text-slate-900 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 w-full min-h-[100px]",
                                    errors.pjDescription ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-brand-500"
                                )}
                                name="pjDescription"
                                value={state.pjDescription}
                                onChange={handleChange}
                                placeholder="Descreva as atividades e entregáveis..."
                            />
                            {errors.pjDescription && <span className="text-xs text-red-500">{errors.pjDescription}</span>}
                        </div>

                        <div className="md:col-span-2 text-sm text-slate-500 italic mb-2">
                            * Modalidade PJ não contempla Vale Refeição.
                        </div>

                        <VariableRemunerationSection state={state} updateField={updateField} handleChange={handleChange} errors={errors} />
                    </div>
                )}

                {currentMod === 'Estágio' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1">
                            <Input
                                label="Valor da Bolsa"
                                name="bolsa"
                                value={state.bolsa}
                                onChange={handleCurrencyChange}
                                error={errors.bolsa}
                                placeholder="R$ 0,00"
                            />
                        </div>
                        <div className="md:col-span-2 text-sm text-slate-600 p-3 bg-blue-50 text-blue-700 rounded-lg">
                            VR fixo de <strong>R$ 200,00</strong> aplicado automaticamente.
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="border-0 hover:bg-slate-100">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                </Button>
                <Button onClick={handleNext}>
                    Avançar
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
};

export default StepModalidade;
