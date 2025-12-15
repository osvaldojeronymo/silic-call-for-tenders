// Tipos para o sistema SILIC 2.0

export interface Imovel {
  id: string;
  codigo: string;
  denominacao: string;  // Denominação do contrato
  tipoContrato?: string;  // Tipo do contrato (ex: "Contrato de Locação - Imóveis")
  utilizacaoPrincipal?: string;  // Utilização principal do imóvel
  fimValidade?: string;  // Data de fim da validade do contrato
  endereco: string;
  bairro: string;
  cidade: string;
  cep: string;
  estado: string;
  tipo: 'residencial' | 'comercial' | 'terreno' | 'industrial';
  status: 'ativo' | 'prospeccao' | 'mobilizacao' | 'desmobilizacao';
  area?: number;
  valor?: number;
  descricao?: string;
  fotos?: string[];
  caracteristicas?: {
    quartos?: number;
    banheiros?: number;
    garagem?: number;
    [key: string]: any;
  };
  locadorId?: string;
  dataRegistro: string;
  dataAtualizacao?: string;

  // Campos adicionais (Banco de dados completo)
  // Módulo Imóvel
  edificio?: string;                 // Edifício
  denominacaoEdificio?: string;      // Denom.edifício
  inicioValidadeObjeto?: string;     // Início validade obj.
  objetoValidoAte?: string;          // Objeto válido até
  tipoEdificioCodigo?: string;       // Tipo de edifício (código numérico)
  criadoPor?: string;                // Criado por (ex: C048007)
  chavePais?: string;                // Chave do país (ex: BR)
  denominacaoEstadoEdificio?: string;// Denominação do estado do edifício (ex: Bom)
  funcao?: string;                   // Função (ex: Z003)
  denominacaoFuncao?: string;        // Denom.função (ex: Atendimento Público)
  regiao?: string;                   // Região (UF)
  tipoAplice?: string;               // Tipo de apólice
  inscrIPTU?: string;                // Inscr. IPTU
  numeroITR?: string;                // Nº ITR
  grupoAutorizacoes?: string;        // Grupo autorizações
  ativoFlag?: boolean;               // Ativo

  // Módulo Contrato/Parceiro vinculados ao imóvel
  contratoCodigo?: string;           // Nº do contrato (ex: 10000011)
  contratoDenominacao?: string;      // Denominação do contrato
  contratoTipo?: string;             // Denom.tipo contrato
  contratoInicio?: string;           // Início do contrato
  contratoFimValidade?: string;      // Fim da validade
  contratoRescisaoEm?: string;       // Rescisão em

  parceiroNegocios?: string;         // Parceiro de negócios (nome/ender.)
  tipoIdFiscal?: 'CPF' | 'CNPJ';     // Tipo ID Fiscal
  numeroIdFiscal?: string;           // NºID fiscal
  denominacaoFuncaoPN?: string;      // Denom.função PN (ex: Proponente Credor)
  inicioRelacao?: string;            // Início da relação
  fimRelacao?: string;               // Fim da relação
  ruaPN?: string;                    // Rua (PN)
  numeroPN?: string;                 // Nº (PN)
  bairroPN?: string;                 // Bairro (PN)
  localPN?: string;                  // Local (PN)
  regiaoPN?: string;                 // Região (PN)
  cepPN?: string;                    // Código postal (PN)
  emailPN?: string;                  // Endereço de e-mail (PN)
  telefonePN?: string;               // Nº telefone (PN)
  celularPN?: string;                // Telefone celular (PN)
}

export interface Locador {
  id: string;
  nome: string;
  tipo: 'fisica' | 'juridica';
  documento: string; // CPF ou CNPJ
  email?: string;
  telefone?: string;
  endereco?: {
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  };
  status: 'ativo' | 'inativo';
  dataRegistro: string;
  dataAtualizacao?: string;
}

export interface FiltroImoveis {
  busca?: string;
  tipo?: string;
  status?: string;
  cidade?: string;
  valorMin?: number;
  valorMax?: number;
}

export interface FiltroLocadores {
  busca?: string;
  tipo?: string;
  status?: string;
}

export interface DashboardStats {
  totalImoveis: number;
  imoveisAtivos: number;
  imoveisProspeccao: number;
  imoveisMobilizacao: number;
  imoveisDesmobilizacao: number;
  totalLocadores: number;
}

export interface PaginationConfig {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export type VisualizationMode = 'table' | 'cards';

// Eventos customizados
export interface SilicEventDetail {
  imovel?: Imovel;
  locador?: Locador;
  action?: string;
}

export interface SilicEvent extends CustomEvent {
  detail: SilicEventDetail;
}

// Dados de contrato editáveis no modal
export interface ContratoEdit {
  numero?: string;            // 8 dígitos
  denominacao?: string;       // texto
  tipoEdificio?: string;      // 2 dígitos
  criadoPor?: string;         // 1 letra + 6 dígitos
  inicio?: string;            // DD/MM/AAAA
  fimValidade?: string;       // DD/MM/AAAA
  rescisao?: string;          // DD/MM/AAAA
}

export interface ImovelEdit {
  cep?: string;        // 00000-000
  endereco?: string;   // texto
  numero?: string;     // dígitos
  bairro?: string;     // texto
  local?: string;      // cidade
  uf?: string;         // 2 letras
}

export interface LocadorEdit {
  parceiro?: string;
  tipoIdFiscal?: string;
  denominacaoFuncao?: string; // Proponente Credor
  inicioRelacao?: string;     // DD/MM/AAAA
  fimRelacao?: string;        // DD/MM/AAAA
  nome?: string;
  cep?: string;               // 00000-000
  endereco?: string;
  numero?: string;            // dígitos
  bairro?: string;
  local?: string;             // cidade
  uf?: string;                // 2 letras
  email?: string;
  telefoneFixo?: string;      // (00) 0000-0000
  telefoneCelular?: string;   // (00) 00000-0000
}