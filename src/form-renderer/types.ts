import type { RJSFSchema, UiSchema } from '@rjsf/utils';

export interface Campo {
  id: string;
  label: string;
  tipo: string;
  origem: string;
  silic_path?: string;
  obrigatorio?: boolean;
  derivacao?: string;
  tokens_docx?: string[];
  validacoes?: string[];
  regras?: Array<Record<string, unknown>>;
}

export interface Grupo {
  id: string;
  titulo: string;
  campos: Campo[];
  validacoes_grupo?: string[];
}

export interface FormularioSchema {
  schema_version: string;
  produto: string;
  artefato: string;
  ui: Record<string, unknown>;
  modos_insercao_drag_drop?: string[];
  status_documento?: string[];
  grupos: Grupo[];
  tokens_docx_detectados?: string[];
}

export interface FieldMeta {
  id: string;
  label: string;
  origin: string;
  tokens?: string[];
  silicPath?: string;
  mockValue: string | number | boolean | null;
  tipo: string;
}

export interface SectionDescriptor {
  id: string;
  title: string;
  schema: RJSFSchema;
  uiSchema: UiSchema;
  fieldIds: string[];
}

export interface AdaptedSchema {
  sections: SectionDescriptor[];
  initialData: Record<string, unknown>;
  silicFields: FieldMeta[];
  dragModes: string[];
  raw: FormularioSchema;
}
