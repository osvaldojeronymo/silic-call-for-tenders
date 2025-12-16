export type QuickNote = {
  id: string;
  title: string;
  html: string;
};

export const quickNotes: QuickNote[] = [
  {
    id: 'nota-ceis-sicaf',
    title: 'Nota integração CEIS/SICAF',
    html:
      '<p><strong>Nota:</strong> A verificação de sanções no CEIS e no SICAF deverá ocorrer previamente à adjudicação, nos termos da legislação vigente.</p>'
  },
  {
    id: 'nota-consulta-pj-tcu',
    title: 'Consulta Pessoa Jurídica — TCU',
    html:
      '<p><strong>Nota:</strong> Recomenda-se consulta consolidada de Pessoa Jurídica no TCU para aferição de eventuais impedimentos de contratar.</p>'
  },
  {
    id: 'nota-sobrepreco',
    title: 'Sobrepreço x valor global',
    html:
      '<p><strong>Nota:</strong> Em caso de indícios de sobrepreço, observar diretrizes para análise e saneamento, sem extrapolar o valor global estimado.</p>'
  },
  {
    id: 'nota-servico-exclusivo',
    title: 'Serviços em regime de dedicação exclusiva',
    html:
      '<p><strong>Nota:</strong> Serviços com dedicação exclusiva de mão de obra devem observar a legislação específica, inclusive quanto à fiscalização contratual.</p>'
  }
];
