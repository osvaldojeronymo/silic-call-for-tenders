import { useCallback, useMemo, useRef, useState } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import ReactQuill from 'react-quill';
import { DndContext, DragOverlay, useDroppable, useDraggable } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { adaptedSchema } from './schemaAdapter';
import type { FieldMeta, SectionDescriptor } from './types';
import 'react-quill/dist/quill.snow.css';
import './form-renderer.css';

const editorDropzoneId = 'form-renderer-editor';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 2
});

function formatValue(field: FieldMeta, value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  const type = field.tipo.toLowerCase();
  if (type === 'money') {
    const numberValue = typeof value === 'number' ? value : Number(value);
    return currencyFormatter.format(Number.isNaN(numberValue) ? 0 : numberValue);
  }

  if (type === 'percent') {
    const numberValue = typeof value === 'number' ? value : Number(value);
    const safeNumber = Number.isNaN(numberValue) ? 0 : numberValue;
    return `${safeNumber}%`;
  }

  if (typeof value === 'boolean') {
    return value ? 'Sim' : 'Não';
  }

  if (type === 'date' && typeof value === 'string' && value.includes('-')) {
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }

  return String(value);
}

interface ChipProps {
  field: FieldMeta;
  value: unknown;
  onInsert?: (field: FieldMeta) => void;
}

function SilicChip({ field, value, onInsert }: ChipProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: field.id,
    data: { field }
  });

  const chipStyle = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <button
      type="button"
      className={`silic-chip ${isDragging ? 'dragging' : ''}`}
      ref={setNodeRef}
      style={chipStyle}
      onClick={() => onInsert?.(field)}
      {...listeners}
      {...attributes}
    >
      <div className="silic-chip-label">{field.label}</div>
      <div className="silic-chip-value">{formatValue(field, value)}</div>
      <div className="silic-chip-meta">
        <span className="origin">{field.origin.toUpperCase()}</span>
        {field.tokens?.[0] && <span className="token">[{field.tokens[0]}]</span>}
      </div>
    </button>
  );
}

function ChipPreview({ field, value }: ChipProps) {
  return (
    <div className="silic-chip overlay">
      <div className="silic-chip-label">{field.label}</div>
      <div className="silic-chip-value">{formatValue(field, value)}</div>
    </div>
  );
}

interface SectionProps {
  section: SectionDescriptor;
  formData: Record<string, unknown>;
  onChange: (partial: Record<string, unknown>) => void;
}

function SectionForm({ section, formData, onChange }: SectionProps) {
  const sectionData = useMemo(() => {
    return section.fieldIds.reduce<Record<string, unknown>>((acc, fieldId) => {
      acc[fieldId] = formData[fieldId];
      return acc;
    }, {});
  }, [formData, section.fieldIds]);

  return (
    <details className="section-card" open>
      <summary>{section.title}</summary>
      <Form
        schema={section.schema}
        uiSchema={section.uiSchema}
        formData={sectionData}
        validator={validator}
        showErrorList={false}
        liveValidate
        onChange={(event) => onChange(event.formData ?? {})}
      >
        <div className="hidden-submit" />
      </Form>
    </details>
  );
}

export function FormRendererApp() {
  const [formData, setFormData] = useState<Record<string, unknown>>(
    () => ({ ...adaptedSchema.initialData })
  );
  const [editorContent, setEditorContent] = useState('<p>Monte o texto base do edital aqui…</p>');
  const [activeField, setActiveField] = useState<FieldMeta | null>(null);
  const [dragMode, setDragMode] = useState(
    adaptedSchema.dragModes[0] ?? 'inserir_variavel'
  );

  const quillRef = useRef<ReactQuill | null>(null);
  const { setNodeRef: setEditorDropRef, isOver } = useDroppable({
    id: editorDropzoneId
  });

  const handleSectionChange = useCallback((partial: Record<string, unknown>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  }, []);

  const insertFieldIntoEditor = useCallback(
    (field: FieldMeta) => {
      const valueFromForm = formData[field.id];
      const insertion =
        dragMode === 'inserir_valor'
          ? String(valueFromForm ?? field.mockValue ?? '')
          : `[${field.tokens?.[0] ?? field.id}]`;
      const quill = quillRef.current?.getEditor();

      if (quill) {
        const selection = quill.getSelection(true);
        const index = selection ? selection.index : quill.getLength() - 1;
        quill.insertText(index, insertion);
        quill.setSelection(index + insertion.length, 0);
        setEditorContent(quill.root.innerHTML);
      } else {
        setEditorContent((prev) => `${prev}${insertion}`);
      }
    },
    [dragMode, formData]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const field = event.active.data.current?.field as FieldMeta | undefined;
    setActiveField(field ?? null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const field = event.active.data.current?.field as FieldMeta | undefined;
      if (field && event.over?.id === editorDropzoneId) {
        insertFieldIntoEditor(field);
      }
      setActiveField(null);
    },
    [insertFieldIntoEditor]
  );

  const handleDragCancel = useCallback(() => {
    setActiveField(null);
  }, []);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
      <div className="form-renderer">
        <header className="renderer-header">
          <div>
            <h1>Form Renderer – Gerador de Edital CAIXA</h1>
            <p>
              Selecione os campos do SILIC, edite o formulário nas seções e arraste/solte chips para
              preencher o texto-base do edital.
            </p>
          </div>
          <div className="drag-mode-toggle">
            <span>Modo de inserção:</span>
            {adaptedSchema.dragModes.map((mode) => (
              <label key={mode}>
                <input
                  type="radio"
                  value={mode}
                  checked={dragMode === mode}
                  onChange={() => setDragMode(mode)}
                />
                {mode === 'inserir_valor' ? 'Valor mockado' : 'Variável [TOKEN]'}
              </label>
            ))}
          </div>
        </header>

        <div className="renderer-columns">
          <section className="column column-preview">
            <h2>Coluna A · Formulário</h2>
            <div className="accordion-list">
              {adaptedSchema.sections.map((section) => (
                <SectionForm
                  key={section.id}
                  section={section}
                  formData={formData}
                  onChange={handleSectionChange}
                />
              ))}
            </div>
          </section>

          <section
            className={`column column-editor ${isOver ? 'dropping' : ''}`}
            ref={setEditorDropRef}
          >
            <h2>Coluna B · Texto-base (TipTap/Quill)</h2>
            <p className="editor-hint">Arraste um chip e solte dentro do editor para inserir.</p>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={editorContent}
              onChange={setEditorContent}
              placeholder="Clique e comece a editar..."
            />
          </section>

          <section className="column column-chips">
            <h2>Coluna C · Dados SILIC</h2>
            <p>Arraste um campo para o editor ou clique para copiar o valor.</p>
            <div className="chips-list">
              {adaptedSchema.silicFields.map((field) => (
                <SilicChip
                  key={field.id}
                  field={field}
                  value={formData[field.id]}
                  onInsert={insertFieldIntoEditor}
                />
              ))}
            </div>
          </section>
        </div>
      </div>

      <DragOverlay>
        {activeField ? (
          <ChipPreview field={activeField} value={formData[activeField.id]} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
