import { Imovel, Locador } from '../types/index.js';

/**
 * Interface para os dados brutos do SAP (estrutura REISCNBP + REISBU)
 */
interface DadosSAPBruto {
  imoveis: Array<{
    id: string;
    contrato: {
      numero: number;
      denominacao: string;
      tipoContrato: string;
      inicioContrato: string;
      fimValidade: string;
      rescisaoEm: string | null;
      parceiroNegocio: number;
    };
    edificio: {
      codigo: number;
      denominacao: string;
      status: string;
      cep: string;
      local: string;
      rua: string;
      numero: number;
      bairro: string;
      regiao: string;
      inicioValidadeObj: string;
      objetoValidoAte: string;
      tipoEdificio: {
        codigo: number;
        nome: string;
      };
      criadoPor: string;
      chavePais: string;
      endereco: string;
      estadoConservacao: string;
      funcao: {
        codigo: string;
        nome: string;
      };
      denominacaoImovel: string;
      utilizacaoPrincipal: string;
      tipoApolice: number;
      inscricaoIPTU: string;
      numeroITR: string;
      grupoAutorizacoes: number;
    };
    locadorId: string;
  }>;
  locadores: Array<{
    id: string;
    parceiroNegocio: number;
    tipoIdFiscal: string;
    numeroIdFiscal: string;
    nome: string;
    nomeEndereco: string;
    funcaoPN: string;
    tipo: 'fisica' | 'juridica';
    endereco: {
      rua: string;
      numero: number;
      bairro: string;
      cidade: string;
      regiao: string;
      cep: string;
    };
    email: string;
    telefone: string;
    telefoneCelular: string;
    inicioRelacao: string;
    fimRelacao: string;
    status: string;
  }>;
  metadados: {
    dataGeracao: string;
    fonte: string;
    versao: string;
    totalImoveis: number;
    totalLocadores: number;
    estrutura: string;
  };
}

/**
 * Interface para os dados processados
 */
interface DadosSAP {
  imoveis: Imovel[];
  locadores: Locador[];
  metadados: {
    dataImportacao: string;
    fonte: string;
    totalImoveis: number;
    totalLocadores: number;
  };
}

/**
 * Classe para gerenciar importação de dados do SAP
 */
export class SAPDataLoader {
  // Em desenvolvimento, Vite serve arquivos de public/ com o base path
  private static readonly DATA_PATH = '/silic-input-doc/dados-sap.json';
  
  /**
   * Obtém o caminho correto baseado no ambiente
   */
  private static obterCaminho(): string {
    // Retorna o caminho com o base path do Vite
    return this.DATA_PATH;
  }

  /**
   * Converte data de string DD/MM/YYYY para formato ISO
   */
  private static converterData(dataStr: string): string {
    if (!dataStr) return '';
    try {
      const partes = dataStr.split('/');
      if (partes.length === 3) {
        return `${partes[2]}-${partes[1]}-${partes[0]}`;
      }
      return dataStr;
    } catch {
      return dataStr;
    }
  }

  /**
   * Mapeia dados brutos do SAP para estrutura da aplicação
   */
  private static mapearDadosSAP(dadosBrutos: DadosSAPBruto): DadosSAP {
    console.log('🔄 Mapeando dados do SAP para estrutura da aplicação...');

    // Mapear locadores
    const locadores: Locador[] = dadosBrutos.locadores.map(loc => ({
      id: loc.id,
      nome: loc.nome,
      tipo: loc.tipo,
      documento: loc.numeroIdFiscal,
      email: loc.email || undefined,
      telefone: loc.telefone || undefined,
      endereco: {
        logradouro: loc.endereco.rua,
        numero: loc.endereco.numero.toString(),
        bairro: loc.endereco.bairro,
        cidade: loc.endereco.cidade,
        estado: loc.endereco.regiao,
        cep: loc.endereco.cep
      },
      status: loc.status as 'ativo' | 'inativo',
      dataRegistro: new Date().toISOString()
    }));

    // Mapear imóveis
    const imoveis: Imovel[] = dadosBrutos.imoveis.map(im => {
      // Extrair cidade e estado
      const cidade = im.edificio.local;
      const estado = im.edificio.regiao;
      
      // Determinar tipo baseado no tipo de edifício
      let tipo: 'residencial' | 'comercial' | 'terreno' | 'industrial' = 'comercial';
      const tipoEdificio = im.edificio.tipoEdificio.nome.toLowerCase();
      if (tipoEdificio.includes('terreno')) tipo = 'terreno';
      else if (tipoEdificio.includes('galpão')) tipo = 'industrial';
      else if (tipoEdificio.includes('casa')) tipo = 'residencial';
      
      // Mapear status
      let status: 'ativo' | 'prospeccao' | 'mobilizacao' | 'desmobilizacao' = 'ativo';
      const statusEdificio = im.edificio.status.toLowerCase();
      if (statusEdificio.includes('prospecção')) status = 'prospeccao';
      else if (statusEdificio.includes('mobilização') && !statusEdificio.includes('des')) status = 'mobilizacao';
      else if (statusEdificio.includes('desmobilização')) status = 'desmobilizacao';
      else if (statusEdificio.includes('ativo')) status = 'ativo';
      
      return {
        id: im.id,
        codigo: im.contrato.numero.toString(),
        denominacao: im.contrato.denominacao,
        tipoContrato: im.contrato.tipoContrato,
        utilizacaoPrincipal: im.edificio.utilizacaoPrincipal,
        fimValidade: im.contrato.fimValidade,
        endereco: im.edificio.rua,
        bairro: im.edificio.bairro,
        cidade: cidade,
        estado: estado,
        cep: im.edificio.cep,
        tipo: tipo,
        status: status,
        descricao: im.contrato.denominacao,
        caracteristicas: {
          tipoContrato: im.contrato.tipoContrato,
          utilizacaoPrincipal: im.edificio.utilizacaoPrincipal,
          inicioContrato: im.contrato.inicioContrato,
          fimValidade: im.contrato.fimValidade,
          inscricaoIPTU: im.edificio.inscricaoIPTU,
          numeroITR: im.edificio.numeroITR,
          tipoEdificio: im.edificio.tipoEdificio.nome,
          funcao: im.edificio.funcao.nome,
          estadoConservacao: im.edificio.estadoConservacao
        },
        locadorId: im.locadorId,
        dataRegistro: new Date().toISOString()
      };
    });

    console.log(`✅ Mapeamento concluído: ${imoveis.length} imóveis, ${locadores.length} locadores`);

    return {
      imoveis,
      locadores,
      metadados: {
        dataImportacao: dadosBrutos.metadados.dataGeracao,
        fonte: dadosBrutos.metadados.fonte,
        totalImoveis: dadosBrutos.metadados.totalImoveis,
        totalLocadores: dadosBrutos.metadados.totalLocadores
      }
    };
  }

