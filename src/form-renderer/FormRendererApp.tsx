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
// @ts-ignore - mammoth doesn't ship full TS types for browser build
import mammoth from 'mammoth/mammoth.browser';
// Paged.js for A4-like pagination preview
import { Previewer } from 'pagedjs';

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
  const [focusOnlyEditor, setFocusOnlyEditor] = useState(false);
  const [editorFullscreen, setEditorFullscreen] = useState(false);

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

  const pasteHtml = useCallback((html: string) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(html);
      setEditorContent(quill.root.innerHTML);
    } else {
      setEditorContent(html);
    }
  }, []);

  const importDocxFromUrl = useCallback(async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Falha ao carregar DOCX (${res.status})`);
    const arrayBuffer = await res.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    pasteHtml(result.value);
  }, [pasteHtml]);

  const onSelectDocx: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    pasteHtml(result.value);
  };

  const [showPagination, setShowPagination] = useState(false);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margins, setMargins] = useState({ top: 20, right: 20, bottom: 20, left: 20 });

  const openPagination = useCallback(async (autoPrint = false) => {
    setShowPagination(true);
    // Give modal time to mount
    setTimeout(async () => {
      const mount = canvasRef.current;
      if (!mount) return;
      mount.innerHTML = '';
      const source = document.createElement('div');
      source.innerHTML = editorContent;
      const style = document.createElement('style');
      const { top, right, bottom, left } = margins;
      style.textContent = `
        @page {
          size: A4 ${orientation};
          margin: ${top}mm ${right}mm ${bottom}mm ${left}mm;
          @bottom-center { content: counter(page) " / " counter(pages); font-size: 10pt; color: #475569; }
        }
        body { counter-reset: page 1; }
      `;
      source.prepend(style);
      const previewer = new Previewer();
      await previewer.preview(source, [], mount);
      if (autoPrint) {
        setTimeout(() => window.print(), 0);
      }
    }, 0);
  }, [editorContent, orientation, margins]);

  const closePagination = useCallback(() => setShowPagination(false), []);
  const printPagination = useCallback(() => window.print(), []);
  

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

        <div className={`renderer-columns ${focusOnlyEditor ? 'focus-only-editor' : ''}`}>
          <section className={`column column-preview ${focusOnlyEditor ? 'hidden-column' : ''}`}>
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
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <button type="button" onClick={() => importDocxFromUrl('edital-base.docx')}>
                Carregar texto base do DOCX (repo)
              </button>
              <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                <span>ou selecionar arquivo .docx:</span>
                <input type="file" accept=".docx" onChange={onSelectDocx} />
              </label>
              <span style={{ flex: 1 }} />
              <button type="button" onClick={() => setFocusOnlyEditor((v)=>!v)}>
                {focusOnlyEditor ? 'Mostrar colunas' : 'Focar no texto'}
              </button>
              <button type="button" onClick={() => setEditorFullscreen(true)}>
                Tela cheia
              </button>
              <label style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                Tamanho: A4
              </label>
              <label style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                Orientação:
                <select value={orientation} onChange={(e) => setOrientation(e.target.value as 'portrait'|'landscape')}>
                  <option value="portrait">Retrato</option>
                  <option value="landscape">Paisagem</option>
                </select>
              </label>
              <label style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>Margens (mm):</label>
              <input style={{ width: 56 }} type="number" min={5} max={50} value={margins.top} onChange={(e)=>setMargins((m)=>({ ...m, top: Number(e.target.value) }))} title="Superior" />
              <input style={{ width: 56 }} type="number" min={5} max={50} value={margins.right} onChange={(e)=>setMargins((m)=>({ ...m, right: Number(e.target.value) }))} title="Direita" />
              <input style={{ width: 56 }} type="number" min={5} max={50} value={margins.bottom} onChange={(e)=>setMargins((m)=>({ ...m, bottom: Number(e.target.value) }))} title="Inferior" />
              <input style={{ width: 56 }} type="number" min={5} max={50} value={margins.left} onChange={(e)=>setMargins((m)=>({ ...m, left: Number(e.target.value) }))} title="Esquerda" />
              <button type="button" onClick={() => openPagination(true)}>Exportar PDF (A4)</button>
            </div>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={editorContent}
              onChange={setEditorContent}
              placeholder="Clique e comece a editar..."
            />
            <button className="scroll-top-btn" type="button" onClick={() => quillRef.current?.getEditor()?.root?.scrollTo({ top: 0, behavior: 'smooth' })}>Topo</button>
          </section>

          <section className={`column column-chips ${focusOnlyEditor ? 'hidden-column' : ''}`}>
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

      {showPagination && (
        <div className="pagination-backdrop" onClick={closePagination}>
          <div className="pagination-modal" onClick={(e) => e.stopPropagation()}>
            <header>
              <strong>Pré-visualização paginada (A4)</strong>
              <span style={{ flex: 1 }} />
              <button onClick={printPagination}>Imprimir / PDF</button>
              <button onClick={closePagination}>Fechar</button>
            </header>
            <div ref={canvasRef} className="pagination-canvas" />
          </div>
        </div>
      )}
      {editorFullscreen && (
        <div className="editor-backdrop" onClick={() => setEditorFullscreen(false)}>
          <div className="editor-modal" onClick={(e)=>e.stopPropagation()}>
            <header>
              <strong>Editor em tela cheia</strong>
              <span style={{ flex: 1 }} />
              <button onClick={() => setEditorFullscreen(false)}>Fechar</button>
            </header>
            <div className="editor-body">
              <ReactQuill
                theme="snow"
                value={editorContent}
                onChange={setEditorContent}
                placeholder="Clique e comece a editar..."
              />
            </div>
          </div>
        </div>
      )}
    </DndContext>
  );
}
