import React from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

const Select = ({ label, error, options, placeholder = "Selecione...", className, ...props }) => {
    return (
        <div className={clsx("flex flex-col gap-1.5", className)}>
            {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
            <div className="relative">
                <select
                    className={clsx(
                        "w-full appearance-none px-3 py-2 rounded-lg border bg-white text-slate-900 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20",
                        error ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-brand-500",
                        !props.value && "text-slate-400"
                    )}
                    {...props}
                >
                    <option value="" disabled hidden>{placeholder}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="text-slate-900">
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};

export default Select;