  /**
   * Carrega dados do arquivo JSON gerado a partir do SAP
   */
  static async carregarDados(): Promise<DadosSAP | null> {
    try {
      const caminho = this.obterCaminho();
      console.log('🔄 Carregando dados do SAP...');
      console.log(`   📁 Caminho: ${caminho}`);
      
      const response = await fetch(caminho);
      
      if (!response.ok) {
        console.warn('⚠️ Arquivo de dados SAP não encontrado. Usando dados demo.');
        console.warn(`   Status: ${response.status} ${response.statusText}`);
        return null;
      }

      const dadosBrutos: DadosSAPBruto = await response.json();
      
      // Mapear dados para estrutura da aplicação
      const dados = this.mapearDadosSAP(dadosBrutos);
      
      console.log('✅ Dados do SAP carregados com sucesso!');
      console.log(`   📊 ${dados.metadados.totalImoveis} imóveis`);
      console.log(`   👥 ${dados.metadados.totalLocadores} locadores`);
      console.log(`   📅 Geração: ${new Date(dados.metadados.dataImportacao).toLocaleString('pt-BR')}`);
      console.log(`   🏷️ Fonte: ${dados.metadados.fonte}`);
      
      return dados;
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados do SAP:', error);
      console.error('   Detalhes:', error);
      return null;
    }
  }

  /**
   * Verifica se existem dados do SAP disponíveis
   */
  static async temDadosDisponiveis(): Promise<boolean> {
    try {
      const response = await fetch(this.DATA_PATH, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Retorna estatísticas dos dados carregados
   */
  static obterEstatisticas(dados: DadosSAP): {
    totalImoveis: number;
    porTipo: Record<string, number>;
    porStatus: Record<string, number>;
    totalLocadores: number;
    porTipoLocador: Record<string, number>;
  } {
    const stats = {
      totalImoveis: dados.imoveis.length,
      porTipo: {} as Record<string, number>,
      porStatus: {} as Record<string, number>,
      totalLocadores: dados.locadores.length,
      porTipoLocador: {} as Record<string, number>
    };

    // Estatísticas de imóveis
    dados.imoveis.forEach(imovel => {
      stats.porTipo[imovel.tipo] = (stats.porTipo[imovel.tipo] || 0) + 1;
      stats.porStatus[imovel.status] = (stats.porStatus[imovel.status] || 0) + 1;
    });

    // Estatísticas de locadores
    dados.locadores.forEach(locador => {
      stats.porTipoLocador[locador.tipo] = (stats.porTipoLocador[locador.tipo] || 0) + 1;
    });

    return stats;
  }

  /**
   * Formata informações dos dados para exibição
   */
  static formatarInfo(dados: DadosSAP): string {
    const stats = this.obterEstatisticas(dados);
    
    let info = `📊 Dados do SAP (${dados.metadados.fonte})\n`;
    info += `📅 Importado em: ${new Date(dados.metadados.dataImportacao).toLocaleString('pt-BR')}\n\n`;
    
    info += `🏢 IMÓVEIS (${stats.totalImoveis} total):\n`;
    Object.entries(stats.porTipo).forEach(([tipo, count]) => {
      info += `   • ${tipo}: ${count}\n`;
    });
    
    info += `\n📈 STATUS:\n`;
    Object.entries(stats.porStatus).forEach(([status, count]) => {
      info += `   • ${status}: ${count}\n`;
    });
    
    info += `\n👥 LOCADORES (${stats.totalLocadores} total):\n`;
    Object.entries(stats.porTipoLocador).forEach(([tipo, count]) => {
      info += `   • ${tipo === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}: ${count}\n`;
    });
    
    return info;
  }
}
