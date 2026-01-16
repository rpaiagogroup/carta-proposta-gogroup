import React from 'react';
import clsx from 'clsx';

const Input = ({ label, error, className, ...props }) => {
    return (
        <div className={clsx("flex flex-col gap-1.5", className)}>
            {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
            <input
                className={clsx(
                    "px-3 py-2 rounded-lg border bg-white text-slate-900 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20",
                    error ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-brand-500"
                )}
                {...props}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};

export default Input;
