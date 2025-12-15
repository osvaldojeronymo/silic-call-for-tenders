// SILIC 2.0 - Sistema de Locação de Imóveis CAIXA
// Versão para Apresentação com dados de demonstração

class SistemaSILIC {
    constructor() {
        this.imoveis = [];
        this.locadores = [];
        this.imovelSelecionado = null;
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
        console.log('🔄 Iniciando carregamento de dados demo...');
        
        try {
            // Gerar exatamente 100 imóveis para demonstração
            console.log('🏢 Gerando imóveis...');
            this.imoveis = this.gerarImoveisDemo(100);
            console.log(`✅ ${this.imoveis.length} imóveis gerados`);
            
            console.log('👥 Gerando locadores...');
            this.locadores = this.gerarLocadoresDemo();
            console.log(`✅ ${this.locadores.length} locadores gerados`);
            
            console.log('📊 Atualizando dashboard...');
            this.atualizarDashboard();
            
            console.log('📋 Atualizando tabela...');
            this.atualizarTabelaImoveis();
            
            console.log('🔧 Configurando filtros...');
            // Reconfigurar filtros após carregar dados
            this.configurarFiltrosImoveisImediato();
            
            console.log(`✅ Sistema carregado com sucesso! ${this.imoveis.length} imóveis, ${this.locadores.length} locadores`);
            
        } catch (error) {
            console.error('❌ Erro no carregamento de dados:', error);
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
                }

                imoveis.push({
                    id: id,
                    codigo: codigo,
                    denominacao: `ED - CAIXA ${cidade} ${this.gerarComplementoEndereco()}, ${uf}`,
                    local: cidade,
                    endereco: this.gerarEnderecoAleatorio(),
                    cep: this.gerarCEPAleatorio(),
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
        const nomes = this.gerarNomesRealisticos();
        const cidades = this.gerarCidadesBrasil();
        
        const locadores = [];
        let idCounter = 1;

        this.imoveis.forEach(imovel => {
            // Regra: apenas imóveis com status 'Em prospecção' ou 'Em mobilização' podem não ter locadores
            const podeNaoTerLocadores = imovel.status === 'Em prospecção' || imovel.status === 'Em mobilização';
            
            let numeroLocadores;
            if (podeNaoTerLocadores) {
                // 30% de chance de não ter locadores para estes status
                numeroLocadores = Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 3) + 1; // 0 a 3 locadores
            } else {
                // Demais status sempre têm pelo menos 1 locador
                numeroLocadores = Math.floor(Math.random() * 3) + 1; // 1 a 3 locadores
            }
            
            for (let i = 0; i < numeroLocadores; i++) {
                const ehPessoaJuridica = Math.random() > 0.6; // 40% PJ, 60% PF
                const nome = ehPessoaJuridica ? 
                    nomes.empresas[Math.floor(Math.random() * nomes.empresas.length)] :
                    nomes.todos[Math.floor(Math.random() * nomes.todos.length)];
                
                // Gerar situações realistas para PF
                const temConjuge = !ehPessoaJuridica && Math.random() < 0.4; // 40% das PF têm cônjuge
                const contratoLongo = Math.random() < 0.2; // 20% dos contratos são longos (≥120 meses)
                const temRepresentante = ehPessoaJuridica && Math.random() > 0.3; // 70% das PJs têm representante legal
                
                // Gerar endereço completo
                const enderecoInfo = this.gerarEnderecoCompleto();
                const cidade = cidades[Math.floor(Math.random() * cidades.length)];
                const uf = this.obterUFPorCidade(cidade);
                
                const locador = {
                    id: idCounter++,
                    nome: nome,
                    tipo: ehPessoaJuridica ? 'Pessoa Jurídica' : 'Pessoa Física',
                    imovelId: imovel.id,
                    documento: this.gerarDocumentoDemo(ehPessoaJuridica ? 'Pessoa Jurídica' : 'Pessoa Física'),
                    email: this.gerarEmailDemo(nome),
                    telefone: this.gerarTelefoneCompleto(),
                    endereco: `${enderecoInfo.enderecoCompleto}, ${cidade} - ${uf}`,
                    cep: this.gerarCEPAleatorio(),
                    cidade: cidade,
                    uf: uf,
                    documentos: this.gerarSituacaoDocumental(ehPessoaJuridica, temConjuge, temRepresentante, contratoLongo),
                    // Adicionar informações sobre situação especial
                    temConjuge: temConjuge,
                    contratoLongo: contratoLongo,
                    temRepresentante: temRepresentante,
                    situacaoEspecial: this.gerarSituacaoEspecial(),
                    dataVinculacao: this.gerarDataAleatoria('2023-01-01', '2024-12-31'),
                    observacoes: this.gerarObservacaoLocador(ehPessoaJuridica, temConjuge, contratoLongo)
                };

                // Para PJ, adicionar representante legal se aplicável
                if (temRepresentante) {
                    const nomeRepresentante = nomes.todos[Math.floor(Math.random() * nomes.todos.length)];
                    locador.representanteLegal = {
                        nome: nomeRepresentante,
                        cpf: this.gerarCPF(),
                        email: this.gerarEmailDemo(nomeRepresentante),
                        telefone: this.gerarTelefoneCompleto(),
                        cargo: this.gerarCargoRepresentante(),
                        documentos: this.gerarDocumentosRepresentante()
                    };
                }

                locadores.push(locador);
            }
        });

        console.log(`✅ Gerados ${locadores.length} locadores para ${this.imoveis.length} imóveis`);
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
            formulario.style.display = formulario.style.display === 'none' ? 'block' : 'none';
            
            if (formulario.style.display === 'block') {
                // Definir data de início automaticamente para hoje
                const hoje = new Date().toISOString().split('T')[0];
                document.getElementById('inicioValidadeObj').value = hoje;
            }
        }
    }
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

