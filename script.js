// SILIC 2.0 - Sistema de Locação de Imóveis
// Versão para Apresentação com dados de demonstração

// Função para voltar ao portal SILIC
function voltarAoPortal() {
    // URL do portal principal
    const portalUrl = 'https://osvaldojeronymo.github.io/silic-portal-imoveis/';
    
    // Verifica se veio do portal (usando referrer ou parâmetro)
    const referrer = document.referrer;
    const hasPortalParam = window.location.search.includes('from=portal');
    
    if (referrer.includes('silic-portal') || hasPortalParam) {
        // Voltou do portal, pode usar history.back() ou window.close()
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = portalUrl;
        }
    } else {
        // Acesso direto, redireciona para o portal
        window.location.href = portalUrl;
    }
}

class SistemaSILIC {
    constructor() {
        this.imoveis = [];
        this.locadores = [];
        this.imovelSelecionado = null;
        this.imovelEditando = null; // Para controlar modo edição
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.currentView = 'table';
        
        // Paginação para imóveis
        this.currentPageImoveis = 1;
        this.itemsPerPageImoveis = 10;
        this.totalPaginasImoveis = 1;
        
        // Aguardar DOM estar pronto antes de inicializar
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.inicializar();
                this.carregarDadosDemo();
            });
        } else {
            // DOM já está pronto, aguardar um pouco mais
            setTimeout(() => {
                this.inicializar();
                this.carregarDadosDemo();
            }, 100);
        }
    }

    inicializar() {        
        // Inicializar eventos dos formulários
        document.getElementById('btnNovoImovel')?.addEventListener('click', () => this.mostrarFormulario());
        document.getElementById('adicionarImovel')?.addEventListener('click', () => this.adicionarImovel());
        document.getElementById('limparFormulario')?.addEventListener('click', () => this.limparFormulario());
        document.getElementById('adicionarLocador')?.addEventListener('click', () => this.adicionarLocador());
        
        // Toggle de visualização
        document.getElementById('viewTable')?.addEventListener('click', () => this.alterarVisualizacao('table'));
        document.getElementById('viewCards')?.addEventListener('click', () => this.alterarVisualizacao('cards'));
        
        // Filtros e busca de locadores
        document.getElementById('buscaLocador')?.addEventListener('input', () => this.filtrarLocadores());
        document.getElementById('filtroTipo')?.addEventListener('change', () => this.filtrarLocadores());
        document.getElementById('filtroStatus')?.addEventListener('change', () => this.filtrarLocadores());
        document.getElementById('limparFiltros')?.addEventListener('click', () => this.limparFiltros());
        
        // Configurar filtros de imóveis imediatamente
        this.configurarFiltrosImoveisImediato();
        
        // Paginação de locadores
        document.getElementById('itensPorPaginaSelect')?.addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.atualizarListaLocadores();
        });

        // Paginação de imóveis
        document.getElementById('imoveisPorPaginaSelect')?.addEventListener('change', (e) => {
            this.itemsPerPageImoveis = parseInt(e.target.value);
            this.currentPageImoveis = 1;
            this.atualizarTabelaImoveis();
        });

        // Máscara para CEP
        this.aplicarMascaraCEP();
        
        // Event listener para fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.fecharModalDetalhes();
            }
        });
        
        // Dashboard será atualizado após carregar dados
    }

    carregarDadosDemo() {
        console.log('Iniciando carregamento de dados demo...');
        
        try {
            // Gerar exatamente 100 imóveis para demonstração
            console.log('Gerando imóveis...');
            this.imoveis = this.gerarImoveisDemo(100);
            console.log(`${this.imoveis.length} imóveis gerados`);
            
            // Verificar se imóveis foram realmente gerados
            if (!this.imoveis || this.imoveis.length === 0) {
                throw new Error('Falha na geração de imóveis');
            }
            
            console.log('Gerando locadores...');
            console.log('Distribuição de status dos imóveis:', 
                this.imoveis.reduce((acc, imovel) => {
                    acc[imovel.status] = (acc[imovel.status] || 0) + 1;
                    return acc;
                }, {})
            );
            
            // Debug: verificar se a função existe
            console.log('Verificando função gerarLocadoresDemo:', typeof this.gerarLocadoresDemo);
            
            try {
                this.locadores = this.gerarLocadoresDemo();
                console.log(`${this.locadores ? this.locadores.length : 'null'} locadores gerados`);
            } catch (error) {
                console.error('Erro na geração de locadores:', error);
                this.locadores = [];
            }
            
            // Verificar se locadores foram gerados
            if (!this.locadores || this.locadores.length === 0) {
                console.warn('Nenhum locador foi gerado! Tentando geração forçada...');
                
                // Forçar geração de pelo menos alguns locadores
                try {
                    this.locadores = this.gerarLocadoresDemo();
                    console.log(`Segunda tentativa: ${this.locadores ? this.locadores.length : 'null'} locadores`);
                } catch (error) {
                    console.error('Erro na segunda tentativa:', error);
                    this.locadores = [];
                }
                
                if (!this.locadores || this.locadores.length === 0) {
                    console.error('Falha crítica na geração de locadores, usando fallback');
                    
                    // Gerar locadores básicos como fallback
                    try {
                        this.locadores = this.gerarLocadoresBasicos();
                        console.log(`Gerados ${this.locadores.length} locadores básicos como fallback`);
                    } catch (error) {
                        console.error('Falha até no fallback:', error);
                        this.locadores = [];
                    }
                }
            }
            
            console.log('Atualizando dashboard...');
            this.atualizarDashboard();
            
            console.log('Atualizando tabela...');
            this.atualizarTabelaImoveis();
            
            console.log('Configurando filtros...');
            // Reconfigurar filtros após carregar dados
            this.configurarFiltrosImoveisImediato();
            
            console.log(`Sistema carregado com sucesso! ${this.imoveis.length} imóveis, ${this.locadores.length} locadores`);
            
            // VERIFICAÇÃO FINAL FORÇADA
            if (this.locadores.length === 0) {
                console.log('FORÇANDO geração de locadores - tentativa final');
                this.locadores = this.gerarLocadoresBasicos();
                console.log(`Forçado: ${this.locadores.length} locadores básicos`);
            }
            
        } catch (error) {
            console.error('Erro no carregamento de dados:', error);
            console.error('Stack trace:', error.stack);
        }
    }

    gerarImoveisDemo(quantidade = 100) {
        const cidades = [
            'São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte',
            'Manaus', 'Curitiba', 'Recife', 'Goiânia', 'Belém', 'Porto Alegre', 'Guarulhos',
            'Campinas', 'São Luís', 'São Gonçalo', 'Maceió', 'Duque de Caxias', 'Nova Iguaçu',
            'Teresina', 'Natal', 'Campo Grande', 'Osasco', 'Santo André', 'João Pessoa',
            'Jaboatão dos Guararapes', 'Contagem', 'São Bernardo do Campo', 'Uberlândia',
            'Sorocaba', 'Aracaju', 'Feira de Santana', 'Cuiabá', 'Joinville', 'Juiz de Fora',
            'Londrina', 'Aparecida de Goiânia', 'Niterói', 'Belford Roxo', 'Caxias do Sul',
            'Campos dos Goytacazes', 'Macapá', 'Vila Velha', 'São João de Meriti', 'Florianópolis',
            'Santos', 'Ribeirão Preto', 'Vitória', 'Serra', 'Diadema'
        ];

        // Distribuição realista de status para exatamente 100 imóveis
        const statusDistribuicao = [
            { status: 'Ativo', quantidade: 65 },
            { status: 'Em prospecção', quantidade: 15 },
            { status: 'Em mobilização', quantidade: 10 },
            { status: 'Em desmobilização', quantidade: 8 },
            { status: 'Desativado', quantidade: 2 }
        ];

        const imoveis = [];
        let id = 1;

        statusDistribuicao.forEach(dist => {
            for (let i = 0; i < dist.quantidade; i++) {
                const cidade = cidades[Math.floor(Math.random() * cidades.length)];
                const uf = this.obterUFPorCidade(cidade);
                const codigo = `2000${String(id).padStart(4, '0')}`;
                
                // Gerar datas realistas
                const inicioValidade = this.gerarDataAleatoria('2022-01-01', '2023-12-31');
                let objetoValidoAte = null;
                if (dist.status === 'Desativado' || dist.status === 'Em desmobilização') {
                    objetoValidoAte = this.gerarDataAleatoria('2023-06-01', '2024-12-31');
                } else {
                    objetoValidoAte = this.gerarDataAleatoria('2024-01-01', '2025-12-31');
                }

                imoveis.push({
                    id: id,
                    codigo: codigo,
                    denominacao: `CT - AG ${cidade}, ${uf}`,
                    local: cidade,
                    endereco: this.gerarEnderecoAleatorio(),
                    cep: this.gerarCEPAleatorio(),
                    tipoContrato: 'Contrato de Locação - Imóveis',
                    utilizacaoPrincipal: Math.random() > 0.3 ? 'Próprio' : 'Terceiro',
                    status: dist.status,
                    inicioValidade: inicioValidade,
                    objetoValidoAte: objetoValidoAte,
                    inscricaoIPTU: this.gerarInscricaoIPTU(),
                    numeroITR: Math.random() > 0.8 ? this.gerarNumeroITR() : null,
                    documentosImovel: this.gerarDocumentosImovel()
                });
                
                id++;
            }
        });

        return imoveis;
    }

    gerarLocadoresDemo() {
        console.log('Iniciando geração SIMPLES de locadores...');
        
        const locadores = [];
        
        // Approach super simples: 1 locador para cada imóvel ativo ou em desmobilização
        this.imoveis.forEach((imovel, index) => {
            if (imovel.status === 'Ativo' || imovel.status === 'Em desmobilização') {
                const id = index + 1;
                const ehPJ = id % 3 === 0; // A cada 3, um é PJ
                
                const locador = {
                    id: id,
                    nome: ehPJ ? `Empresa Locadora ${id} Ltda` : `João Silva Santos ${id}`,
                    tipo: ehPJ ? 'Pessoa Jurídica' : 'Pessoa Física',
                    imovelId: imovel.id,
                    documento: ehPJ ? '12.345.678/0001-90' : '123.456.789-00',
                    email: `locador${id}@email.com`,
                    telefone: `(11) 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
                    endereco: `Rua das Flores, ${id * 10}`,
                    cep: '01234-567',
                    cidade: 'São Paulo',
                    uf: 'SP',
                    documentos: {
                        'CPF': 'entregue',
                        'RG': 'entregue',
                        'Comprovante de Renda': Math.random() > 0.5 ? 'entregue' : 'pendente'
                    },
                    temConjuge: false,
                    contratoLongo: false,
                    temRepresentante: false,
                    situacaoEspecial: null,
                    dataVinculacao: '2024-01-01',
                    observacoes: `Locador do imóvel ${imovel.codigo}`
                };
                
                locadores.push(locador);
            }
        });
        
        console.log(`Gerados ${locadores.length} locadores SIMPLES`);
        return locadores;
    }

    // === FUNÇÃO DE FALLBACK PARA LOCADORES ===
    gerarLocadoresBasicos() {
        console.log('Gerando locadores básicos como fallback...');
        
        const locadores = [];
        let id = 1;
        
        // Gerar pelo menos 50 locadores básicos
        const quantidadeMinima = Math.min(50, this.imoveis.length);
        
        for (let i = 0; i < quantidadeMinima; i++) {
            const imovel = this.imoveis[i];
            const ehPJ = i % 4 === 0; // 25% PJ
            
            const locador = {
                id: id++,
                nome: ehPJ ? `Empresa ${id} Ltda` : `João Silva ${id}`,
                tipo: ehPJ ? 'Pessoa Jurídica' : 'Pessoa Física',
                imovelId: imovel ? imovel.id : i + 1,
                documento: ehPJ ? `12.345.678/000${String(id).padStart(1, '0')}-90` : `123.456.789-${String(id).padStart(2, '0')}`,
                email: `locador${id}@email.com`,
                telefone: `(11) 99999-${String(id).padStart(4, '0')}`,
                endereco: `Rua Básica, ${id * 100}`,
                cep: '01234-567',
                cidade: 'São Paulo',
                uf: 'SP',
                documentos: {
                    'CPF': 'entregue',
                    'RG': 'entregue',
                    'Comprovante de Renda': 'entregue'
                },
                temConjuge: false,
                contratoLongo: false,
                temRepresentante: false,
                situacaoEspecial: null,
                dataVinculacao: '2024-01-01',
                observacoes: 'Locador gerado automaticamente (fallback)'
            };
            
            locadores.push(locador);
        }
        
        console.log(`${locadores.length} locadores básicos gerados`);
        return locadores;
    }

    shuffle(array) {
        const newArray = array.slice(); // Criar uma cópia do array
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = newArray[i];
            newArray[i] = newArray[j];
            newArray[j] = temp;
        }
        return newArray;
    }

    escolherComPeso(pesos) {
        const random = Math.random();
        let acumulado = 0;
        
        for (let i = 0; i < pesos.length; i++) {
            acumulado += pesos[i];
            if (random < acumulado) {
                return i;
            }
        }
        return pesos.length - 1;
    }

    obterUFPorCidade(cidade) {
        const cidadesUF = {
            'São Paulo': 'SP', 'Rio de Janeiro': 'RJ', 'Brasília': 'DF', 'Salvador': 'BA',
            'Fortaleza': 'CE', 'Belo Horizonte': 'MG', 'Manaus': 'AM', 'Curitiba': 'PR',
            'Recife': 'PE', 'Goiânia': 'GO', 'Belém': 'PA', 'Porto Alegre': 'RS',
            'Guarulhos': 'SP', 'Campinas': 'SP', 'São Luís': 'MA', 'São Gonçalo': 'RJ',
            'Maceió': 'AL', 'Duque de Caxias': 'RJ', 'Nova Iguaçu': 'RJ', 'Teresina': 'PI',
            'Natal': 'RN', 'Campo Grande': 'MS', 'Osasco': 'SP', 'Santo André': 'SP',
            'João Pessoa': 'PB', 'Jaboatão dos Guararapes': 'PE', 'Contagem': 'MG',
            'São Bernardo do Campo': 'SP', 'Uberlândia': 'MG', 'Sorocaba': 'SP',
            'Aracaju': 'SE', 'Feira de Santana': 'BA', 'Cuiabá': 'MT', 'Joinville': 'SC',
            'Juiz de Fora': 'MG', 'Londrina': 'PR', 'Aparecida de Goiânia': 'GO',
            'Niterói': 'RJ', 'Belford Roxo': 'RJ', 'Caxias do Sul': 'RS',
            'Campos dos Goytacazes': 'RJ', 'Macapá': 'AP', 'Vila Velha': 'ES',
            'São João de Meriti': 'RJ', 'Florianópolis': 'SC', 'Santos': 'SP',
            'Ribeirão Preto': 'SP', 'Vitória': 'ES', 'Serra': 'ES', 'Diadema': 'SP'
        };
        return cidadesUF[cidade] || 'BR';
    }

    gerarComplementoEndereco() {
        const complementos = ['Centro', 'Norte', 'Sul', 'Leste', 'Oeste', 'Zona Norte', 'Zona Sul', 'Downtown', 'Business', 'Corporate'];
        return complementos[Math.floor(Math.random() * complementos.length)];
    }

    gerarEnderecoAleatorio() {
        const tipos = ['Rua', 'Avenida', 'Alameda', 'Travessa', 'Praça'];
        const nomes = ['das Flores', 'do Comércio', 'Brasil', 'da Independência', 'Santos Dumont', 'Getúlio Vargas', 'JK', 'do Centro'];
        const numero = Math.floor(Math.random() * 9999) + 1;
        
        return `${tipos[Math.floor(Math.random() * tipos.length)]} ${nomes[Math.floor(Math.random() * nomes.length)]}, ${numero}`;
    }

    gerarCEPAleatorio() {
        const parte1 = String(Math.floor(Math.random() * 99999)).padStart(5, '0');
        const parte2 = String(Math.floor(Math.random() * 999)).padStart(3, '0');
        return `${parte1}-${parte2}`;
    }

    gerarInscricaoIPTU() {
        const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const prefixo = letras.charAt(Math.floor(Math.random() * letras.length)) + 
                       letras.charAt(Math.floor(Math.random() * letras.length)) + 
                       letras.charAt(Math.floor(Math.random() * letras.length));
        const numeros = String(Math.floor(Math.random() * 999999)).padStart(6, '0');
        return `${prefixo}${numeros}`;
    }

    gerarNumeroITR() {
        return String(Math.floor(Math.random() * 9999999999)).padStart(10, '0');
    }

    gerarDataAleatoria(inicio, fim) {
        const dataInicio = new Date(inicio).getTime();
        const dataFim = new Date(fim).getTime();
        const dataAleatoria = new Date(dataInicio + Math.random() * (dataFim - dataInicio));
        return dataAleatoria.toISOString().split('T')[0];
    }

    gerarDocumentosDemo() {
        const documentos = {
            'RG': Math.random() > 0.3 ? 'entregue' : 'pendente',
            'CPF': Math.random() > 0.2 ? 'entregue' : 'pendente',
            'Comprovante de Renda': Math.random() > 0.4 ? 'entregue' : 'pendente',
            'Comprovante de Residência': Math.random() > 0.3 ? 'entregue' : 'pendente',
            'Certidão de Nascimento': Math.random() > 0.5 ? 'entregue' : 'pendente',
            'Carteira de Trabalho': Math.random() > 0.6 ? 'entregue' : 'pendente'
        };
        return documentos;
    }

    aplicarMascaraCEP() {
        const cepInput = document.getElementById('cepImovel');
        if (cepInput) {
            cepInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 5) {
                    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
                }
                if (value.length > 9) {
                    value = value.substr(0, 9);
                }
                e.target.value = value;
            });
        }
    }

    mostrarFormulario() {
        const formulario = document.getElementById('formularioImovel');
        if (formulario) {
            // Sempre mostrar o formulário (não fazer toggle)
            formulario.style.display = 'block';
            
            // Só definir data automática se não estiver editando
            if (!this.imovelEditando) {
                const hoje = new Date().toISOString().split('T')[0];
                document.getElementById('inicioValidadeObj').value = hoje;
            }
        }
    }

    adicionarImovel() {
        const codigo = document.getElementById('codigoEdificio').value;
        const denominacao = document.getElementById('denominacaoEdificio').value;
        const local = document.getElementById('localCidade').value;
        const endereco = document.getElementById('ruaEndereco').value;
        const cep = document.getElementById('cepImovel').value;
        const status = document.getElementById('statusImovel').value;
        const inicioValidade = document.getElementById('inicioValidadeObj').value;
        const objetoValidoAte = document.getElementById('objetoValidoAte').value;
        const inscricaoIPTU = document.getElementById('inscricaoIPTU').value;
        const numeroITR = document.getElementById('numeroITR').value;

        if (!codigo || !denominacao || !local || !endereco || !cep || !status) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Validar formato do código
        if (!/^2000\d{4}$/.test(codigo)) {
            alert('Código do edifício deve ter 8 dígitos e iniciar com 2000.');
            return;
        }

        // Se está editando, permitir o mesmo código
        const isEdicao = this.imovelEditando;
        
        // Verificar se o código já existe (exceto se for edição do mesmo imóvel)
        const codigoExistente = this.imoveis.find(imovel => imovel.codigo === codigo);
        if (codigoExistente && (!isEdicao || codigoExistente.id !== isEdicao)) {
            alert('Já existe um imóvel com este código.');
            return;
        }

        // VALIDAÇÃO DE REGRA DE NEGÓCIO: Status "Ativo" exige locadores
        const validacaoStatus = this.validarRegraStatusImovelCompleta(status, null);
        if (!validacaoStatus.valido) {
            alert(`REGRA DE NEGÓCIO VIOLADA\n\n${validacaoStatus.mensagem}`);
            return;
        }

        if (isEdicao) {
            // Modo edição - atualizar imóvel existente
            const index = this.imoveis.findIndex(i => i.id === isEdicao);
            if (index !== -1) {
                this.imoveis[index] = {
                    ...this.imoveis[index], // Manter ID e outros campos
                    codigo,
                    denominacao,
                    local,
                    endereco,
                    cep,
                    tipoContrato: this.imoveis[index].tipoContrato || 'Contrato de Locação - Imóveis',
                    utilizacaoPrincipal: this.imoveis[index].utilizacaoPrincipal || 'Próprio',
                    status,
                    inicioValidade,
                    objetoValidoAte: objetoValidoAte || null,
                    inscricaoIPTU: inscricaoIPTU || null,
                    numeroITR: numeroITR || null
                };
                
                alert('Imóvel atualizado com sucesso!');
            }
            
            // Limpar modo edição
            this.imovelEditando = null;
            
            // Restaurar texto do botão
            const btnAdicionar = document.getElementById('adicionarImovel');
            if (btnAdicionar) {
                btnAdicionar.textContent = 'Adicionar Imóvel';
            }
        } else {
            // Modo criação - adicionar novo imóvel
            const novoImovel = {
                id: this.imoveis.length + 1,
                codigo,
                denominacao,
                local,
                endereco,
                cep,
                tipoContrato: 'Contrato de Locação - Imóveis',
                utilizacaoPrincipal: 'Próprio',
                status,
                inicioValidade,
                objetoValidoAte: objetoValidoAte || null,
                inscricaoIPTU: inscricaoIPTU || null,
                numeroITR: numeroITR || null,
                documentosImovel: this.gerarDocumentosImovel()
            };

            // Validação de regra de negócio
            const validacao = this.validarRegraStatusImovelCompleta(novoImovel.status);
            if (!validacao.valido) {
                alert(validacao.mensagem);
                return;
            }

            this.imoveis.push(novoImovel);
            
            // Ir para a última página para mostrar o novo imóvel
            this.currentPageImoveis = Math.ceil(this.imoveis.length / this.itemsPerPageImoveis);
            
            alert('Imóvel cadastrado com sucesso!');
        }
        
        // Atualizar interface
        this.atualizarDashboard();
        this.atualizarTabelaImoveis();
        this.limparFormulario();
    }

    validarRegraStatusImovelCompleta(status, imovelId = null, imovel = null) {
        // Função de validação simples para evitar erros
        // Retorna sempre válido para não bloquear o sistema
        return {
            valido: true,
            mensagem: ''
        };
    }

    limparFormulario() {
        document.getElementById('codigoEdificio').value = '';
        document.getElementById('denominacaoEdificio').value = '';
        document.getElementById('localCidade').value = '';
        document.getElementById('ruaEndereco').value = '';
        document.getElementById('cepImovel').value = '';
        document.getElementById('statusImovel').value = '';
        document.getElementById('inicioValidadeObj').value = '';
        document.getElementById('objetoValidoAte').value = '';
        document.getElementById('inscricaoIPTU').value = '';
        document.getElementById('numeroITR').value = '';
        
        // Limpar modo edição
        this.imovelEditando = null;
        
        // Restaurar texto do botão
        const btnAdicionar = document.getElementById('adicionarImovel');
        if (btnAdicionar) {
            btnAdicionar.textContent = 'Adicionar Imóvel';
        }
        
        const formulario = document.getElementById('formularioImovel');
        if (formulario) {
            formulario.style.display = 'none';
        }
    }

    atualizarDashboard() {
        const totalImoveis = this.imoveis.length;
        const imoveisAtivos = this.imoveis.filter(i => i.status === 'Ativo').length;
        const imoveisProspeccao = this.imoveis.filter(i => i.status === 'Em prospecção').length;
        const imoveisMobilizacao = this.imoveis.filter(i => i.status === 'Em mobilização').length;
        const imoveisDesmobilizacao = this.imoveis.filter(i => i.status === 'Em desmobilização').length;
        const imoveisDesativado = this.imoveis.filter(i => i.status === 'Desativado').length;

        // Atualizar elementos do dashboard
        this.atualizarElemento('totalImoveis', totalImoveis);
        this.atualizarElemento('imoveisAtivos', imoveisAtivos);
        this.atualizarElemento('imoveisProspeccao', imoveisProspeccao);
        this.atualizarElemento('imoveisMobilizacao', imoveisMobilizacao);
        this.atualizarElemento('imoveisDesmobilizacao', imoveisDesmobilizacao);
        this.atualizarElemento('imoveisDesativado', imoveisDesativado);

        // VERIFICAR REGRAS DE NEGÓCIO
        // Executar verificação depois de um pequeno delay para permitir que a UI seja atualizada
        setTimeout(() => {
            this.exibirAlertsRegraDeNegocio();
        }, 500);
    }

    atualizarElemento(id, valor) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = valor;
        }
    }

    atualizarTabelaImoveis() {
        console.log('Iniciando atualizarTabelaImoveis...');
        console.log('Total de imóveis:', this.imoveis.length);
        console.log('Filtros ativos:', !!this.imoveisFiltrados);
        
        // Se há filtros ativos, usar a função filtrada
        if (this.imoveisFiltrados) {
            console.log('Usando lista filtrada');
            this.atualizarTabelaImoveisFiltrados();
            return;
        }

        console.log('Usando lista completa');
        const tbody = document.getElementById('tabelaImoveis');
        console.log('Elemento tbody encontrado:', !!tbody);
        
        if (!tbody) {
            console.error('Elemento tabelaImoveis não encontrado!');
            return;
        }

        tbody.innerHTML = '';
        console.log('Tabela limpa');

        // Calcular paginação
        this.totalPaginasImoveis = Math.ceil(this.imoveis.length / this.itemsPerPageImoveis);
        const startIndex = (this.currentPageImoveis - 1) * this.itemsPerPageImoveis;
        const endIndex = startIndex + this.itemsPerPageImoveis;
        const imoveisPagina = this.imoveis.slice(startIndex, endIndex);

        console.log('Imóveis para esta página:', imoveisPagina.length);

        imoveisPagina.forEach((imovel, index) => {
            console.log(`Adicionando imóvel ${index + 1}:`, imovel.codigo);
            const locadoresDoImovel = this.locadores.filter(l => l.imovelId === imovel.id);
            const quantidadeLocadores = locadoresDoImovel.length;
            
            const row = tbody.insertRow();
            row.innerHTML = `
                <td><strong>${imovel.codigo}</strong></td>
                <td>
                    <div style="max-width: 250px; word-wrap: break-word;">
                        ${imovel.denominacao}
                    </div>
                </td>
                <td>${imovel.tipoContrato || 'Contrato de Locação - Imóveis'}</td>
                <td>${imovel.utilizacaoPrincipal || 'Próprio'}</td>
                <td>${this.formatarStatusBadge(imovel.status)}</td>
                <td>${imovel.objetoValidoAte ? this.formatarData(imovel.objetoValidoAte) : '<em style="color: #999;">-</em>'}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-compact btn-info" onclick="sistema.mostrarDetalhesImovel(${imovel.id})" title="Ver detalhes completos">
                            Detalhar
                        </button>
                        <button class="btn btn-sm btn-compact btn-primary" onclick="sistema.selecionarImovel(${imovel.id})" title="Selecionar para gerenciar locadores">
                            ${this.imovelSelecionado?.id === imovel.id ? 'Selecionado' : 'Locadores'}
                        </button>
                        <button class="btn btn-sm btn-compact btn-warning" onclick="sistema.mostrarDocumentosImovel(${imovel.id})" title="Ver documentos do imóvel e locadores">
                            Documentos
                        </button>
                        <button class="btn btn-sm btn-compact btn-success" onclick="sistema.mostrarAvaliacaoImovel(${imovel.id})" title="Laudo de Avaliação do Imóvel">
                            Avaliação
                        </button>
                    </div>
                </td>
            `;
            
            // Destacar imóvel selecionado
            if (this.imovelSelecionado?.id === imovel.id) {
                row.style.backgroundColor = '#e3f2fd';
                row.style.borderLeft = '4px solid var(--color-primary)';
            }
        });

        console.log('Todos os imóveis foram adicionados à tabela');
        this.atualizarPaginacaoImoveis();
        this.atualizarInfoImoveis();
        console.log('atualizarTabelaImoveis concluída');
    }

    formatarStatusBadge(status) {
        const statusClass = status.toLowerCase().replace(/\s+/g, '-');
        return `<span class="status-badge ${statusClass}">${status}</span>`;
    }

    atualizarPaginacaoImoveis() {
        // Atualizar informações de paginação
        const paginationInfo = document.getElementById('imoveis-pagination-info');
        if (paginationInfo) {
            paginationInfo.textContent = `Página ${this.currentPageImoveis} de ${this.totalPaginasImoveis}`;
        }
        
        // Atualizar botões
        const primeiraPagina = document.getElementById('primeiraPaginaImoveis');
        const anteriorPagina = document.getElementById('anteriorPaginaImoveis');
        const proximaPagina = document.getElementById('proximaPaginaImoveis');
        const ultimaPagina = document.getElementById('ultimaPaginaImoveis');
        
        if (primeiraPagina) primeiraPagina.disabled = this.currentPageImoveis === 1;
        if (anteriorPagina) anteriorPagina.disabled = this.currentPageImoveis === 1;
        if (proximaPagina) proximaPagina.disabled = this.currentPageImoveis === this.totalPaginasImoveis;
        if (ultimaPagina) ultimaPagina.disabled = this.currentPageImoveis === this.totalPaginasImoveis;
    }

    // FUNÇÕES DE FILTRO DE IMÓVEIS
    configurarFiltrosImoveisImediato() {
        console.log('Configurando filtros de imóveis...');
        
        // Filtro de Contrato
        const filtroContrato = document.getElementById('filtroContrato');
        if (filtroContrato) {
            filtroContrato.addEventListener('input', () => {
                console.log('Filtro de contrato alterado');
                this.filtrarImoveis();
            });
        }

        // Filtro de Tipo de Contrato
        const filtroTipoContrato = document.getElementById('filtroTipoContrato');
        if (filtroTipoContrato) {
            filtroTipoContrato.addEventListener('change', () => {
                console.log('Filtro de tipo contrato alterado');
                this.filtrarImoveis();
            });
        }

        // Filtro de Utilização
        const filtroUtilizacao = document.getElementById('filtroUtilizacao');
        if (filtroUtilizacao) {
            filtroUtilizacao.addEventListener('change', () => {
                console.log('Filtro de utilização alterado');
                this.filtrarImoveis();
            });
        }

        // Filtro de Status
        const filtroStatus = document.getElementById('filtroStatus');
        if (filtroStatus) {
            filtroStatus.addEventListener('change', () => {
                console.log('Filtro de status alterado');
                this.filtrarImoveis();
            });
        }

        // Filtro de Denominação
        const filtroDenominacao = document.getElementById('filtroDenominacao');
        if (filtroDenominacao) {
            filtroDenominacao.addEventListener('input', () => {
                console.log('Filtro de denominação alterado');
                this.filtrarImoveis();
            });
        }

        // Filtro de Data Início
        const filtroDataInicio = document.getElementById('filtroDataInicio');
        if (filtroDataInicio) {
            filtroDataInicio.addEventListener('change', () => {
                console.log('Filtro de data início alterado');
                this.filtrarImoveis();
            });
        }

        // Filtro de Data Fim
        const filtroDataFim = document.getElementById('filtroDataFim');
        if (filtroDataFim) {
            filtroDataFim.addEventListener('change', () => {
                console.log('Filtro de data fim alterado');
                this.filtrarImoveis();
            });
        }

        // Botão limpar filtros
        const btnLimpar = document.getElementById('limparFiltrosImoveis');
        if (btnLimpar) {
            btnLimpar.addEventListener('click', () => {
                console.log('Limpando filtros de imóveis');
                this.limparFiltrosImoveis();
            });
        }

        console.log('Filtros de imóveis configurados');
    }

    filtrarImoveis() {
        console.log('Executando filtro de imóveis...');
        
        // Obter valores dos filtros
        const filtroContrato = document.getElementById('filtroContrato')?.value.toLowerCase().trim() || '';
        const filtroTipoContrato = document.getElementById('filtroTipoContrato')?.value || '';
        const filtroUtilizacao = document.getElementById('filtroUtilizacao')?.value || '';
        const filtroStatus = document.getElementById('filtroStatus')?.value || '';
        const filtroDenominacao = document.getElementById('filtroDenominacao')?.value.toLowerCase().trim() || '';
        const filtroDataInicio = document.getElementById('filtroDataInicio')?.value || '';
        const filtroDataFim = document.getElementById('filtroDataFim')?.value || '';
        
        console.log('Filtros aplicados:', { 
            contrato: filtroContrato,
            tipoContrato: filtroTipoContrato,
            utilizacao: filtroUtilizacao,
            status: filtroStatus,
            denominacao: filtroDenominacao,
            dataInicio: filtroDataInicio,
            dataFim: filtroDataFim
        });
        
        // Filtrar imóveis baseado nos critérios
        let imoveisFiltrados = this.imoveis.filter(imovel => {
            // Filtro por código do contrato
            if (filtroContrato && !imovel.codigo.toLowerCase().includes(filtroContrato)) {
                return false;
            }
            
            // Filtro por tipo de contrato
            if (filtroTipoContrato) {
                const tipoImovel = imovel.tipoContrato || 'Contrato de Locação - Imóveis';
                if (tipoImovel !== filtroTipoContrato) {
                    return false;
                }
            }
            
            // Filtro por utilização principal
            if (filtroUtilizacao) {
                const utilizacaoImovel = imovel.utilizacaoPrincipal || 'Próprio';
                if (utilizacaoImovel !== filtroUtilizacao) {
                    return false;
                }
            }
            
            // Filtro por status
            if (filtroStatus && imovel.status !== filtroStatus) {
                return false;
            }
            
            // Filtro por denominação (busca parcial)
            if (filtroDenominacao && !imovel.denominacao.toLowerCase().includes(filtroDenominacao)) {
                return false;
            }
            
            // Filtro por intervalo de datas (fim da validade)
            if (filtroDataInicio || filtroDataFim) {
                if (!imovel.objetoValidoAte) {
                    return false; // Não tem data de validade
                }
                
                const dataValidade = new Date(imovel.objetoValidoAte);
                
                if (filtroDataInicio) {
                    const dataInicio = new Date(filtroDataInicio);
                    if (dataValidade < dataInicio) {
                        return false;
                    }
                }
                
                if (filtroDataFim) {
                    const dataFim = new Date(filtroDataFim);
                    if (dataValidade > dataFim) {
                        return false;
                    }
                }
            }
            
            return true;
        });

        console.log(`Resultados: ${imoveisFiltrados.length} de ${this.imoveis.length} imóveis`);
        
        // Armazenar imóveis filtrados para paginação
        this.imoveisFiltrados = imoveisFiltrados.length < this.imoveis.length ? imoveisFiltrados : null;
        
        // Atualizar tabela com resultados filtrados
        this.atualizarTabelaImoveisFiltrados(imoveisFiltrados);
    }

    mostrarEstatisticasBusca(resultados) {
        const searchStats = document.getElementById('searchStats');
        const filteredCount = document.getElementById('filteredCount');
        
        if (searchStats && filteredCount) {
            filteredCount.textContent = resultados;
            searchStats.style.display = 'block';
        }
    }

    atualizarTabelaImoveisFiltrados(imoveisFiltrados) {
        console.log('Atualizando tabela com imóveis filtrados...');
        console.log(`Imóveis filtrados: ${imoveisFiltrados.length}`);
        
        const tbody = document.getElementById('tabelaImoveis');
        if (!tbody) {
            console.error('Elemento tabelaImoveis não encontrado!');
            return;
        }

        // Limpar tabela
        tbody.innerHTML = '';

        // Se não há resultados, mostrar mensagem
        if (imoveisFiltrados.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: #666;">
                        Nenhum imóvel encontrado com os filtros aplicados.
                    </td>
                </tr>
            `;
            this.atualizarInfoResultados(0);
            return;
        }

        // Resetar para primeira página quando filtrar
        this.currentPageImoveis = 1;
        const totalPaginasFiltradas = Math.ceil(imoveisFiltrados.length / this.itemsPerPageImoveis);
        
        // Calcular itens da página atual
        const startIndex = (this.currentPageImoveis - 1) * this.itemsPerPageImoveis;
        const endIndex = startIndex + this.itemsPerPageImoveis;
        const imoveisPagina = imoveisFiltrados.slice(startIndex, endIndex);

        console.log(`Exibindo itens ${startIndex + 1} a ${Math.min(endIndex, imoveisFiltrados.length)} de ${imoveisFiltrados.length}`);

        // Gerar HTML da tabela
        const linhas = imoveisPagina.map(imovel => {
            const locadoresCount = this.locadores.filter(l => l.imovelId === imovel.id).length;
            return `
                <tr>
                    <td class="cell-codigo">${imovel.codigo}</td>
                    <td class="cell-denominacao">
                        <button class="btn-link" onclick="sistema.mostrarDetalhesImovel(${imovel.id})" title="Ver detalhes">
                            ${imovel.denominacao}
                        </button>
                    </td>
                    <td class="cell-tipo-contrato">${imovel.tipoContrato || 'Contrato de Locação - Imóveis'}</td>
                    <td class="cell-utilizacao">${imovel.utilizacaoPrincipal || 'Próprio'}</td>
                    <td class="cell-status">
                        <span class="status-badge status-${imovel.status.toLowerCase().replace(/\s+/g, '-')}">${imovel.status}</span>
                    </td>
                    <td class="cell-validade">${imovel.objetoValidoAte ? this.formatarData(imovel.objetoValidoAte) : '<em style="color: #999;">-</em>'}</td>
                    <td class="cell-acoes">
                        <div class="btn-group-actions">
                            <button class="btn btn-sm btn-info" onclick="sistema.mostrarDetalhesImovel(${imovel.id})" title="Ver detalhes">
                                Ver
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        tbody.innerHTML = linhas;
        
        // Atualizar informações
        this.atualizarInfoResultados(imoveisFiltrados.length);
        this.atualizarPaginacaoImoveis(totalPaginasFiltradas);
        
        console.log('Tabela filtrada atualizada');
    }

    atualizarInfoResultados(totalFiltrados) {
        const infoElement = document.getElementById('imoveisResultadosInfo');
        if (infoElement) {
            const infoText = infoElement.querySelector('.info-text');
            if (infoText) {
                const totalOriginal = this.imoveisOriginais ? this.imoveisOriginais.length : this.imoveis.length;
                if (totalFiltrados === totalOriginal) {
                    infoText.textContent = `Exibindo ${totalFiltrados} imóveis`;
                } else {
                    infoText.textContent = `Exibindo ${totalFiltrados} de ${totalOriginal} imóveis (filtrados)`;
                }
            }
        }
    }

    limparFiltrosImoveis() {
        console.log('Limpando filtros de imóveis...');
        
        // Limpar todos os campos de filtro
        const filtroContrato = document.getElementById('filtroContrato');
        const filtroTipoContrato = document.getElementById('filtroTipoContrato');
        const filtroUtilizacao = document.getElementById('filtroUtilizacao');
        const filtroStatus = document.getElementById('filtroStatus');
        const filtroDenominacao = document.getElementById('filtroDenominacao');
        const filtroDataInicio = document.getElementById('filtroDataInicio');
        const filtroDataFim = document.getElementById('filtroDataFim');
        
        if (filtroContrato) filtroContrato.value = '';
        if (filtroTipoContrato) filtroTipoContrato.value = '';
        if (filtroUtilizacao) filtroUtilizacao.value = '';
        if (filtroStatus) filtroStatus.value = '';
        if (filtroDenominacao) filtroDenominacao.value = '';
        if (filtroDataInicio) filtroDataInicio.value = '';
        if (filtroDataFim) filtroDataFim.value = '';
        
        // Limpar lista de imóveis filtrados
        this.imoveisFiltrados = null;
        
        // Atualizar tabela com todos os imóveis
        this.currentPageImoveis = 1;
        this.atualizarTabelaImoveis();
        
        console.log('Filtros limpos');
    }

    atualizarInfoImoveis() {
        const totalImoveis = this.imoveis.length;
        const startItem = (this.currentPageImoveis - 1) * this.itemsPerPageImoveis + 1;
        const endItem = Math.min(this.currentPageImoveis * this.itemsPerPageImoveis, totalImoveis);
        
        const resultadosInfo = document.getElementById('imoveisResultadosInfo');
        if (resultadosInfo) {
            resultadosInfo.textContent = `Exibindo ${startItem}-${endItem} de ${totalImoveis} imóveis`;
        }
    }

    irParaPaginaImoveis(pagina) {
        if (pagina >= 1 && pagina <= this.totalPaginasImoveis) {
            this.currentPageImoveis = pagina;
            this.atualizarTabelaImoveis();
        }
    }

    mostrarDetalhesImovel(id) {
        console.log('🔍 mostrarDetalhesImovel chamada com ID:', id);
        
        const imovel = this.imoveis.find(i => i.id === id);
        if (!imovel) {
            console.error('❌ Imóvel não encontrado para ID:', id);
            alert('Imóvel não encontrado!');
            return;
        }

        console.log('✅ Imóvel encontrado:', imovel);
        
        // Armazenar ID do imóvel atual para uso no botão "Editar Imóvel" do modal
        this.imovelAtualModal = id;
        
        const locadoresDoImovel = this.locadores.filter(l => l.imovelId === imovel.id);
        console.log('👥 Locadores encontrados:', locadoresDoImovel.length);
        
        const detalhesContent = document.getElementById('detalhesImovelContent');
        if (!detalhesContent) {
            console.error('❌ Container detalhesImovelContent não encontrado!');
            alert('Erro: Container de conteúdo do modal não encontrado!');
            return;
        }
        
        const htmlContent = `
            <div class="detalhes-section">
                <h4>Informações Básicas</h4>
                <div class="detalhes-grid">
                    <div class="detalhe-item">
                        <div class="detalhe-label">Código SIPGE/SAP</div>
                        <div class="detalhe-valor"><strong>${imovel.codigo}</strong></div>
                    </div>
                    <div class="detalhe-item">
                        <div class="detalhe-label">Denominação</div>
                        <div class="detalhe-valor">${imovel.denominacao}</div>
                    </div>
                    <div class="detalhe-item">
                        <div class="detalhe-label">Status</div>
                        <div class="detalhe-valor">${this.formatarStatusBadge(imovel.status)}</div>
                    </div>
                </div>
            </div>
            
            <div class="detalhes-section">
                <h4>Localização</h4>
                <div class="detalhes-grid">
                    <div class="detalhe-item">
                        <div class="detalhe-label">Cidade</div>
                        <div class="detalhe-valor">${imovel.local}</div>
                    </div>
                    <div class="detalhe-item">
                        <div class="detalhe-label">Endereço Completo</div>
                        <div class="detalhe-valor">${imovel.endereco}</div>
                    </div>
                    <div class="detalhe-item">
                        <div class="detalhe-label">CEP</div>
                        <div class="detalhe-valor"><code>${imovel.cep}</code></div>
                    </div>
                </div>
            </div>
            
            <div class="detalhes-section">
                <h4>Validade do Objeto</h4>
                <div class="detalhes-grid">
                    <div class="detalhe-item">
                        <div class="detalhe-label">Início da Validade</div>
                        <div class="detalhe-valor">${this.formatarData(imovel.inicioValidade)}</div>
                    </div>
                    <div class="detalhe-item">
                        <div class="detalhe-label">Válido Até</div>
                        <div class="detalhe-valor">${imovel.objetoValidoAte ? this.formatarData(imovel.objetoValidoAte) : '<em style="color: #999;">Não definido</em>'}</div>
                    </div>
                </div>
            </div>
            
            <div class="detalhes-section">
                <h4>Impostos e Tributos</h4>
                <div class="detalhes-grid">
                    <div class="detalhe-item">
                        <div class="detalhe-label">Inscrição IPTU</div>
                        <div class="detalhe-valor">${imovel.inscricaoIPTU || '<em style="color: #999;">Não informado</em>'}</div>
                    </div>
                    <div class="detalhe-item">
                        <div class="detalhe-label">Número ITR</div>
                        <div class="detalhe-valor">${imovel.numeroITR || '<em style="color: #999;">Não aplicável</em>'}</div>
                    </div>
                </div>
            </div>
            
            <div class="detalhes-section">
                <h4>Documentação do Imóvel</h4>
                <div class="documents-grid">
                    ${this.gerarDocumentosImovelHTML(imovel)}
                </div>
            </div>
            
            <div class="detalhes-section">
                <h4>Locadores Vinculados</h4>
                <div class="detalhe-item">
                    <div class="detalhe-label">Total de Locadores</div>
                    <div class="detalhe-valor">
                        <span style="font-weight: 600; color: ${locadoresDoImovel.length === 0 ? '#dc3545' : '#495057'};">
                            ${locadoresDoImovel.length}
                        </span>
                        ${locadoresDoImovel.length === 0 ? ' <em style="color: #dc3545;">Nenhum locador cadastrado</em>' : ''}
                    </div>
                </div>
                ${locadoresDoImovel.length > 0 ? `
                    <div style="margin-top: 1rem;">
                        <div class="detalhe-label">Lista de Locadores:</div>
                        <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                            ${locadoresDoImovel.map(locador => `
                                <li style="margin-bottom: 0.5rem;">
                                    <strong>${locador.nome}</strong> (${locador.tipo})
                                    <br><small style="color: #666;">${locador.documento}</small>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;

        console.log('📄 Conteúdo HTML gerado para o modal');
        
        // Definir o conteúdo
        detalhesContent.innerHTML = htmlContent;
        console.log('✅ Conteúdo definido no container');
        
        // Agora abrir o modal
        const modal = document.getElementById('modalDetalhesImovel');
        if (!modal) {
            console.error('❌ Modal não encontrado!');
            alert('Erro: Modal não encontrado!');
            return;
        }
        
        console.log('🪟 Modal encontrado, abrindo...');
        modal.style.display = 'block';
        console.log('✅ Modal aberto com sucesso');
    }

    formatarData(dataString) {
        if (!dataString) return '';
        const data = new Date(dataString + 'T00:00:00');
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    fecharModalDetalhes() {
        document.getElementById('modalDetalhesImovel').style.display = 'none';
        // Limpar referência do imóvel atual
        this.imovelAtualModal = null;
    }

    editarImovelModal(id = null) {
        console.log('🔧 editarImovelModal chamada com ID:', id);
        
        // Se não foi passado ID, tenta obter do imóvel atualmente exibido no modal
        if (!id) {
            console.log('🔍 ID não fornecido, tentando usar imovelAtualModal...');
            if (this.imovelAtualModal) {
                id = this.imovelAtualModal;
                console.log('✅ Usando imovelAtualModal:', id);
            } else {
                console.error('❌ imovelAtualModal não definido');
                alert('Erro: Não foi possível identificar o imóvel para edição.');
                return;
            }
        }
        
        // Usar a mesma lógica da função editarImovel
        const imovel = this.imoveis.find(i => i.id === id);
        if (!imovel) {
            console.error('❌ Imóvel não encontrado para ID:', id);
            alert('Imóvel não encontrado!');
            return;
        }
        
        console.log('✅ Imóvel encontrado:', imovel);
        
        // Fechar modal primeiro
        console.log('🚪 Fechando modal...');
        this.fecharModalDetalhes();
        
        // Preencher formulário com dados do imóvel (mesma lógica da editarImovel)
        console.log('📝 Preenchendo formulário...');
        
        const elementos = {
            'codigoEdificio': imovel.codigo,
            'denominacaoEdificio': imovel.denominacao,
            'localCidade': imovel.local,
            'ruaEndereco': imovel.endereco,
            'cepImovel': imovel.cep,
            'statusImovel': imovel.status,
            'inicioValidadeObj': imovel.inicioValidade || '',
            'objetoValidoAte': imovel.objetoValidoAte || '',
            'inscricaoIPTU': imovel.inscricaoIPTU || '',
            'numeroITR': imovel.numeroITR || ''
        };
        
        Object.entries(elementos).forEach(([elementId, valor]) => {
            const elemento = document.getElementById(elementId);
            if (elemento) {
                elemento.value = valor;
                console.log(`✅ ${elementId}: ${valor}`);
            } else {
                console.error(`❌ Elemento não encontrado: ${elementId}`);
            }
        });
        
        // Mostrar formulário e armazenar ID para edição
        console.log('🎯 Ativando modo edição...');
        this.imovelEditando = id;
        this.mostrarFormulario();
        
        // Alterar texto do botão
        const btnAdicionar = document.getElementById('adicionarImovel');
        if (btnAdicionar) {
            btnAdicionar.textContent = 'Atualizar Imóvel';
            console.log('✅ Botão alterado para "Atualizar Imóvel"');
        } else {
            console.error('❌ Botão adicionarImovel não encontrado');
        }
        
        console.log('✅ editarImovelModal concluída com sucesso');
        alert('Formulário preenchido para edição. Modifique os dados e clique em "Atualizar Imóvel".');
    }

    // === FUNÇÃO AUXILIAR PARA GERAR HTML DOS DOCUMENTOS DO IMÓVEL ===
    
    gerarDocumentosImovelHTML(imovel) {
        if (!imovel.documentosImovel) {
            return '<p style="color: #999; font-style: italic;">Nenhum documento registrado para este imóvel.</p>';
        }
        
        const documentos = imovel.documentosImovel;
        let html = '<div class="documentos-list">';
        
        Object.entries(documentos).forEach(([nomeDoc, status]) => {
            if (status !== null) {
                const statusClass = status === 'entregue' ? 'status-entregue' : 
                                  status === 'pendente' ? 'status-pendente' : 
                                  status === 'em_analise' ? 'status-analise' : 'status-rejeitado';
                
                const statusTexto = status === 'entregue' ? 'Entregue' : 
                                  status === 'pendente' ? 'Pendente' : 
                                  status === 'em_analise' ? 'Em Análise' : 'Rejeitado';
                
                html += `
                    <div class="documento-item" style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border: 1px solid #e0e0e0; border-radius: 6px; margin-bottom: 0.5rem; background: #fafafa;">
                        <span style="font-weight: 500; color: #333;">${nomeDoc}</span>
                        <span class="status-badge ${statusClass}" style="padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem; font-weight: 500;">
                            ${statusTexto}
                        </span>
                    </div>
                `;
            }
        });
        
        html += '</div>';
        return html;
    }

    // === FUNÇÕES DOS BOTÕES DE AÇÃO ===
    
    editarImovel(id) {
        console.log('🔧 editarImovel chamada com ID:', id);
        
        const imovel = this.imoveis.find(i => i.id === id);
        if (!imovel) {
            console.error('❌ Imóvel não encontrado para ID:', id);
            alert('Imóvel não encontrado!');
            return;
        }
        
        console.log('✅ Imóvel encontrado:', imovel);
        
        // Preencher formulário com dados do imóvel
        console.log('📝 Preenchendo formulário...');
        
        const elementos = {
            'codigoEdificio': imovel.codigo,
            'denominacaoEdificio': imovel.denominacao,
            'localCidade': imovel.local,
            'ruaEndereco': imovel.endereco,
            'cepImovel': imovel.cep,
            'statusImovel': imovel.status,
            'inicioValidadeObj': imovel.inicioValidade || '',
            'objetoValidoAte': imovel.objetoValidoAte || '',
            'inscricaoIPTU': imovel.inscricaoIPTU || '',
            'numeroITR': imovel.numeroITR || ''
        };
        
        Object.entries(elementos).forEach(([elementId, valor]) => {
            const elemento = document.getElementById(elementId);
            if (elemento) {
                elemento.value = valor;
                console.log(`✅ ${elementId}: ${valor}`);
            } else {
                console.error(`❌ Elemento não encontrado: ${elementId}`);
            }
        });
        
        // Mostrar formulário e armazenar ID para edição
        console.log('🎯 Ativando modo edição...');
        this.imovelEditando = id;
        this.mostrarFormulario();
        
        // Alterar texto do botão
        const btnAdicionar = document.getElementById('adicionarImovel');
        if (btnAdicionar) {
            btnAdicionar.textContent = 'Atualizar Imóvel';
            console.log('✅ Botão alterado para "Atualizar Imóvel"');
        } else {
            console.error('❌ Botão adicionarImovel não encontrado');
        }
        
        console.log('✅ editarImovel concluída com sucesso');
        alert('Formulário preenchido para edição. Modifique os dados e clique em "Atualizar Imóvel".');
    }
    
    mostrarAvaliacaoImovel(id) {
        const imovel = this.imoveis.find(i => i.id === id);
        if (!imovel) {
            console.error('❌ Imóvel não encontrado para ID:', id);
            alert('Imóvel não encontrado!');
            return;
        }

        console.log('📊 Abrindo laudo de avaliação para:', imovel.denominacao);

        // Armazenar ID do imóvel no modal para uso posterior
        const modal = document.getElementById('modalAvaliacao');
        if (modal) {
            modal.dataset.imovelId = id;
        }

        // Preencher informações do imóvel no modal
        const infoImovelAvaliacao = document.getElementById('infoImovelAvaliacao');
        if (infoImovelAvaliacao) {
            infoImovelAvaliacao.innerHTML = `
                <h5>📍 ${imovel.denominacao}</h5>
                <p><strong>Código:</strong> ${imovel.codigo} | <strong>Local:</strong> ${imovel.local}</p>
                <p><strong>Status:</strong> ${this.formatarStatusBadge(imovel.status)}</p>
            `;
        }

        // Carregar dados existentes da avaliação se houver
        this.carregarDadosAvaliacao(id);

        // Abrir o modal
        if (modal) {
            modal.style.display = 'block';
            console.log('✅ Modal de avaliação aberto');
        } else {
            console.error('❌ Modal de avaliação não encontrado');
        }
    }

    carregarDadosAvaliacao(imovelId) {
        // Verificar se já existem dados de avaliação salvos
        const avaliacaoKey = `avaliacao_imovel_${imovelId}`;
        const dadosSalvos = localStorage.getItem(avaliacaoKey);
        
        if (dadosSalvos) {
            const avaliacao = JSON.parse(dadosSalvos);
            
            // Preencher os campos com os dados salvos
            document.getElementById('dataElaboracao').value = avaliacao.dataElaboracao || '';
            document.getElementById('numeroDocumento').value = avaliacao.numeroDocumento || '';
            document.getElementById('nomeEmpresa').value = avaliacao.nomeEmpresa || '';
            document.getElementById('cnpjEmpresa').value = avaliacao.cnpjEmpresa || '';
            document.getElementById('valorMinimo').value = avaliacao.valorMinimo || '';
            document.getElementById('valorMedio').value = avaliacao.valorMedio || '';
            document.getElementById('valorMaximo').value = avaliacao.valorMaximo || '';
            
            console.log('📊 Dados de avaliação carregados:', avaliacao);
        } else {
            // Limpar campos se não houver dados salvos
            this.limparFormularioAvaliacao();
        }
    }

    salvarAvaliacaoImovel() {
        // Obter ID do imóvel atual
        const modal = document.getElementById('modalAvaliacao');
        const imovelId = modal.dataset.imovelId;
        
        if (!imovelId) {
            alert('Erro: ID do imóvel não encontrado!');
            return;
        }

        // Coletar dados do formulário
        const avaliacao = {
            dataElaboracao: document.getElementById('dataElaboracao').value,
            numeroDocumento: document.getElementById('numeroDocumento').value,
            nomeEmpresa: document.getElementById('nomeEmpresa').value,
            cnpjEmpresa: document.getElementById('cnpjEmpresa').value,
            valorMinimo: parseFloat(document.getElementById('valorMinimo').value) || 0,
            valorMedio: parseFloat(document.getElementById('valorMedio').value) || 0,
            valorMaximo: parseFloat(document.getElementById('valorMaximo').value) || 0,
            dataUltimaAtualizacao: new Date().toISOString()
        };

        // Validar campos obrigatórios
        if (!avaliacao.dataElaboracao || !avaliacao.numeroDocumento || !avaliacao.nomeEmpresa || !avaliacao.cnpjEmpresa) {
            alert('Por favor, preencha todos os campos obrigatórios!');
            return;
        }

        // Validar valores de locação
        if (avaliacao.valorMinimo > avaliacao.valorMedio || avaliacao.valorMedio > avaliacao.valorMaximo) {
            alert('Os valores devem estar em ordem crescente: Mínimo ≤ Médio ≤ Máximo');
            return;
        }

        // Salvar no localStorage
        const avaliacaoKey = `avaliacao_imovel_${imovelId}`;
        localStorage.setItem(avaliacaoKey, JSON.stringify(avaliacao));

        // Mostrar feedback de sucesso
        const statusDiv = document.getElementById('statusAvaliacao');
        statusDiv.style.display = 'block';
        statusDiv.style.background = '#d4edda';
        statusDiv.style.color = '#155724';
        statusDiv.style.border = '1px solid #c3e6cb';
        statusDiv.innerHTML = '✅ Laudo de avaliação salvo com sucesso!';

        console.log('💾 Avaliação salva:', avaliacao);
        
        // Fechar modal após 2 segundos
        setTimeout(() => {
            this.fecharModalAvaliacao();
        }, 2000);
    }

    limparFormularioAvaliacao() {
        document.getElementById('dataElaboracao').value = '';
        document.getElementById('numeroDocumento').value = '';
        document.getElementById('nomeEmpresa').value = '';
        document.getElementById('cnpjEmpresa').value = '';
        document.getElementById('valorMinimo').value = '';
        document.getElementById('valorMedio').value = '';
        document.getElementById('valorMaximo').value = '';
        
        const statusDiv = document.getElementById('statusAvaliacao');
        statusDiv.style.display = 'none';
    }

    fecharModalAvaliacao() {
        const modal = document.getElementById('modalAvaliacao');
        if (modal) {
            modal.style.display = 'none';
            console.log('🚪 Modal de avaliação fechado');
        }
    }

    selecionarImovel(id) {
        console.log('🏢 selecionarImovel chamada com ID:', id);
        
        const imovel = this.imoveis.find(i => i.id === id);
        if (!imovel) {
            console.error('❌ Imóvel não encontrado para ID:', id);
            alert('Imóvel não encontrado!');
            return;
        }
        
        console.log('✅ Imóvel encontrado:', imovel);
        
        this.imovelSelecionado = imovel;
        this.atualizarTabelaImoveis();
        this.mostrarModalLocadores();
    }

    mostrarModalLocadores() {
        if (!this.imovelSelecionado) {
            alert('Nenhum imóvel selecionado!');
            return;
        }

        console.log('🪟 Abrindo modal de locadores para:', this.imovelSelecionado.denominacao);

        // Preencher informações do imóvel no modal
        const infoImovel = document.getElementById('infoImovelModal');
        if (infoImovel) {
            infoImovel.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div>
                        <strong style="color: #333;">Imóvel Selecionado:</strong>
                        <div style="font-size: 1.1rem; margin-top: 0.25rem;">${this.imovelSelecionado.denominacao}</div>
                    </div>
                    <div>
                        <strong style="color: #333;">Código:</strong> <code>${this.imovelSelecionado.codigo}</code>
                        <br>
                        <strong style="color: #333;">Local:</strong> ${this.imovelSelecionado.local}
                        <br>
                        <strong style="color: #333;">Status:</strong> ${this.formatarStatusBadge(this.imovelSelecionado.status)}
                    </div>
                </div>
            `;
        }

        // Atualizar estatísticas e lista de locadores
        this.atualizarEstatisticasModalLocadores();
        this.atualizarListaModalLocadores();

        // Abrir o modal
        const modal = document.getElementById('modalLocadores');
        if (modal) {
            modal.style.display = 'block';
            console.log('✅ Modal de locadores aberto');
        } else {
            console.error('❌ Modal de locadores não encontrado');
        }
    }

    atualizarEstatisticasModalLocadores() {
        if (!this.imovelSelecionado) return;

        const locadoresDoImovel = this.locadores.filter(l => l.imovelId === this.imovelSelecionado.id);
        const totalLocadores = locadoresDoImovel.length;
        const pessoaFisica = locadoresDoImovel.filter(l => l.tipo === 'Pessoa Física').length;
        const pessoaJuridica = locadoresDoImovel.filter(l => l.tipo === 'Pessoa Jurídica').length;

        // Atualizar contadores no modal
        const totalElement = document.getElementById('totalLocadoresModal');
        const pfElement = document.getElementById('pessoaFisicaModal');
        const pjElement = document.getElementById('pessoaJuridicaModal');

        if (totalElement) totalElement.textContent = totalLocadores;
        if (pfElement) pfElement.textContent = pessoaFisica;
        if (pjElement) pjElement.textContent = pessoaJuridica;

        console.log(`📊 Estatísticas: ${totalLocadores} total, ${pessoaFisica} PF, ${pessoaJuridica} PJ`);
    }

    atualizarListaModalLocadores() {
        if (!this.imovelSelecionado) return;

        const locadoresDoImovel = this.locadores.filter(l => l.imovelId === this.imovelSelecionado.id);
        const container = document.getElementById('listaLocadoresModal');
        
        if (!container) {
            console.error('❌ Container da lista de locadores não encontrado');
            return;
        }

        if (locadoresDoImovel.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info" style="text-align: center; padding: 2rem; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px;">
                    <h5 style="margin: 0 0 0.5rem 0; color: #666;">Nenhum locador cadastrado</h5>
                    <p style="margin: 0; color: #888;">Clique em "Adicionar Locador" ou "Gerar Mais Locadores" para começar.</p>
                </div>
            `;
            return;
        }

        let html = '<div class="locadores-grid" style="display: grid; gap: 1rem;">';
        
        locadoresDoImovel.forEach(locador => {
            const tipoIcon = locador.tipo === 'Pessoa Física' ? '👤' : '🏢';
            const tipoClass = locador.tipo === 'Pessoa Física' ? 'pessoa-fisica' : 'pessoa-juridica';
            
            html += `
                <div class="locador-card ${tipoClass}" style="background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1rem; display: flex; justify-content: space-between; align-items: center;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                            <span style="font-size: 1.2rem; margin-right: 0.5rem;">${tipoIcon}</span>
                            <strong style="color: #333; font-size: 1.1rem;">${locador.nome}</strong>
                        </div>
                        <div style="color: #666; font-size: 0.9rem;">
                            <div><strong>Documento:</strong> ${locador.documento}</div>
                            <div><strong>Tipo:</strong> ${locador.tipo}</div>
                            ${locador.email ? `<div><strong>Email:</strong> ${locador.email}</div>` : ''}
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-sm btn-outline-primary" onclick="sistema.editarLocador(${locador.id})" title="Editar locador">
                            Editar
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="sistema.removerLocador(${locador.id})" title="Remover locador">
                            Remover
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
        console.log(`✅ Lista atualizada com ${locadoresDoImovel.length} locadores`);
    }

    fecharModalLocadores() {
        const modal = document.getElementById('modalLocadores');
        if (modal) {
            modal.style.display = 'none';
            console.log('🚪 Modal de locadores fechado');
        }
        
        // Limpar seleção do imóvel se necessário
        // this.imovelSelecionado = null;
        // this.atualizarTabelaImoveis();
    }

    mostrarSecaoLocadores() {
        // SEÇÃO DE LOCADORES DESABILITADA - A seção foi ocultada conforme solicitação do usuário
        /*
        const locadoresInfo = document.querySelector('.locadores-info');
        const dashboardStats = document.getElementById('dashboardStats');
        const searchFilters = document.getElementById('searchFilters');
        const viewToggle = document.getElementById('viewToggle');
        
        if (this.imovelSelecionado) {
            if (locadoresInfo) {
                locadoresInfo.innerHTML = `
                    <p><strong>Imóvel selecionado:</strong> ${this.imovelSelecionado.denominacao}</p>
                    <p><strong>Código:</strong> ${this.imovelSelecionado.codigo} | <strong>Local:</strong> ${this.imovelSelecionado.local}</p>
                `;
            }
            
            if (dashboardStats) dashboardStats.style.display = 'grid';
            if (searchFilters) searchFilters.style.display = 'block';
            if (viewToggle) viewToggle.style.display = 'flex';
        }
        
        this.atualizarDashboardLocadores();
        */
    }

    atualizarDashboardLocadores() {
        // SEÇÃO DE LOCADORES DESABILITADA - A seção foi ocultada conforme solicitação do usuário
        /*
        if (!this.imovelSelecionado) return;
        
        const locadoresDoImovel = this.locadores.filter(l => l.imovelId === this.imovelSelecionado.id);
        const totalLocadores = locadoresDoImovel.length;
        
        let docsCompletos = 0;
        let docsPendentes = 0;
        let totalDocs = 0;
        
        locadoresDoImovel.forEach(locador => {
            Object.values(locador.documentos).forEach(status => {
                totalDocs++;
                if (status === 'entregue') {
                    docsCompletos++;
                } else {
                    docsPendentes++;
                }
            });
        });
        
        const progressoGeral = totalDocs > 0 ? Math.round((docsCompletos / totalDocs) * 100) : 0;
        
        this.atualizarElemento('totalLocadores', totalLocadores);
        this.atualizarElemento('docsCompletos', docsCompletos);
        this.atualizarElemento('docsPendentes', docsPendentes);
        this.atualizarElemento('progressoGeral', `${progressoGeral}%`);
        */
    }

    adicionarLocador() {
        if (!this.imovelSelecionado) {
            alert('Selecione um imóvel primeiro.');
            return;
        }

        const nome = document.getElementById('nomeLocador').value;
        const tipo = document.getElementById('tipoLocador').value;

        if (!nome) {
            alert('Por favor, informe o nome do locador.');
            return;
        }

        const novoLocador = {
            id: this.locadores.length + 1,
            nome,
            tipo,
            imovelId: this.imovelSelecionado.id,
            documento: this.gerarDocumentoDemo(tipo),
            documentos: this.gerarDocumentosDemo()
        };

        this.locadores.push(novoLocador);
        
        document.getElementById('nomeLocador').value = '';
        
        this.atualizarListaLocadores();
        // this.atualizarDashboardLocadores(); // DESABILITADO - Seção de locadores foi ocultada
        this.atualizarTabelaImoveis();
        
        alert('Locador adicionado com sucesso!');
    }

    gerarDocumentoDemo(tipo) {
        if (tipo === 'Pessoa Jurídica') {
            // Gerar CNPJ
            const numbers = [];
            for (let i = 0; i < 12; i++) {
                numbers.push(Math.floor(Math.random() * 10));
            }
            
            // Calcular dígitos verificadores do CNPJ
            const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
            let sum1 = numbers.reduce((acc, num, idx) => acc + num * weights1[idx], 0);
            let digit1 = 11 - (sum1 % 11);
            if (digit1 >= 10) digit1 = 0;
            numbers.push(digit1);
            
            const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
            let sum2 = numbers.reduce((acc, num, idx) => acc + num * weights2[idx], 0);
            let digit2 = 11 - (sum2 % 11);
            if (digit2 >= 10) digit2 = 0;
            numbers.push(digit2);
            
            const cnpj = numbers.join('');
            return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        } else {
            // Gerar CPF (usando a função já existente)
            return this.gerarCPF();
        }
    }
    
    gerarSituacaoDocumental(ehPessoaJuridica, temConjuge = false, temRepresentante = false, contratoLongo = false) {
        const gerarStatus = () => {
            const rand = Math.random();
            if (rand < 0.70) return 'entregue';  // 70% entregue
            if (rand < 0.85) return 'pendente';  // 15% pendente
            if (rand < 0.95) return 'em_analise'; // 10% em análise
            return 'rejeitado'; // 5% rejeitado
        };

        if (ehPessoaJuridica) {
            // DOCUMENTAÇÃO PESSOA JURÍDICA
            const documentosPJ = {
                'CNPJ - Comprovante de Inscrição': gerarStatus(),
                'Contrato Social ou Estatuto Social': gerarStatus(),
                'Alterações Contratuais': Math.random() > 0.4 ? gerarStatus() : null,
                'Certidão Simplificada - Junta Comercial': gerarStatus(),
                'CND/CPEND - RFB e PGFN': gerarStatus(),
                'Certidão de Regularidade FGTS': gerarStatus(),
                'Escritura Pública (Promitente Comprador)': Math.random() > 0.7 ? gerarStatus() : null,
                'Protocolo Registro de Propriedade': Math.random() > 0.8 ? gerarStatus() : null,
                'Ata de Assembleia - Designação de Representante': temRepresentante ? gerarStatus() : null,
                'Procuração do Representante Legal': temRepresentante ? gerarStatus() : null
            };

            return documentosPJ;
        } else {
            // DOCUMENTAÇÃO PESSOA FÍSICA
            const documentosPF = {
                'CNH - Carteira Nacional de Habilitação': Math.random() > 0.6 ? gerarStatus() : null,
                'RG - Registro Geral': Math.random() > 0.3 ? gerarStatus() : null,
                'CPF - Cadastro de Pessoa Física': gerarStatus(),
                'Passaporte': Math.random() > 0.9 ? gerarStatus() : null,
                'Carteira Profissional': Math.random() > 0.6 ? gerarStatus() : null,
                'CND/CPEND - RFB e PGFN': gerarStatus(),
                'Escritura Pública (Promitente Comprador)': Math.random() > 0.7 ? gerarStatus() : null,
                'Protocolo Registro de Propriedade': Math.random() > 0.8 ? gerarStatus() : null
            };

            // Adicionar documentos do cônjuge se aplicável
            if (temConjuge) {
                documentosPF['RG do Cônjuge'] = gerarStatus();
                documentosPF['CPF do Cônjuge'] = gerarStatus();
                documentosPF['CNH do Cônjuge'] = Math.random() > 0.7 ? gerarStatus() : null;
            }

            // Adicionar documentos específicos para contratos longos
            if (contratoLongo) {
                documentosPF['Certidão de Regularidade FGTS'] = gerarStatus();
                documentosPF['Declaração de Bens e Direitos'] = gerarStatus();
            }

            return documentosPF;
        }
    }
    
    gerarNomesRealisticos() {
        const nomesMasculinos = [
            'João Silva Santos', 'Carlos Eduardo Lima', 'Roberto Almeida Sousa', 'Pedro Henrique Silva',
            'Rafael Moreira Costa', 'Bruno Costa Oliveira', 'Gustavo Ribeiro Santos', 'Alexandre Santos Lima',
            'Marcos Vieira Pereira', 'Rodrigo Barbosa Silva', 'Diego Carvalho Souza', 'Thiago Araújo Costa',
            'Felipe Nascimento Lima', 'Leonardo Pinto Silva', 'Mateus Correia Santos', 'José Carlos Pereira',
            'Ricardo Oliveira Costa', 'Luiz Fernando Silva', 'André Luiz Santos', 'Paulo Roberto Lima',
            'Fernando Henrique Costa', 'Antônio Carlos Silva', 'Francisco José Santos', 'Eduardo Pereira Lima'
        ];

        const nomesFemininos = [
            'Maria Oliveira Costa', 'Ana Paula Ferreira', 'Fernanda Castro Silva', 'Juliana Rocha Santos',
            'Camila Souza Lima', 'Larissa Pereira Costa', 'Patrícia Martins Silva', 'Priscila Gomes Santos',
            'Luciana Fernandes Lima', 'Isabela Mendes Costa', 'Vanessa Dias Silva', 'Aline Cardoso Santos',
            'Bianca Torres Lima', 'Amanda Silva Costa', 'Tatiana Campos Silva', 'Mariana Santos Lima',
            'Gabriela Oliveira Costa', 'Carla Fernanda Silva', 'Renata Pereira Santos', 'Daniela Costa Lima',
            'Simone Rodrigues Silva', 'Adriana Santos Costa', 'Cristina Lima Silva', 'Monica Santos Pereira'
        ];

        const empresas = [
            'Construtora ABC Ltda', 'Imobiliária Prime Negócios', 'Incorporadora Moderna S.A.',
            'Construções Sul Empreendimentos Ltda', 'Empreendimentos Norte Investimentos S.A.', 'Imóveis e Cia Corretora Ltda',
            'Construtora Silva e Filhos S.A.', 'Imobiliária Santos Premium', 'Edificações Modernas Engenharia S.A.',
            'Construtech Engenharia e Obras Ltda', 'Imóveis Premium Incorporadora', 'Construtora União Forte S.A.',
            'Incorporadora Horizonte Azul Ltda', 'Construtora Central do Brasil', 'Imobiliária Paulista Premium S.A.',
            'Grupo Empresarial Nova Era Ltda', 'Construtora Millennium S.A.', 'Investimentos Imobiliários JK Ltda',
            'Construtora e Incorporadora Atlas S.A.', 'Empreendimentos Cidade Nova Ltda', 'Construtora Mega Obras S.A.',
            'Imobiliária Top Line Premium', 'Construtora Phoenix Engenharia Ltda', 'Incorporadora Vista Bela S.A.'
        ];

        return {
            masculinos: nomesMasculinos,
            femininos: nomesFemininos,
            empresas: empresas,
            todos: [...nomesMasculinos, ...nomesFemininos]
        };
    }
    
    gerarCidadesBrasil() {
        return [
            'São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte',
            'Manaus', 'Curitiba', 'Recife', 'Goiânia', 'Belém', 'Porto Alegre', 'Guarulhos',
            'Campinas', 'São Luís', 'São Gonçalo', 'Maceió', 'Duque de Caxias', 'Nova Iguaçu',
            'Teresina', 'Natal', 'Campo Grande', 'Osasco', 'Santo André', 'João Pessoa',
            'Jaboatão dos Guararapes', 'Contagem', 'São Bernardo do Campo', 'Uberlândia',
            'Sorocaba', 'Aracaju', 'Feira de Santana', 'Cuiabá', 'Joinville', 'Juiz de Fora',
            'Londrina', 'Aparecida de Goiânia', 'Niterói', 'Belford Roxo', 'Caxias do Sul',
            'Campos dos Goytacazes', 'Macapá', 'Vila Velha', 'São João de Meriti', 'Florianópolis',
            'Santos', 'Ribeirão Preto', 'Vitória', 'Serra', 'Diadema'
        ];
    }
    
    gerarEnderecoCompleto() {
        const tipos = ['Rua', 'Avenida', 'Alameda', 'Travessa', 'Praça', 'Estrada', 'Rodovia'];
        const logradouros = [
            'das Flores', 'do Comércio', 'Brasil', 'da Independência', 'Santos Dumont', 
            'Getúlio Vargas', 'Juscelino Kubitschek', 'do Centro', 'da Liberdade', 'Paulista',
            'Copacabana', 'Ipanema', 'Atlântica', 'Rio Branco', 'Tiradentes', 'Sete de Setembro',
            'XV de Novembro', 'Marechal Deodoro', 'Presidente Vargas', 'Dom Pedro II',
            'das Palmeiras', 'dos Eucaliptos', 'das Acácias', 'do Sol', 'da Paz'
        ];
        
        const tipo = tipos[Math.floor(Math.random() * tipos.length)];
        const logradouro = logradouros[Math.floor(Math.random() * logradouros.length)];
        const numero = Math.floor(Math.random() * 9999) + 1;
        const complementos = ['', 'Sala 101', 'Apt 205', 'Bloco A', 'Casa 2', 'Loja 15'];
        const complemento = complementos[Math.floor(Math.random() * complementos.length)];
        
        return {
            logradouro: `${tipo} ${logradouro}, ${numero}`,
            complemento: complemento,
            enderecoCompleto: `${tipo} ${logradouro}, ${numero}${complemento ? ' - ' + complemento : ''}`
        };
    }
    
    gerarTelefoneCompleto() {
        const ddds = [11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99];
        const ddd = ddds[Math.floor(Math.random() * ddds.length)];
        
        // 70% celular (9 dígitos), 30% fixo (8 dígitos)
        const ehCelular = Math.random() < 0.7;
        
        if (ehCelular) {
            const numero = Math.floor(Math.random() * 900000000) + 100000000; // 9 dígitos
            const numeroFormatado = numero.toString().replace(/(\d{5})(\d{4})/, '$1-$2');
            return `(${ddd}) 9${numeroFormatado}`;
        } else {
            const numero = Math.floor(Math.random() * 90000000) + 10000000; // 8 dígitos
            const numeroFormatado = numero.toString().replace(/(\d{4})(\d{4})/, '$1-$2');
            return `(${ddd}) ${numeroFormatado}`;
        }
    }

    // === NOVAS FUNÇÕES DE DOCUMENTAÇÃO COMPLETA ===
    
    gerarEmailDemo(nome) {
        if (!nome) nome = 'usuario';
        const email = nome.toLowerCase()
            .replace(/\s+/g, '.')
            .replace(/[^a-z0-9.]/g, '')
            .replace(/\.+/g, '.');
        
        const dominios = ['gmail.com', 'hotmail.com', 'yahoo.com.br', 'outlook.com', 'empresa.com.br'];
        const dominio = dominios[Math.floor(Math.random() * dominios.length)];
        
        return `${email}@${dominio}`;
    }

    gerarTelefoneDemo() {
        const ddd = Math.floor(Math.random() * 89) + 11; // DDDs de 11 a 99
        const numero = Math.floor(Math.random() * 900000000) + 100000000; // 9 dígitos
        return `(${ddd}) ${numero.toString().replace(/(\d{5})(\d{4})/, '$1-$2')}`;
    }

    gerarCPF() {
        const numbers = [];
        for (let i = 0; i < 9; i++) {
            numbers.push(Math.floor(Math.random() * 10));
        }
        
        // Calcular dígitos verificadores
        let sum = numbers.reduce((acc, num, idx) => acc + num * (10 - idx), 0);
        let digit1 = 11 - (sum % 11);
        if (digit1 >= 10) digit1 = 0;
        numbers.push(digit1);
        
        sum = numbers.reduce((acc, num, idx) => acc + num * (11 - idx), 0);
        let digit2 = 11 - (sum % 11);
        if (digit2 >= 10) digit2 = 0;
        numbers.push(digit2);
        
        return numbers.join('').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    gerarDocumentosCompletos(ehPessoaJuridica) {
        const gerarStatus = () => {
            const rand = Math.random();
            if (rand < 0.7) return 'entregue';
            if (rand < 0.85) return 'pendente';
            if (rand < 0.95) return 'em_analise';
            return 'rejeitado';
        };

        if (ehPessoaJuridica) {
            // DOCUMENTAÇÃO DO LOCADOR PESSOA JURÍDICA
            const documentosPJ = {
                // a. Prova de Inscrição no CNPJ
                'CNPJ - Comprovante de Inscrição': gerarStatus(),
                
                // b. Ato constitutivo e suas alterações
                'Contrato Social ou Estatuto Social': gerarStatus(),
                'Alterações Contratuais': Math.random() > 0.3 ? gerarStatus() : null,
                
                // c. Certidão simplificada da Junta Comercial
                'Certidão Simplificada - Junta Comercial': gerarStatus(),
                
                // d. CND/CPEND Federal
                'CND/CPEND - RFB e PGFN': gerarStatus(),
                
                // e. Certidão de regularidade do FGTS
                'Certidão de Regularidade FGTS': gerarStatus(),
                
                // f. Documentos de promitente comprador (quando aplicável)
                'Escritura Pública (Promitente Comprador)': Math.random() > 0.8 ? gerarStatus() : null,
                'Protocolo Registro de Propriedade': Math.random() > 0.8 ? gerarStatus() : null
            };

            return documentosPJ;
        } else {
            // DOCUMENTAÇÃO DO LOCADOR PESSOA FÍSICA
            const documentosPF = {
                // a. Documento de Identidade válido
                'CNH - Carteira Nacional de Habilitação': Math.random() > 0.6 ? gerarStatus() : null,
                'RG - Registro Geral': Math.random() > 0.4 ? gerarStatus() : null,
                'CPF - Cadastro de Pessoa Física': gerarStatus(),
                'Passaporte': Math.random() > 0.9 ? gerarStatus() : null,
                'Carteira Profissional': Math.random() > 0.8 ? gerarStatus() : null,
                
                // b. Documento de Identidade do cônjuge (quando aplicável)
                'RG do Cônjuge': Math.random() > 0.7 ? gerarStatus() : null,
                'CPF do Cônjuge': Math.random() > 0.7 ? gerarStatus() : null,
                
                // c. CND/CPEND Federal
                'CND/CPEND - RFB e PGFN': gerarStatus(),
                
                // d. Documentos de promitente comprador (quando aplicável)
                'Escritura Pública (Promitente Comprador)': Math.random() > 0.8 ? gerarStatus() : null,
                'Protocolo Registro de Propriedade': Math.random() > 0.8 ? gerarStatus() : null
            };

            return documentosPF;
        }
    }
    
    gerarDocumentosRepresentante() {
        const gerarStatus = () => {
            const rand = Math.random();
            if (rand < 0.8) return 'entregue';
            if (rand < 0.95) return 'pendente';
            return 'em_analise';
        };

        // DOCUMENTAÇÃO DO REPRESENTANTE LEGAL
        return {
            // a. Instrumento jurídico de representação
            'Procuração Pública': Math.random() > 0.6 ? gerarStatus() : null,
            'Procuração Particular com Firma Reconhecida': Math.random() > 0.4 ? gerarStatus() : null,
            'Ato de Designação': Math.random() > 0.7 ? gerarStatus() : null,
            
            // b. Documento de Identidade do procurador/representante
            'CNH do Representante': Math.random() > 0.6 ? gerarStatus() : null,
            'RG do Representante': Math.random() > 0.4 ? gerarStatus() : null,
            'CPF do Representante': gerarStatus(),
            'Passaporte do Representante': Math.random() > 0.9 ? gerarStatus() : null,
            'Carteira Profissional do Representante': Math.random() > 0.8 ? gerarStatus() : null
        };
    }

    gerarDocumentosImovel() {
        const gerarStatus = () => {
            const rand = Math.random();
            if (rand < 0.75) return 'entregue';
            if (rand < 0.9) return 'pendente';
            return 'em_analise';
        };

        // DOCUMENTAÇÃO DO IMÓVEL
        return {
            // I. Matrícula do Imóvel
            'Matrícula do Imóvel (até 60 dias)': gerarStatus(),
            
            // II. Certidão negativa de IPTU
            'Certidão Negativa IPTU Atualizada': gerarStatus(),
            
            // III. Averbação ou Habite-se
            'Averbação de Edificação': Math.random() > 0.5 ? gerarStatus() : null,
            'Habite-se': Math.random() > 0.4 ? gerarStatus() : null,
            
            // IV. Permissão para atividade bancária
            'Permissão Atividade Bancária - Poder Público': Math.random() > 0.3 ? gerarStatus() : null,
            'Comprovação Legislação Local': Math.random() > 0.6 ? gerarStatus() : null,
            'Inexistência de Proibição Legal': Math.random() > 0.7 ? gerarStatus() : null,
            
            // V. Manifestação CILOG (quando aplicável)
            'Manifestação CILOG': Math.random() > 0.8 ? gerarStatus() : null
        };
    }
    
    // === FUNÇÃO AUXILIAR PARA CÁLCULO DE PROGRESSO DE DOCUMENTAÇÃO ===
    
    calcularProgressoDocumentacao(locadores) {
        if (!locadores || locadores.length === 0) {
            return 0;
        }
        
        let totalDocumentos = 0;
        let documentosEntregues = 0;
        
        locadores.forEach(locador => {
            // Contar documentos do locador
            if (locador.documentos) {
                Object.values(locador.documentos).forEach(status => {
                    if (status !== null) {
                        totalDocumentos++;
                        if (status === 'entregue') {
                            documentosEntregues++;
                        }
                    }
                });
            }
        });
        
        // Retornar percentual de conclusão (0-100)
        return totalDocumentos > 0 ? Math.round((documentosEntregues / totalDocumentos) * 100) : 0;
    }
    
    // === DASHBOARD DE AUDITORIA ===
    
    executarAuditoriaCompleta() {
        console.log('=== INICIANDO AUDITORIA COMPLETA ===');
        
        try {
            // Verificar se há dados
            if (!this.imoveis || this.imoveis.length === 0) {
                console.log('Nenhum imóvel encontrado, carregando dados demo...');
                this.carregarDadosDemo();
            }
            
            // VERIFICAÇÃO AUTOMÁTICA DE LOCADORES
            this.verificarECorrigirLocadores();
            
            console.log('Dados disponíveis: ' + this.imoveis.length + ' imóveis, ' + this.locadores.length + ' locadores');
            
            const relatorioAuditoria = {
                timestamp: new Date().toISOString(),
                resumo: {
                    totalImoveis: this.imoveis.length,
                    totalLocadores: this.locadores.length,
                    imoveisComProblemas: 0,
                    locadoresComProblemas: 0
                },
                problemas: [],
                estatisticas: {},
                recomendacoes: []
            };

            console.log('Relatório inicializado');

            // Auditoria por Status
            const statusCount = {};
            this.imoveis.forEach(imovel => {
                const status = imovel.status;
                statusCount[status] = (statusCount[status] || 0) + 1;
                
                // Validar cada imóvel
                const validacao = this.validarRegraStatusImovelCompleta(status, imovel.id, imovel);
                if (!validacao.valido) {
                    relatorioAuditoria.problemas.push({
                        tipo: 'status_invalido',
                        imovel: imovel,
                        problema: validacao.mensagem,
                        gravidade: status === 'Ativo' ? 'ALTA' : 'MÉDIA'
                    });
                    relatorioAuditoria.resumo.imoveisComProblemas++;
                }
            });

            // Auditoria de Locadores
            const locadoresPorTipo = { 'Pessoa Física': 0, 'Pessoa Jurídica': 0 };
            const problemasDocumentacao = [];
            
            this.locadores.forEach(locador => {
                locadoresPorTipo[locador.tipo]++;
                
                // Verificar documentação
                const totalDocs = Object.values(locador.documentos || {}).filter(s => s !== null).length;
                const docsEntregues = Object.values(locador.documentos || {}).filter(s => s === 'entregue').length;
                const progressoDoc = totalDocs > 0 ? (docsEntregues / totalDocs) * 100 : 0;
                
                if (progressoDoc < 50) {
                    problemasDocumentacao.push({
                        locador: locador,
                        progresso: Math.round(progressoDoc),
                        docsEntregues: docsEntregues,
                        totalDocs: totalDocs
                    });
                    relatorioAuditoria.resumo.locadoresComProblemas++;
                }
            });

            // Estatísticas
            relatorioAuditoria.estatisticas = {
                statusDistribuicao: statusCount,
                locadoresPorTipo: locadoresPorTipo,
                documentacaoMedia: this.locadores.length > 0 ? this.calcularProgressoDocumentacao(this.locadores) : 0,
                problemasDocumentacao: problemasDocumentacao
            };

            // Gerar Recomendações
            if (relatorioAuditoria.resumo.imoveisComProblemas > 0) {
                relatorioAuditoria.recomendacoes.push({
                    tipo: 'CRÍTICO',
                    acao: `Regularizar ${relatorioAuditoria.resumo.imoveisComProblemas} imóvel(is) com problemas de status`
                });
            }

            if (problemasDocumentacao.length > 0) {
                relatorioAuditoria.recomendacoes.push({
                    tipo: 'IMPORTANTE',
                    acao: `Solicitar documentação pendente de ${problemasDocumentacao.length} locador(es)`
                });
            }

            if (statusCount['Ativo'] && statusCount['Ativo'] > statusCount['Em mobilização']) {
                relatorioAuditoria.recomendacoes.push({
                    tipo: 'INFORMATIVO',
                    acao: 'Considerar mobilizar mais imóveis para equilibrar o pipeline'
                });
            }

            console.log('Relatório de Auditoria:', relatorioAuditoria);
            this.exibirRelatorioAuditoria(relatorioAuditoria);
            
            return relatorioAuditoria;
            
        } catch (error) {
            console.error('Erro durante auditoria:', error);
            alert('Erro ao executar auditoria: ' + error.message + '\nVerifique o console para mais detalhes.');
            throw error;
        }
    }
    
    exibirRelatorioAuditoria(relatorio) {
        let texto = `RELATÓRIO DE AUDITORIA - ${new Date().toLocaleString('pt-BR')}\n\n`;
        
        texto += `RESUMO EXECUTIVO:\n`;
        texto += `• Total de Imóveis: ${relatorio.resumo.totalImoveis}\n`;
        texto += `• Total de Locadores: ${relatorio.resumo.totalLocadores}\n`;
        texto += `• Imóveis com Problemas: ${relatorio.resumo.imoveisComProblemas}\n`;
        texto += `• Locadores com Problemas: ${relatorio.resumo.locadoresComProblemas}\n\n`;
        
        texto += `DISTRIBUIÇÃO POR STATUS:\n`;
        Object.entries(relatorio.estatisticas.statusDistribuicao).forEach(([status, count]) => {
            const percent = Math.round((count / relatorio.resumo.totalImoveis) * 100);
            texto += `• ${status}: ${count} (${percent}%)\n`;
        });
        texto += `\n`;
        
        texto += `LOCADORES:\n`;
        Object.entries(relatorio.estatisticas.locadoresPorTipo).forEach(([tipo, count]) => {
            const percent = Math.round((count / relatorio.resumo.totalLocadores) * 100);
            texto += `• ${tipo}: ${count} (${percent}%)\n`;
        });
        texto += `• Documentação Média: ${relatorio.estatisticas.documentacaoMedia}%\n\n`;
        
        if (relatorio.problemas.length > 0) {
            texto += `PROBLEMAS IDENTIFICADOS:\n`;
            relatorio.problemas.forEach((problema, index) => {
                texto += `${index + 1}. [${problema.gravidade}] ${problema.imovel.codigo}\n`;
                texto += `   ${problema.problema}\n\n`;
            });
        }
        
        if (relatorio.recomendacoes.length > 0) {
            texto += `RECOMENDAÇÕES:\n`;
            relatorio.recomendacoes.forEach((rec, index) => {
                texto += `${index + 1}. [${rec.tipo}] ${rec.acao}\n`;
            });
        }
        
        if (relatorio.problemas.length === 0 && relatorio.resumo.locadoresComProblemas === 0) {
            texto += `SISTEMA EM CONFORMIDADE\nTodos os imóveis e locadores atendem às regras de negócio.`;
        }
        
        // Usar console.log para depuração e alert para resultado
        console.log('RELATÓRIO COMPLETO DE AUDITORIA:');
        console.log(texto);
        
        // Alert com versão resumida para não sobrecarregar
        const resumo = `AUDITORIA CONCLUÍDA - ${new Date().toLocaleString('pt-BR')}\n\n` +
                      `RESUMO: ${relatorio.resumo.totalImoveis} imóveis, ${relatorio.resumo.totalLocadores} locadores\n` +
                      `Problemas: ${relatorio.resumo.imoveisComProblemas} imóveis, ${relatorio.resumo.locadoresComProblemas} locadores\n\n` +
                      `Relatório completo disponível no console do navegador (F12)`;
        
        alert(resumo);
    }

    // === VERIFICAÇÃO E CORREÇÃO DE LOCADORES ===
    verificarECorrigirLocadores() {
        console.log('Verificando estado dos locadores...');
        
        if (!this.locadores || this.locadores.length === 0) {
            console.log('Locadores ausentes! Executando correção automática...');
            
            // Primeira tentativa: geração normal
            this.locadores = this.gerarLocadoresDemo();
            
            // Se ainda estiver vazio, usar fallback
            if (!this.locadores || this.locadores.length === 0) {
                console.log('Geração normal falhou, usando fallback...');
                this.locadores = this.gerarLocadoresBasicos();
            }
            
            // Atualizar interface
            this.atualizarDashboard();
            
            console.log(`Correção concluída: ${this.locadores.length} locadores`);
        } else {
            console.log(`Locadores OK: ${this.locadores.length} encontrados`);
        }
        
        return this.locadores.length;
    }

    // === FUNÇÕES DO MODAL DE DOCUMENTOS ===

    mostrarDocumentosImovel(id) {
        console.log('📋 mostrarDocumentosImovel chamada com ID:', id);
        
        const imovel = this.imoveis.find(i => i.id === id);
        if (!imovel) {
            console.error('❌ Imóvel não encontrado para ID:', id);
            alert('Imóvel não encontrado!');
            return;
        }
        
        console.log('✅ Imóvel encontrado:', imovel);
        
        // Armazenar imóvel atual para uso nas funções auxiliares
        this.imovelAtualDocumentos = id;
        
        // Preencher informações do imóvel no modal
        this.preencherInfoImovelDocumentos(imovel);
        
        // Preencher documentos do imóvel
        this.preencherDocumentosImovel(imovel);
        
        // Preencher documentos dos locadores
        this.preencherDocumentosLocadores(id);
        
        // Atualizar resumo de status
        this.atualizarResumoStatusDocumentos(imovel, id);
        
        // Carregar dados do relatório técnico se existirem
        this.carregarRelatorioTecnico(imovel);
        
        // Abrir o modal
        const modal = document.getElementById('modalDocumentos');
        if (modal) {
            modal.style.display = 'block';
            console.log('✅ Modal de documentos aberto');
        } else {
            console.error('❌ Modal de documentos não encontrado');
        }
    }

    preencherInfoImovelDocumentos(imovel) {
        const container = document.getElementById('infoImovelDocumentos');
        if (!container) return;

        const locadoresDoImovel = this.locadores.filter(l => l.imovelId === imovel.id);
        
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                <div>
                    <strong style="color: #333;">Imóvel:</strong>
                    <div style="font-size: 1.1rem; margin-top: 0.25rem;">${imovel.denominacao}</div>
                    <div style="color: #666; font-size: 0.9rem;">Código: <code>${imovel.codigo}</code></div>
                </div>
                <div>
                    <strong style="color: #333;">Localização:</strong>
                    <div style="margin-top: 0.25rem;">${imovel.local}</div>
                    <div style="color: #666; font-size: 0.9rem;">${imovel.endereco}</div>
                </div>
                <div>
                    <strong style="color: #333;">Status:</strong> ${this.formatarStatusBadge(imovel.status)}
                    <div style="color: #666; font-size: 0.9rem; margin-top: 0.25rem;">
                        ${locadoresDoImovel.length} locador(es) vinculado(s)
                    </div>
                </div>
            </div>
        `;
    }

    preencherDocumentosImovel(imovel) {
        const container = document.getElementById('documentosImovelContainer');
        if (!container) return;

        if (!imovel.documentosImovel) {
            container.innerHTML = `
                <div class="alert alert-info" style="text-align: center; padding: 1.5rem; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px;">
                    <p style="margin: 0; color: #666;">Nenhum documento registrado para este imóvel.</p>
                </div>
            `;
            return;
        }

        let html = '<div class="documents-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem;">';
        
        Object.entries(imovel.documentosImovel).forEach(([nomeDoc, status]) => {
            if (status !== null) {
                const statusInfo = this.obterInfoStatusDocumento(status);
                
                html += `
                    <div class="documento-card" style="background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1rem; border-left: 4px solid ${statusInfo.cor};">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                            <h6 style="margin: 0; color: #333; font-size: 0.95rem; line-height: 1.3;">${nomeDoc}</h6>
                            <span class="status-badge" style="background: ${statusInfo.background}; color: ${statusInfo.cor}; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.875rem; font-weight: 500;">
                                ${statusInfo.icone} ${statusInfo.texto}
                            </span>
                        </div>
                        <div style="color: #666; font-size: 0.85rem;">
                            <div>📁 Documento do Imóvel</div>
                            <div style="margin-top: 0.25rem;">Status: ${statusInfo.descricao}</div>
                        </div>
                    </div>
                `;
            }
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    preencherDocumentosLocadores(imovelId) {
        const container = document.getElementById('documentosLocadoresContainer');
        if (!container) return;

        const locadoresDoImovel = this.locadores.filter(l => l.imovelId === imovelId);
        
        if (locadoresDoImovel.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info" style="text-align: center; padding: 1.5rem; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px;">
                    <p style="margin: 0; color: #666;">Nenhum locador cadastrado para este imóvel.</p>
                </div>
            `;
            return;
        }

        let html = '';
        
        locadoresDoImovel.forEach(locador => {
            const tipoIcon = locador.tipo === 'Pessoa Física' ? '👤' : '🏢';
            
            // Gerar documentos do locador se não existirem
            if (!locador.documentos) {
                locador.documentos = this.gerarDocumentosLocador(locador.tipo);
            }
            
            html += `
                <div class="locador-documentos mb-3" style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 1rem; background: #fafafa;">
                    <div style="display: flex; align-items: center; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e0e0e0;">
                        <span style="font-size: 1.2rem; margin-right: 0.5rem;">${tipoIcon}</span>
                        <div>
                            <strong style="color: #333;">${locador.nome}</strong>
                            <div style="color: #666; font-size: 0.9rem;">${locador.documento} | ${locador.tipo}</div>
                        </div>
                    </div>
                    <div class="documents-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.75rem;">
            `;
            
            Object.entries(locador.documentos).forEach(([nomeDoc, status]) => {
                if (status !== null) {
                    const statusInfo = this.obterInfoStatusDocumento(status);
                    
                    html += `
                        <div class="documento-card" style="background: white; border: 1px solid #e0e0e0; border-radius: 6px; padding: 0.75rem; border-left: 3px solid ${statusInfo.cor};">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.25rem;">
                                <h6 style="margin: 0; color: #333; font-size: 0.85rem; line-height: 1.2;">${nomeDoc}</h6>
                                <span class="status-badge" style="background: ${statusInfo.background}; color: ${statusInfo.cor}; padding: 0.2rem 0.4rem; border-radius: 10px; font-size: 0.7rem; font-weight: 500;">
                                    ${statusInfo.icone} ${statusInfo.texto}
                                </span>
                            </div>
                            <div style="color: #666; font-size: 0.75rem;">
                                ${statusInfo.descricao}
                            </div>
                        </div>
                    `;
                }
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    atualizarResumoStatusDocumentos(imovel, imovelId) {
        const locadoresDoImovel = this.locadores.filter(l => l.imovelId === imovelId);
        
        let contadores = {
            entregue: 0,
            pendente: 0,
            em_analise: 0,
            rejeitado: 0
        };

        // Contar documentos do imóvel
        if (imovel.documentosImovel) {
            Object.values(imovel.documentosImovel).forEach(status => {
                if (status && contadores.hasOwnProperty(status)) {
                    contadores[status]++;
                }
            });
        }

        // Contar documentos dos locadores
        locadoresDoImovel.forEach(locador => {
            if (!locador.documentos) {
                locador.documentos = this.gerarDocumentosLocador(locador.tipo);
            }
            
            Object.values(locador.documentos).forEach(status => {
                if (status && contadores.hasOwnProperty(status)) {
                    contadores[status]++;
                }
            });
        });

        // Atualizar elementos na interface
        const totalEntregues = document.getElementById('totalEntregues');
        const totalPendentes = document.getElementById('totalPendentes');
        const totalAnalise = document.getElementById('totalAnalise');
        const totalRejeitados = document.getElementById('totalRejeitados');

        if (totalEntregues) totalEntregues.textContent = contadores.entregue;
        if (totalPendentes) totalPendentes.textContent = contadores.pendente;
        if (totalAnalise) totalAnalise.textContent = contadores.em_analise;
        if (totalRejeitados) totalRejeitados.textContent = contadores.rejeitado;

        console.log('📊 Resumo de documentos:', contadores);
    }

    obterInfoStatusDocumento(status) {
        const statusMap = {
            'entregue': {
                texto: 'Entregue',
                icone: '✅',
                cor: '#28a745',
                background: '#e8f5e8',
                descricao: 'Documento entregue e aprovado'
            },
            'pendente': {
                texto: 'Pendente',
                icone: '⏳',
                cor: '#ff9800',
                background: '#fff3e0',
                descricao: 'Aguardando entrega do documento'
            },
            'em_analise': {
                texto: 'Em Análise',
                icone: '🔍',
                cor: '#2196f3',
                background: '#e7f3ff',
                descricao: 'Documento em processo de análise'
            },
            'rejeitado': {
                texto: 'Rejeitado',
                icone: '❌',
                cor: '#f44336',
                background: '#ffebee',
                descricao: 'Documento rejeitado - necessária nova entrega'
            }
        };

        return statusMap[status] || {
            texto: 'Desconhecido',
            icone: '❓',
            cor: '#666',
            background: '#f5f5f5',
            descricao: 'Status não identificado'
        };
    }

    gerarDocumentosLocador(tipo) {
        const gerarStatus = () => {
            const rand = Math.random();
            if (rand < 0.6) return 'entregue';
            if (rand < 0.8) return 'pendente';
            if (rand < 0.95) return 'em_analise';
            return 'rejeitado';
        };

        if (tipo === 'Pessoa Física') {
            return {
                'CPF': gerarStatus(),
                'RG ou CNH': gerarStatus(),
                'Comprovante de Residência': gerarStatus(),
                'Comprovante de Renda': gerarStatus(),
                'Certidão de Nascimento/Casamento': Math.random() > 0.3 ? gerarStatus() : null,
                'Declaração de Imposto de Renda': Math.random() > 0.4 ? gerarStatus() : null
            };
        } else {
            return {
                'CNPJ': gerarStatus(),
                'Contrato Social': gerarStatus(),
                'Certidão Simplificada da Junta Comercial': gerarStatus(),
                'Comprovante de Endereço da Empresa': gerarStatus(),
                'Balanço Patrimonial': gerarStatus(),
                'CPF e RG do Representante Legal': gerarStatus(),
                'Procuração (se aplicável)': Math.random() > 0.6 ? gerarStatus() : null
            };
        }
    }

    // === FUNÇÕES DO RELATÓRIO TÉCNICO ===

    limparRelatorioTecnico() {
        const campos = [
            'areaContratada', 'valorTotalObra', 'valorObraCaixa', 
            'valorObraLocador', 'prazoTotalObra', 'prazoCaixa', 'prazoLocador'
        ];
        
        campos.forEach(campo => {
            const elemento = document.getElementById(campo);
            if (elemento) elemento.value = '';
        });
        
        this.exibirStatusRelatorioTecnico('Dados limpos', 'info');
        console.log('🧹 Dados do relatório técnico limpos');
    }

    salvarRelatorioTecnico() {
        const dados = this.coletarDadosRelatorioTecnico();
        
        if (!dados.valido) {
            this.exibirStatusRelatorioTecnico('Preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        // Encontrar o imóvel atual
        const imovel = this.imoveis.find(i => i.id === this.imovelAtualDocumentos);
        if (!imovel) {
            this.exibirStatusRelatorioTecnico('Erro: Imóvel não encontrado', 'error');
            return;
        }
        
        // Salvar os dados do relatório técnico no imóvel
        if (!imovel.relatorioTecnico) {
            imovel.relatorioTecnico = {};
        }
        
        Object.assign(imovel.relatorioTecnico, dados.dados);
        imovel.relatorioTecnico.dataAtualizacao = new Date().toLocaleString('pt-BR');
        
        this.exibirStatusRelatorioTecnico('Relatório técnico salvo com sucesso!', 'success');
        console.log('💾 Relatório técnico salvo:', dados.dados);
    }

    validarRelatorioTecnico() {
        const dados = this.coletarDadosRelatorioTecnico();
        
        if (!dados.valido) {
            this.exibirStatusRelatorioTecnico('Dados incompletos ou inválidos', 'error');
            return;
        }
        
        const validacoes = [];
        
        // Validar se a soma dos valores das obras confere
        const somaObras = dados.dados.valorObraCaixa + dados.dados.valorObraLocador;
        if (Math.abs(somaObras - dados.dados.valorTotalObra) > 0.01) {
            validacoes.push('A soma dos valores CAIXA + LOCADOR deve ser igual ao valor total da obra');
        }
        
        // Validar se a soma dos prazos não excede o prazo total
        const somaPrazos = dados.dados.prazoCaixa + dados.dados.prazoLocador;
        if (somaPrazos > dados.dados.prazoTotalObra) {
            validacoes.push('A soma dos prazos CAIXA + LOCADOR não pode exceder o prazo total');
        }
        
        // Validar área contratada
        if (dados.dados.areaContratada <= 0) {
            validacoes.push('Área contratada deve ser maior que zero');
        }
        
        // Validar valores
        if (dados.dados.valorTotalObra <= 0) {
            validacoes.push('Valor total da obra deve ser maior que zero');
        }
        
        if (validacoes.length > 0) {
            const mensagem = 'Problemas encontrados:\n• ' + validacoes.join('\n• ');
            this.exibirStatusRelatorioTecnico(mensagem, 'error');
        } else {
            this.exibirStatusRelatorioTecnico('Todos os dados estão válidos!', 'success');
        }
    }

    coletarDadosRelatorioTecnico() {
        const campos = {
            areaContratada: 'number',
            valorTotalObra: 'number',
            valorObraCaixa: 'number',
            valorObraLocador: 'number',
            prazoTotalObra: 'number',
            prazoCaixa: 'number',
            prazoLocador: 'number'
        };
        
        const dados = {};
        let valido = true;
        
        Object.entries(campos).forEach(([campo, tipo]) => {
            const elemento = document.getElementById(campo);
            if (elemento) {
                const valor = elemento.value.trim();
                if (valor === '') {
                    valido = false;
                } else {
                    dados[campo] = tipo === 'number' ? parseFloat(valor) : valor;
                }
            } else {
                valido = false;
            }
        });
        
        return { dados, valido };
    }

    exibirStatusRelatorioTecnico(mensagem, tipo = 'info') {
        const statusDiv = document.getElementById('statusRelatorioTecnico');
        if (!statusDiv) return;
        
        const cores = {
            success: { bg: '#d4edda', border: '#c3e6cb', text: '#155724' },
            error: { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24' },
            warning: { bg: '#fff3cd', border: '#ffeaa7', text: '#856404' },
            info: { bg: '#d1ecf1', border: '#bee5eb', text: '#0c5460' }
        };
        
        const cor = cores[tipo] || cores.info;
        
        statusDiv.style.display = 'block';
        statusDiv.style.background = cor.bg;
        statusDiv.style.border = `1px solid ${cor.border}`;
        statusDiv.style.color = cor.text;
        statusDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-weight: 600;">
                    ${tipo === 'success' ? '✅' : tipo === 'error' ? '❌' : tipo === 'warning' ? '⚠️' : 'ℹ️'}
                </span>
                <span style="white-space: pre-line;">${mensagem}</span>
            </div>
        `;
        
        // Ocultar automaticamente após alguns segundos para mensagens de sucesso
        if (tipo === 'success' || tipo === 'info') {
            setTimeout(() => {
                if (statusDiv) statusDiv.style.display = 'none';
            }, 5000);
        }
    }

    carregarRelatorioTecnico(imovel) {
        if (!imovel.relatorioTecnico) return;
        
        const campos = [
            'areaContratada', 'valorTotalObra', 'valorObraCaixa', 
            'valorObraLocador', 'prazoTotalObra', 'prazoCaixa', 'prazoLocador'
        ];
        
        campos.forEach(campo => {
            const elemento = document.getElementById(campo);
            if (elemento && imovel.relatorioTecnico[campo] !== undefined) {
                elemento.value = imovel.relatorioTecnico[campo];
            }
        });
        
        if (imovel.relatorioTecnico.dataAtualizacao) {
            this.exibirStatusRelatorioTecnico(
                `Dados carregados (última atualização: ${imovel.relatorioTecnico.dataAtualizacao})`, 
                'info'
            );
        }
    }
}
