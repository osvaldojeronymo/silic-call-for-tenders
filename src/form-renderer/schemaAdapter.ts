import type { RJSFSchema, UiSchema } from '@rjsf/utils';
import sourceSchema from '../data/schema_formulario_gerador_edital_caixa_v1.json';
import type {
  AdaptedSchema,
  Campo,
  FieldMeta,
  FormularioSchema,
  SectionDescriptor
} from './types';

const BRAZIL_STATES = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
];

const cpfPattern = '^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$';
const cnpjPattern = '^\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}$';

const defaultDragModes = ['inserir_variavel', 'inserir_valor'];

function normalizeType(tipo: string): string {
  return tipo?.toLowerCase() ?? 'string';
}

function extractRegex(validations?: string[]): string | undefined {
  if (!validations) return undefined;
  for (const rule of validations) {
    if (rule.startsWith('regex:')) {
      return rule.replace(/^regex:/, '');
    }
  }
  return undefined;
}

function getFieldUi(type: string): UiSchema[string] | undefined {
  if (type === 'text') {
    return {
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 5
      }
    };
  }
  if (type === 'money' || type === 'percent') {
    return {
      'ui:widget': 'updown',
      'ui:options': {
        step: type === 'percent' ? 0.01 : 0.01,
        inputType: 'number'
      }
    };
  }
  if (type === 'int') {
    return {
      'ui:widget': 'updown',
      'ui:options': {
        step: 1,
        inputType: 'number'
      }
    };
  }
  return undefined;
}

function getMockValue(field: Campo): string | number | boolean | null {
  const type = normalizeType(field.tipo);
  const baseLabel = field.label ?? field.id;
  switch (type) {
    case 'int':
      return 1;
    case 'money':
      return 1500.5;
    case 'percent':
      return 10;
    case 'boolean':
      return false;
    case 'date':
      return '2025-01-10';
    case 'time':
      return '10:00';
    case 'uf':
      return 'DF';
    case 'cpf':
      return '123.456.789-00';
    case 'cnpj':
      return '12.345.678/0001-90';
    case 'text':
      return `Texto para ${baseLabel}`;
    default:
      return `${baseLabel} (mock)`;
  }
}

function fieldToSchema(field: Campo, mockValue: string | number | boolean | null): {
  schema: RJSFSchema;
  uiSchema?: UiSchema[string];
} {
  const type = normalizeType(field.tipo);
  const schema: RJSFSchema = {
    type: ['text', 'string', 'uf', 'cpf', 'cnpj'].includes(type) ? 'string' : type === 'int' ? 'integer' : type === 'boolean' ? 'boolean' : type === 'money' || type === 'percent' ? 'number' : 'string',
    title: field.label || field.id
  };

  if (mockValue !== null && mockValue !== undefined) {
    schema.default = mockValue;
  }

  if (type === 'date') {
    schema.format = 'date';
  }
  if (type === 'time') {
    schema.format = 'time';
  }
  if (type === 'money') {
    schema.minimum = 0;
    schema.multipleOf = 0.01;
  }
  if (type === 'percent') {
    schema.minimum = 0;
    schema.maximum = 100;
    schema.multipleOf = 0.01;
  }
  if (type === 'uf') {
    schema.enum = BRAZIL_STATES.map((state) => state.value);
    (schema as RJSFSchema & { enumNames?: string[] }).enumNames = BRAZIL_STATES.map((state) => state.label);
  }
  if (type === 'cpf') {
    schema.pattern = cpfPattern;
  }
  if (type === 'cnpj') {
    schema.pattern = cnpjPattern;
  }

  const regexPattern = extractRegex(field.validacoes);
  if (regexPattern) {
    schema.pattern = regexPattern;
  }

  const uiSchema = getFieldUi(type);
  return { schema, uiSchema };
}

export function buildAdaptedSchema(source: FormularioSchema): AdaptedSchema {
  const sections: SectionDescriptor[] = [];
  const initialData: Record<string, unknown> = {};
  const silicFields: FieldMeta[] = [];

  source.grupos.forEach((grupo) => {
    const properties: Record<string, RJSFSchema> = {};
    const required: string[] = [];
    const uiSchema: UiSchema = {};
    const fieldIds: string[] = [];

    grupo.campos.forEach((campo) => {
      const mockValue = getMockValue(campo);
      initialData[campo.id] = mockValue;

      const { schema, uiSchema: fieldUi } = fieldToSchema(campo, mockValue);
      properties[campo.id] = schema;
      if (campo.obrigatorio) {
        required.push(campo.id);
      }
      if (fieldUi) {
        uiSchema[campo.id] = fieldUi;
      }
      fieldIds.push(campo.id);

      const hasSilicOrigin = campo.origem
        ? campo.origem.toLowerCase().split('|').includes('silic')
        : false;
      if (hasSilicOrigin) {
        silicFields.push({
          id: campo.id,
          label: campo.label,
          origin: campo.origem,
          tokens: campo.tokens_docx,
          silicPath: campo.silic_path,
          mockValue,
          tipo: campo.tipo
        });
      }
    });

    const sectionSchema: RJSFSchema = {
      type: 'object',
      properties
    };
    if (required.length > 0) {
      sectionSchema.required = required;
    }

    sections.push({
      id: grupo.id,
      title: grupo.titulo,
      schema: sectionSchema,
      uiSchema,
      fieldIds
    });
  });

  const dragModes = source.modos_insercao_drag_drop?.length
    ? source.modos_insercao_drag_drop
    : defaultDragModes;

  return {
    sections,
    initialData,
    silicFields,
    dragModes,
    raw: source
  };
}

const typedSource = sourceSchema as FormularioSchema;

export const adaptedSchema = buildAdaptedSchema(typedSource);