        // Verificar se o código já existe
        if (this.imoveis.some(imovel => imovel.codigo === codigo)) {
            alert('Já existe um imóvel com este código.');
            return;
        }

        // 🔴 VALIDAÇÃO DE REGRA DE NEGÓCIO: Status "Ativo" exige locadores
        const validacaoStatus = this.validarRegraStatusImovelCompleta(status, null);
        if (!validacaoStatus.valido) {
            alert(`❌ REGRA DE NEGÓCIO VIOLADA\n\n${validacaoStatus.mensagem}`);
            return;
        }

        const novoImovel = {
            id: this.imoveis.length + 1,
            codigo,
            denominacao,
            local,
            endereco,
            cep,
            status,
            inicioValidade,
            objetoValidoAte: objetoValidoAte || null,
            inscricaoIPTU: inscricaoIPTU || null,
            numeroITR: numeroITR || null
        };

        // Validação de regra de negócio
        const validacao = this.validarRegraStatusImovelCompleta(novoImovel.status);
        if (!validacao.valido) {
            alert(validacao.mensagem);
            return;
        }

        this.imoveis.push(novoImovel);
        this.atualizarDashboard();
        this.atualizarTabelaImoveis();
        this.limparFormulario();
        
        // Ir para a última página para mostrar o novo imóvel
        this.currentPageImoveis = Math.ceil(this.imoveis.length / this.itemsPerPageImoveis);
        this.atualizarTabelaImoveis();
        
        alert('Imóvel cadastrado com sucesso!');
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

        // 🔴 VERIFICAR REGRAS DE NEGÓCIO
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
        console.log('🔄 Iniciando atualizarTabelaImoveis...');
        console.log('📊 Total de imóveis:', this.imoveis.length);
        console.log('🔍 Filtros ativos:', !!this.imoveisFiltrados);
        
        // Se há filtros ativos, usar a função filtrada
        if (this.imoveisFiltrados) {
            console.log('📋 Usando lista filtrada');
            this.atualizarTabelaImoveisFiltrados();
            return;
        }

        console.log('📋 Usando lista completa');
        const tbody = document.getElementById('tabelaImoveis');
        console.log('🏷️ Elemento tbody encontrado:', !!tbody);
        
        if (!tbody) {
            console.error('❌ Elemento tabelaImoveis não encontrado!');
            return;
        }

        tbody.innerHTML = '';
        console.log('🧹 Tabela limpa');

