// === Process & Validate Data (input vindo do Webhook) ===
// O payload está em $input.first().json.body
const body = $input.first().json.body || {};

// Helpers
function capitalizeWords(str) {
    if (!str) return '';
    return String(str)
        .toLowerCase()
        .split(' ')
        .map(w => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ''))
        .join(' ');
}

// Converte "R$ 12.500,00" -> 12500.00
function parseBRCurrency(str) {
    if (typeof str === 'number') return str;
    if (!str) return 0;
    // Remove tudo que não é dígito e divide por 100
    const digits = String(str).replace(/\D/g, '');
    return digits ? parseInt(digits, 10) / 100 : 0;
}

function formatCurrency(val) {
    // Se val for 0 ou inválido
    if (!val || isNaN(val)) return 'R$ 0,00';
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function extractVRValue(vrOption) {
    if (!vrOption) return '';
    const s = String(vrOption);
    // Ex: "ESCRITORIO CE - R$ 25,00" -> "R$ 25,00"
    // Ou se preferir apenas o valor numérico, ajuste aqui.
    // O código anterior pegava do "R$" pra frente.
    const idx = s.indexOf('R$');
    return idx !== -1 ? s.substring(idx).trim() : s;
}

// Aceita "YYYY-MM-DD" e converte para "DD/MM/YYYY"
function formatDateDisplay(dateString) {
    if (!dateString) return '';
    const str = String(dateString).trim();

    // Caso "YYYY-MM-DD"
    const m = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
        const [, y, mo, d] = m;
        return `${d}/${mo}/${y}`;
    }

    // Tenta via Date
    const dt = new Date(str);
    if (!isNaN(dt.getTime())) {
        return dt.toLocaleDateString('pt-BR');
    }

    return str;
}

// Mapeamento dos campos do body (camelCase do React)
const nome = body.candidateName || '';
const cargo = body.roleTitle || '';
const area = body.area || '';
const unidadeNegocio = body.businessUnit || '';
const unidade = body.locationUnit || '';
const gestor = body.manager || '';
const modalidade = body.modalidade || '';
const inicioPrevisto = body.startDate || '';
const recrutador = body.recrutadorName || body.recruiterName || ''; // recruiterName no React
const dataSubmissaoIn = body.submittedAt || '';
const aiCase = body.aiCase || '';
const referenceCheckLink = body.referenceCkLink || '';

// Lógica de Salário / Valor dependendo da modalidade
let rawSalaryStr = '';
let descricao = '';

if (modalidade === 'CLT') {
    rawSalaryStr = body.salary; // "R$ 12.500,00"
    // VR apenas para CLT logicamente, mas vem no body.vrValue
} else if (modalidade === 'PJ') {
    rawSalaryStr = body.contractValue;
    descricao = body.pjDescription || '';
} else if (modalidade === 'Estágio') {
    rawSalaryStr = body.bolsa;
}

// VR vem como "ESCRITORIO CE - R$ 25,00" ou similar
const vrOption = body.vrValue || '';

// Valores numéricos
const salarioValue = parseBRCurrency(rawSalaryStr);

// Dados processados
const processedData = {
    nome: capitalizeWords(nome),
    cargo: capitalizeWords(cargo),
    area: capitalizeWords(area),
    unidadeNegocio: capitalizeWords(unidadeNegocio),
    unidade: capitalizeWords(unidade),
    gestor: capitalizeWords(gestor),

    // Mantém a string original formatada ou reformata o numérico
    salario: formatCurrency(salarioValue),
    salarioValue: salarioValue,

    modalidade: String(modalidade || '').toLowerCase(),

    vr: extractVRValue(vrOption),
    vrValue: vrOption, // Texto completo da opção

    descricao: descricao,
    aiCase: aiCase,

    inicioPrevisto: formatDateDisplay(inicioPrevisto),
    inicioPrevistoRaw: inicioPrevisto,

    recrutador: recrutador,

    // Store Fields
    horario: body.storeSchedule || '',
    tipoVaga: body.jobType || 'Corporate',

    // Remuneração Variável
    variavel: body.hasVariableRemuneration ? body.variableValue : '',
    bonus_anual: body.hasVariableRemuneration ? body.annualBonusValue : '',

    // BGC Legal Check
    check_time_juridico: body.bgcJuridico ? 'Sim' : 'Não',

    // Flag de unidade Extrema
    isExtrema: String(unidade || '').trim().toLowerCase() === 'extrema',

    // Campos padrão
    aprovacao: 'Pendente',
    motivo: '',
    link: '',

    referenceCheckLink: referenceCheckLink,

    dataSubmissao: dataSubmissaoIn
        ? formatDateDisplay(dataSubmissaoIn)
        : new Date().toLocaleDateString('pt-BR'),
};

return [{ json: processedData }];
