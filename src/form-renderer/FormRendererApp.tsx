import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { quickNotes } from '../data/notes';

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
  const [collapseA, setCollapseA] = useState(false);
  const [collapseC, setCollapseC] = useState(false);
  const logoUrl = useMemo(() => {
    const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '/');
    return `${base}logo-caixa.svg`;
  }, []);
  const [outline, setOutline] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeOutlineId, setActiveOutlineId] = useState<string | null>(null);

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

  // Ensure headings in the editor have ids and build outline
  const ensureHeadingsAndOutline = useCallback(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const root: HTMLElement = quill.root as any;
    const headings = Array.from(root.querySelectorAll('h1, h2, h3, h4')) as HTMLElement[];
    const items: { id: string; text: string; level: number }[] = [];
    headings.forEach((el, idx) => {
      if (!el.id) el.id = `h-${idx + 1}`;
      const level = Number(el.tagName.substring(1));
      items.push({ id: el.id, text: el.innerText.trim() || `Seção ${idx + 1}`, level });
    });
    setOutline(items);

    // Track active heading with IntersectionObserver
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop);
        if (vis[0]) setActiveOutlineId((vis[0].target as HTMLElement).id);
      },
      { root: root.parentElement || undefined, threshold: 0.1 }
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const cleanup = ensureHeadingsAndOutline();
    return cleanup;
  }, [editorContent, ensureHeadingsAndOutline]);

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
  const applyHighlight = useCallback((kind: 'alteracao' | 'mp' | 'srp' | 'clear') => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const colors: Record<string, string | undefined> = {
      alteracao: '#dbeafe',
      mp: '#dcfce7',
      srp: '#fef3c7',
      clear: undefined
    };
    const color = colors[kind];
    quill.format('background', color as any);
  }, []);

  const insertNote = useCallback((html: string) => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const sel = quill.getSelection(true);
    const index = sel ? sel.index : quill.getLength() - 1;
    quill.clipboard.dangerouslyPasteHTML(index, html);
    setEditorContent(quill.root.innerHTML);
  }, []);
  

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
      <div className="form-renderer">
        <div className="app-banner">
          <div className="wrap">
            <div className="brand">
              <div className="logo-mark" aria-hidden>
                <img className="logo-img" src={logoUrl} alt="CAIXA" />
              </div>
              <div>
                <h1 className="banner-title">SILIC 2.0</h1>
                <p className="banner-subtitle">Protótipo - Gerador de Documento</p>
              </div>
            </div>
            <a
              className="banner-button"
              href="https://osvaldojeronymo.github.io/silic-portal-imoveis/"
              rel="noopener noreferrer"
            >
              Voltar ao Portal de Imóveis
            </a>
          </div>
        </div>
        <header className="renderer-header">
          <div />
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

        <div className={`renderer-columns ${focusOnlyEditor ? 'focus-only-editor' : ''} ${collapseA ? 'collapsed-a' : ''} ${collapseC ? 'collapsed-c' : ''}`}>
          <section className={`column column-preview ${focusOnlyEditor ? 'hidden-column' : ''} ${collapseA ? 'collapsed' : ''}`}>
            <header className="column-header">
              <h2>Coluna A · Formulário</h2>
              <button className="column-toggle" type="button" onClick={() => setCollapseA((v) => !v)}>
                {collapseA ? 'Expandir' : 'Retrair'}
              </button>
            </header>
            <div className="column-body accordion-list">
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
            <div className="editor-legend">
              <span><span className="legend-dot dot-alteracao" /> Textos Alterados</span>
              <span><span className="legend-dot dot-mp" /> Margem de Preferência</span>
              <span><span className="legend-dot dot-srp" /> SRP</span>
              <span style={{ flex: 1 }} />
              <div className="editor-tools">
                <button type="button" onClick={() => applyHighlight('alteracao')}>Marcar Alteração</button>
                <button type="button" onClick={() => applyHighlight('mp')}>Marcar Margem Pref.</button>
                <button type="button" onClick={() => applyHighlight('srp')}>Marcar SRP</button>
                <button type="button" onClick={() => applyHighlight('clear')}>Remover marcação</button>
              </div>
            </div>
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

          <section className={`column column-chips ${focusOnlyEditor ? 'hidden-column' : ''} ${collapseC ? 'collapsed' : ''}`}>
            <header className="column-header">
              <h2>Coluna C · Dados SILIC</h2>
              <button className="column-toggle" type="button" onClick={() => setCollapseC((v) => !v)}>
                {collapseC ? 'Expandir' : 'Retrair'}
              </button>
            </header>
            <aside className="column-body editor-outline" aria-label="Sumário">
              <h3>Sumário</h3>
              <ul className="outline-list">
                {outline.length === 0 && <li style={{ color: '#64748b' }}>Sem títulos (H1–H4)</li>}
                {outline.map((it) => (
                  <li
                    key={it.id}
                    className={`outline-item outline-lv-${it.level} ${activeOutlineId === it.id ? 'active' : ''}`}
                    onClick={() => {
                      const el = quillRef.current?.getEditor()?.root.querySelector(`#${it.id}`) as HTMLElement | null;
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    {it.text}
                  </li>
                ))}
              </ul>
            </aside>
            <div className="column-body notes-panel">
              {quickNotes.map((n) => (
                <div key={n.id} className="note-item">
                  <strong>{n.title}</strong>
                  <button type="button" onClick={() => insertNote(n.html)}>Inserir</button>
                </div>
              ))}
            </div>
            <p className="column-body">Arraste um campo para o editor ou clique para copiar o valor.</p>
            <div className="column-body chips-list">
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
