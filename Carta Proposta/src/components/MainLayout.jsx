import React from 'react';
import { useForm } from '../context/FormContext';
import clsx from 'clsx';
import { FileText, User, Briefcase, CheckCircle } from 'lucide-react';

const STEPS = [
    { id: 1, label: 'Dados Básicos', icon: User },
    { id: 2, label: 'Modalidade', icon: Briefcase },
    { id: 3, label: 'Revisão', icon: CheckCircle },
];

const MainLayout = ({ children }) => {
    const { state } = useForm();
    const { currentStep } = state;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/80 backdrop-blur-xl shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* <div className="p-2 bg-brand-50 rounded-lg">
                            <FileText className="w-5 h-5 text-brand-600" />
                        </div> */}
                        <img src="/logo.png" alt="Gogroup Logo" className="w-10 h-10 object-contain" />
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 ml-2">
                            Carta Proposta Gogroup
                        </h1>
                    </div>
                    <div className="text-sm text-slate-500">
                        Recrutamento e Seleção
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Step Indicator */}
                <div className="mb-10">
                    <div className="relative flex items-center justify-between w-full">
                        {/* Connecting Line */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-200 -z-10" />

                        {STEPS.map((step) => {
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;

                            return (
                                <div key={step.id} className="flex flex-col items-center gap-2 bg-slate-50 px-2 lg:px-4">
                                    <div className={clsx(
                                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                        isCompleted ? "bg-brand-500 border-brand-500 text-white" :
                                            isActive ? "bg-white border-brand-500 text-brand-600 ring-4 ring-brand-50/50" :
                                                "bg-white border-slate-200 text-slate-400"
                                    )}>
                                        <step.icon className="w-5 h-5" />
                                    </div>
                                    <span className={clsx(
                                        "text-xs font-medium transition-colors duration-300",
                                        isActive || isCompleted ? "text-slate-900" : "text-slate-500"
                                    )}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
