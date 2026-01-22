import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { saveDraft, loadDraft, clearDraft } from '../services/storage';



const FormContext = createContext();

export const INITIAL_STATE = {
    // Step Control
    currentStep: 1,

    // Common Fields
    candidateName: '',
    roleTitle: '',
    area: '',
    businessUnit: '', // Gocase, Gobeaute, Gogroup
    recruiterName: '',
    manager: '',
    startDate: '', // YYYY-MM-DD
    locationUnit: '', // Fortaleza, SP, Extrema, Fábrica
    workplaceType: '', // Fábrica, Escritório (only for Extrema/Itapeva/Itapevi)
    notes: '',
    aiCase: '', // Link or text for AI Case

    // Physical Store Specific
    jobType: 'Corporate', // 'Corporate' | 'Store'
    storeSchedule: '', // e.g. "10:00 - 18:00"

    // Modalidade Selection
    modalidade: '', // CLT, PJ, Estágio

    // CLT Specific
    salary: '',
    benefits: [], // VR comes from logic
    vrValue: 0, // Calculated

    // Estágio Specific
    bolsa: '',

    // PJ Specific
    contractValue: '',
    pjDescription: '', // NEW: Description of functions

    // Variable Remuneration
    hasVariableRemuneration: false,
    variableValue: '',
    annualBonusValue: '',

    // Final Review
    cargoEspecifico: false,
    referenceCkLink: '',

    // Meta
    requestId: null,
    isSubmitting: false,
    formVersion: '1.0'
};

const formReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };

        case 'SET_STEP':
            return { ...state, currentStep: action.step };

        case 'LOAD_STATE':
            return { ...state, ...action.payload };

        case 'RESET':
            return INITIAL_STATE;

        default:
            return state;
    }
};

export const FormProvider = ({ children }) => {
    const [state, dispatch] = useReducer(formReducer, INITIAL_STATE);

    // Load draft on mount
    useEffect(() => {
        loadDraft().then((data) => {
            if (data) {
                dispatch({ type: 'LOAD_STATE', payload: data });
            }
        });
    }, []);

    // Save draft on state change
    useEffect(() => {
        // Debounce could be added here, but for now direct save is okay for local IDB
        if (state !== INITIAL_STATE) {
            saveDraft(state);
        }
    }, [state]);

    const updateField = (field, value) => {
        dispatch({ type: 'SET_FIELD', field, value });
    };

    const setStep = (step) => {
        dispatch({ type: 'SET_STEP', step });
    };

    const resetForm = () => {
        clearDraft();
        dispatch({ type: 'RESET' });
    };

    return (
        <FormContext.Provider value={{ state, updateField, setStep, resetForm }}>
            {children}
        </FormContext.Provider>
    );
};

export const useForm = () => useContext(FormContext);
