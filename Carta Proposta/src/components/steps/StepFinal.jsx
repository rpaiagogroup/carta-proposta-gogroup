import React, { useState } from 'react';
import { useForm } from '../../context/FormContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { validateStep3 } from '../../utils/validation';
import { AlertCircle, CheckCircle2, Copy, FileJson, User, Briefcase, CreditCard } from 'lucide-react';

const SummaryItem = ({ label, value, fullWidth = false }) => (
    <div className={fullWidth ? "col-span-full" : ""}>
        <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</dt>
        <dd className="mt-1 text-sm font-medium text-slate-900 break-words">{value || '-'}</dd>
    </div>
);

const StepFinal = () => {
    const { state, updateField, setStep, resetForm } = useForm();
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    const handleSubmit = async () => {
        const validationErrors = validateStep3(state);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setResult(null);

        try {
            // 1. Clone state
            const rawData = { ...state };

            // 2. Filter fields based on modalidade
            if (rawData.modalidade === 'CLT') {
                delete rawData.bolsa;
                delete rawData.contractValue;
                delete rawData.pjDescription;
            } else if (rawData.modalidade === 'PJ') {
                delete rawData.salary;
                delete rawData.vrValue;
                delete rawData.benefits; // if specific to CLT
                delete rawData.bolsa;
            } else if (rawData.modalidade === 'Estágio') {
                delete rawData.salary;
                delete rawData.vrValue; // Estágio has fixed VR but might be handled differently? Kept if needed, but per bug request remove unused
                delete rawData.contractValue;
                delete rawData.pjDescription;
                delete rawData.benefits;
            }

            const payload = {
                ...rawData,
                submittedAt: new Date().toISOString()
            };

            const response = await fetch(import.meta.env.VITE_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                setResult({ status: 'success', data });
            } else {
                throw new Error(data.message || 'Erro ao enviar proposta');
            }

        } catch (error) {
            console.error("Submission error", error);
            setResult({ status: 'error', message: error.message || "Falha na comunicação com o servidor." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyId = () => {
        if (result?.data?.requestId) {
            navigator.clipboard.writeText(result.data.requestId);
        }
    };

    if (result?.status === 'success') {
        return (
            <div className="text-center py-10 space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Fluxo acionado!</h2>
                    <p className="text-slate-500 mt-2">A carta proposta ficará pronta em pouco tempo.</p>
                </div>

                {result.data?.requestId && (
                    <div className="max-w-xs mx-auto bg-slate-100 rounded-lg p-3 flex items-center justify-between border border-slate-200">
                        <code className="text-sm font-mono text-slate-700">{result.data.requestId}</code>
                        <button onClick={copyId} className="p-2 hover:bg-white rounded-md transition-colors text-slate-500 hover:text-brand-600" title="Copiar ID">
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <Button variant="outline" onClick={resetForm}>
                    Criar Nova Proposta
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-semibold text-slate-900">Revisão e Finalização</h2>
                <p className="text-slate-500 text-sm mt-1">Confira os dados e inclua informações finais.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <h3 className="font-semibold text-slate-700">Dados do Candidato</h3>
                </div>
                <dl className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
                    <SummaryItem label="Candidato" value={state.candidateName} />
                    <SummaryItem label="Recrutador Resp." value={state.recruiterName} />
                    <SummaryItem label="Unidade de Negócio" value={state.businessUnit} />
                    <SummaryItem label="Área / Time" value={state.area} />
                    <SummaryItem label="Gestor Imediato" value={state.manager} />
                    <SummaryItem label="Data de Início" value={state.startDate?.split('-').reverse().join('/')} />
                    <SummaryItem label="Local de Trabalho" value={`${state.locationUnit} ${state.workplaceType ? `- ${state.workplaceType}` : ''}`} />
                </dl>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-slate-500" />
                    <h3 className="font-semibold text-slate-700">Detalhes da Contratação ({state.modalidade})</h3>
                </div>
                <dl className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
                    <SummaryItem label="Cargo / Função" value={state.roleTitle} />

                    {state.modalidade === 'CLT' && (
                        <>
                            <SummaryItem label="Salário Mensal" value={state.salary} />
                            <SummaryItem label="Vale Refeição" value={typeof state.vrValue === 'number' ? `R$ ${state.vrValue},00` : state.vrValue} />
                        </>
                    )}

                    {state.modalidade === 'PJ' && (
                        <>
                            <SummaryItem label="Valor do Contrato" value={state.contractValue} />
                            <SummaryItem label="Descrição das Funções" value={state.pjDescription} fullWidth />
                        </>
                    )}

                    {state.modalidade === 'Estágio' && (
                        <SummaryItem label="Valor da Bolsa" value={state.bolsa} />
                    )}
                </dl>
            </div>


            <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="cargoEspecifico"
                        className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 transition-colors"
                        checked={state.cargoEspecifico}
                        onChange={(e) => updateField('cargoEspecifico', e.target.checked)}
                    />
                    <label htmlFor="cargoEspecifico" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                        É um Cargo Específico?
                    </label>
                </div>

                {state.cargoEspecifico && (
                    <div className="animate-in fade-in slide-in-from-top-2 p-4 bg-amber-50 rounded-lg border border-amber-100 space-y-3">
                        <div className="flex gap-2 text-sm text-amber-800">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>Cargos específicos exigem o link do <strong>Reference Check</strong> para prosseguir.</p>
                        </div>
                        <Input
                            label="Link do Reference Check"
                            name="referenceCkLink"
                            value={state.referenceCkLink}
                            onChange={(e) => updateField('referenceCkLink', e.target.value)}
                            error={errors.referenceCkLink}
                            placeholder="https://..."
                            className="bg-white"
                        />
                    </div>
                )}

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Observações Adicionais (Opcional)</label>
                    <textarea
                        className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 active:border-brand-500 min-h-[100px] w-full"
                        value={state.notes}
                        onChange={(e) => updateField('notes', e.target.value)}
                        placeholder="Alguma observação importante para a carta..."
                    />
                </div>
            </div>

            {result?.status === 'error' && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm">
                    <strong>Erro:</strong> {result.message}
                </div>
            )}

            <div className="flex justify-between pt-6 border-t border-slate-100">
                <Button variant="outline" onClick={() => setStep(2)} disabled={isSubmitting}>
                    Voltar
                </Button>
                <Button onClick={handleSubmit} isLoading={isSubmitting} className="w-full md:w-auto px-8">
                    Gerar Carta Proposta
                </Button>
            </div>
        </div>
    );
};

export default StepFinal;