        // Calcular paginação
        this.totalPaginasImoveis = Math.ceil(this.imoveis.length / this.itemsPerPageImoveis);
        const startIndex = (this.currentPageImoveis - 1) * this.itemsPerPageImoveis;
        const endIndex = startIndex + this.itemsPerPageImoveis;
        const imoveisPagina = this.imoveis.slice(startIndex, endIndex);

        console.log('📄 Imóveis para esta página:', imoveisPagina.length);

        imoveisPagina.forEach((imovel, index) => {
            console.log(`➕ Adicionando imóvel ${index + 1}:`, imovel.codigo);
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
                <td>${imovel.local}</td>
                <td>${this.formatarStatusBadge(imovel.status)}</td>
                <td style="text-align: center;">
                    <div class="locadores-count" style="text-align: center;">
                        <span style="font-weight: 600; color: ${quantidadeLocadores === 0 ? '#dc3545' : '#495057'};">
                            ${quantidadeLocadores}
                        </span>
                    </div>
                    ${quantidadeLocadores === 0 ? '<div class="action-warning">Nenhum locador cadastrado</div>' : ''}
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-compact btn-info" onclick="sistema.mostrarDetalhesImovel(${imovel.id})" title="Ver detalhes completos">
                            Detalhar
                        </button>
                        <button class="btn btn-sm btn-compact btn-primary" onclick="sistema.selecionarImovel(${imovel.id})" title="Selecionar para gerenciar locadores">
                            ${this.imovelSelecionado?.id === imovel.id ? 'Selecionado' : 'Locadores'}
                        </button>
                        <button class="btn btn-sm btn-compact btn-secondary" onclick="sistema.editarImovel(${imovel.id})" title="Editar imóvel">
                            Editar
                        </button>
                        <button class="btn btn-sm btn-compact btn-danger" onclick="sistema.removerImovel(${imovel.id})" title="Remover imóvel">
                            Remover
                        </button>
                    </div>
                </td>
            `;

            // Adicionar classe de destaque se não tiver locadores
            if (quantidadeLocadores === 0) {
                row.classList.add('imovel-warning');
            }
            
            // Destacar imóvel selecionado
            if (this.imovelSelecionado?.id === imovel.id) {
                row.style.backgroundColor = '#e3f2fd';
                row.style.borderLeft = '4px solid var(--color-primary)';
            }
        });

        console.log('✅ Todos os imóveis foram adicionados à tabela');
        this.atualizarPaginacaoImoveis();
        this.atualizarInfoImoveis();
        console.log('✅ atualizarTabelaImoveis concluída');
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
        console.log('🔧 Configurando filtros de imóveis...');
        
        // Campo de busca de texto
        const filtroInput = document.getElementById('filtroImoveis');
        if (filtroInput) {
            filtroInput.addEventListener('input', (e) => {
                console.log('🔍 Filtro de texto alterado:', e.target.value);
                this.filtrarImoveis();
            });
        } else {
            console.warn('⚠️ Campo filtroImoveis não encontrado');
        }

        // Filtro de status
        const filtroStatus = document.getElementById('filtroStatusImoveis');
        if (filtroStatus) {
            filtroStatus.addEventListener('change', (e) => {
                console.log('🏷️ Filtro de status alterado:', e.target.value);
                this.filtrarImoveis();
            });
        } else {
            console.warn('⚠️ Campo filtroStatusImoveis não encontrado');
        }

        // Botão limpar filtros
        const btnLimpar = document.getElementById('btnLimparFiltros');
        if (btnLimpar) {
            btnLimpar.addEventListener('click', () => {
                console.log('🗑️ Limpando filtros de imóveis');
                this.limparFiltrosImoveis();
            });
        } else {
            console.warn('⚠️ Botão btnLimparFiltros não encontrado');
        }

        console.log('✅ Filtros de imóveis configurados');
    }

    filtrarImoveis() {
        console.log('🔍 Executando filtro de imóveis...');
        
        const textoFiltro = document.getElementById('filtroImoveis')?.value.toLowerCase().trim() || '';
        const statusFiltro = document.getElementById('filtroStatusImoveis')?.value || '';
        
        console.log('📝 Filtros aplicados:', { texto: textoFiltro, status: statusFiltro });
        
        // Filtrar imóveis baseado nos critérios
        let imoveisFiltrados = this.imoveis.filter(imovel => {
            let passaTexto = true;
            let passaStatus = true;
            
            // Filtro por texto (código, denominação ou local)
            if (textoFiltro) {
                passaTexto = 
                    imovel.codigo.toLowerCase().includes(textoFiltro) ||
                    imovel.denominacao.toLowerCase().includes(textoFiltro) ||
                    imovel.local.toLowerCase().includes(textoFiltro);
            }
            
            // Filtro por status
            if (statusFiltro) {
                passaStatus = imovel.status === statusFiltro;
            }
            
            return passaTexto && passaStatus;
        });

        console.log(`📊 Resultados: ${imoveisFiltrados.length} de ${this.imoveis.length} imóveis`);
        
        // Mostrar estatísticas de busca
        this.mostrarEstatisticasBusca(imoveisFiltrados.length);
        
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
        console.log('🔄 Atualizando tabela com imóveis filtrados...');
        
        // Resetar para primeira página quando filtrar
        this.currentPageImoveis = 1;
        
        // Salvar array original
        if (!this.imoveisOriginais) {
            this.imoveisOriginais = [...this.imoveis];
        }
        
        // Atualizar array de imóveis temporariamente para paginação
        this.imoveis = imoveisFiltrados;
        this.totalPaginasImoveis = Math.ceil(imoveisFiltrados.length / this.itemsPerPageImoveis);
        
        // Atualizar tabela
        this.atualizarTabelaImoveis();
        
        // Restaurar array original
        this.imoveis = this.imoveisOriginais;
        
        // Atualizar informações da tabela
        this.atualizarInfoResultados(imoveisFiltrados.length);
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
        console.log('🗑️ Limpando filtros de imóveis...');
        
        // Limpar campos de filtro
        const filtroInput = document.getElementById('filtroImoveis');
        const filtroStatus = document.getElementById('filtroStatusImoveis');
        
        if (filtroInput) filtroInput.value = '';
        if (filtroStatus) filtroStatus.value = '';
        
        // Esconder estatísticas de busca
        const searchStats = document.getElementById('searchStats');
        if (searchStats) {
            searchStats.style.display = 'none';
        }
        
        // Atualizar tabela com todos os imóveis
        this.currentPageImoveis = 1;
        this.atualizarTabelaImoveis();
        this.atualizarInfoResultados(this.imoveis.length);
        
        console.log('✅ Filtros limpos');
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
        const imovel = this.imoveis.find(i => i.id === id);
        if (!imovel) return;

        const locadoresDoImovel = this.locadores.filter(l => l.imovelId === imovel.id);
        
        const detalhesContent = document.getElementById('detalhesImovelContent');
        detalhesContent.innerHTML = `
            <div class="detalhes-section">
                <h4>🏢 Informações Básicas</h4>
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
                <h4>📍 Localização</h4>
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
                <h4>📅 Validade do Objeto</h4>
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
                <h4>🏛️ Impostos e Tributos</h4>
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
                <h4>📋 Documentação do Imóvel</h4>
                <div class="documents-grid">
                    ${this.gerarDocumentosImovelHTML(imovel)}
                </div>
            </div>
            
            <div class="detalhes-section">
                <h4>👥 Locadores Vinculados</h4>
                <div class="detalhe-item">
                    <div class="detalhe-label">Total de Locadores</div>
                    <div class="detalhe-valor">
                        <span style="font-weight: 600; color: ${locadoresDoImovel.length === 0 ? '#dc3545' : '#495057'};">
                            ${locadoresDoImovel.length}
                        </span>
                        ${locadoresDoImovel.length === 0 ? ' <em style="color: #dc3545;">⚠️ Nenhum locador cadastrado</em>' : ''}
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

        document.getElementById('modalDetalhesImovel').style.display = 'block';
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
    }

    editarImovelModal() {
        // Fechar modal e abrir formulário de edição
        this.fecharModalDetalhes();
        alert('Funcionalidade de edição será implementada.');
    }

    selecionarImovel(id) {
        this.imovelSelecionado = this.imoveis.find(i => i.id === id);
        this.atualizarTabelaImoveis();
        this.mostrarSecaoLocadores();
        this.atualizarListaLocadores();
    }

    mostrarSecaoLocadores() {
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
    }

    atualizarDashboardLocadores() {
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
        this.atualizarDashboardLocadores();
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
                'Carteira Profissional': Math.random() > 0.8 ? gerarStatus() : null,
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
    
    // === FUNÇÕES AUXILIARES PARA GERAÇÃO DE LOCADORES ===
    
    gerarSituacaoEspecial() {
        const situacoes = [
            null, // A maioria não tem situação especial
            null,
            null,
            'Primeiro contrato com a CAIXA',
            'Renovação de contrato anterior',
            'Transferência de outro imóvel',
            'Parceria estratégica estabelecida',
            'Contrato com condições especiais',
            'Locador preferencial - histórico positivo'
        ];
        
        return situacoes[Math.floor(Math.random() * situacoes.length)];
    }
    
    gerarObservacaoLocador(ehPessoaJuridica, temConjuge = false, contratoLongo = false) {
        const observacoes = [];
        
        if (ehPessoaJuridica) {
            const obsEmpresa = [
                'Empresa estabelecida há mais de 5 anos no mercado.',
                'Boa reputação comercial e financeira.',
                'Histórico de cumprimento de contratos.',
                'Documentação empresarial em ordem.',
                'Atividade empresarial compatível com o uso do imóvel.'
            ];
            observacoes.push(obsEmpresa[Math.floor(Math.random() * obsEmpresa.length)]);
        } else {
            const obsPessoa = [
                'Primeira experiência como locador CAIXA.',
                'Locador com bom histórico de relacionamento.',
                'Documentação pessoal atualizada e completa.',
                'Renda compatível com o valor do contrato.',
                'Residência próxima ao imóvel locado.'
            ];
            observacoes.push(obsPessoa[Math.floor(Math.random() * obsPessoa.length)]);
        }
        
        if (temConjuge) {
            observacoes.push('Cônjuge também incluído no contrato como avalista.');
        }
        
        if (contratoLongo) {
            observacoes.push('Contrato de longo prazo (≥120 meses) - condições especiais aplicadas.');
        }
        
        // Adicionar observação aleatória extra em 30% dos casos
        if (Math.random() < 0.3) {
            const obsGerais = [
                'Documentação entregue dentro do prazo.',
                'Avalição de idoneidade aprovada.',
                'Referências comerciais verificadas.',
                'Cadastro no SERASA/SPC consultado.',
                'Vistoria prévia do imóvel realizada.'
            ];
            observacoes.push(obsGerais[Math.floor(Math.random() * obsGerais.length)]);
        }
 }
        
        return observacoes.join(' ');
    }
    
    gerarCargoRepresentante() {
        const cargos = [
            'Diretor Presidente',
            'Diretor Financeiro', 
            'Diretor Comercial',
            'Sócio Administrador',
            'Gerente Geral',
            'Procurador Legal',
            'Representante Legal',
            'Administrador',
            'Sócio Gerente',
            'Diretor Executivo'
        ];
        
        return cargos[Math.floor(Math.random() * cargos.length)];
    }
    
    // === DASHBOARD DE AUDITORIA ===
    
    executarAuditoriaCompleta() {
        console.log('🔍 === INICIANDO AUDITORIA COMPLETA ===');
        
        try {
            // Verificar se há dados
            if (!this.imoveis || this.imoveis.length === 0) {
                console.log('⚠️ Nenhum imóvel encontrado, carregando dados demo...');
                this.carregarDadosDemo();
            }
            
            console.log('📊 Dados disponíveis: ' + this.imoveis.length + ' imóveis, ' + this.locadores.length + ' locadores');
            
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

            console.log('✅ Relatório inicializado');

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
            const totalDocs = Object.values(locador.documentos).filter(s => s !== null).length;
            const docsEntregues = Object.values(locador.documentos).filter(s => s === 'entregue').length;
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
            documentacaoMedia: this.calcularProgressoDocumentacao(this.locadores),
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

        console.log('📊 Relatório de Auditoria:', relatorioAuditoria);
        this.exibirRelatorioAuditoria(relatorioAuditoria);
        
        return relatorioAuditoria;
        
        } catch (error) {
            console.error('❌ Erro durante auditoria:', error);
            alert('❌ Erro ao executar auditoria: ' + error.message + '\nVerifique o console para mais detalhes.');
            throw error;
        }
    }
    
    exibirRelatorioAuditoria(relatorio) {
        let texto = `📋 RELATÓRIO DE AUDITORIA - ${new Date().toLocaleString('pt-BR')}\n\n`;
        
        texto += `📊 RESUMO EXECUTIVO:\n`;
        texto += `• Total de Imóveis: ${relatorio.resumo.totalImoveis}\n`;
        texto += `• Total de Locadores: ${relatorio.resumo.totalLocadores}\n`;
        texto += `• Imóveis com Problemas: ${relatorio.resumo.imoveisComProblemas}\n`;
        texto += `• Locadores com Problemas: ${relatorio.resumo.locadoresComProblemas}\n\n`;
        
        texto += `📈 DISTRIBUIÇÃO POR STATUS:\n`;
        Object.entries(relatorio.estatisticas.statusDistribuicao).forEach(([status, count]) => {
            const percent = Math.round((count / relatorio.resumo.totalImoveis) * 100);
            texto += `• ${status}: ${count} (${percent}%)\n`;
        });
        texto += `\n`;
        
        texto += `👥 LOCADORES:\n`;
        Object.entries(relatorio.estatisticas.locadoresPorTipo).forEach(([tipo, count]) => {
            const percent = Math.round((count / relatorio.resumo.totalLocadores) * 100);
            texto += `• ${tipo}: ${count} (${percent}%)\n`;
        });
        texto += `• Documentação Média: ${relatorio.estatisticas.documentacaoMedia}%\n\n`;
        
        if (relatorio.problemas.length > 0) {
            texto += `🚨 PROBLEMAS IDENTIFICADOS:\n`;
            relatorio.problemas.forEach((problema, index) => {
                texto += `${index + 1}. [${problema.gravidade}] ${problema.imovel.codigo}\n`;
                texto += `   ${problema.problema}\n\n`;
            });
        }
        
        if (relatorio.recomendacoes.length > 0) {
            texto += `💡 RECOMENDAÇÕES:\n`;
            relatorio.recomendacoes.forEach((rec, index) => {
                texto += `${index + 1}. [${rec.tipo}] ${rec.acao}\n`;
            });
        }
        
        if (relatorio.problemas.length === 0 && relatorio.resumo.locadoresComProblemas === 0) {
            texto += `✅ SISTEMA EM CONFORMIDADE\nTodos os imóveis e locadores atendem às regras de negócio.`;
        }
        
        // Usar console.log para depuração e alert para resultado
        console.log('📋 RELATÓRIO COMPLETO DE AUDITORIA:');
        console.log(texto);
        
        // Alert com versão resumida para não sobrecarregar
        const resumo = `📋 AUDITORIA CONCLUÍDA - ${new Date().toLocaleString('pt-BR')}\n\n` +
                      `📊 RESUMO: ${relatorio.resumo.totalImoveis} imóveis, ${relatorio.resumo.totalLocadores} locadores\n` +
                      `🚨 Problemas: ${relatorio.resumo.imoveisComProblemas} imóveis, ${relatorio.resumo.locadoresComProblemas} locadores\n\n` +
                      `✅ Relatório completo disponível no console do navegador (F12)`;
        
        alert(resumo);
    }
}

// Inicializar o sistema quando o script for carregado
console.log('🚀 Iniciando sistema SILIC...');
window.sistema = new SistemaSILIC();

// Função para reconectar filtros (caso necessário)
window.reconectarFiltros = function() {
    if (window.sistema) {
        console.log('🔧 Reconectando filtros...');
        window.sistema.configurarFiltrosImoveisImediato();
    }
};

console.log('✅ Sistema SILIC carregado e pronto para uso!');
