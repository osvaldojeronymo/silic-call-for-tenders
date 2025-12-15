#!/usr/bin/env python3
"""
Script para importar dados do SAP (rel-SAP.xlsx) e converter para o formato do protótipo SILIC 2.0
"""

import pandas as pd
import json
from datetime import datetime
import hashlib
import re

def limpar_cpf_cnpj(documento):
    """Remove formatação de CPF/CNPJ"""
    if pd.isna(documento):
        return ""
    return re.sub(r'[^\d]', '', str(int(documento)))

def formatar_telefone(telefone):
    """Formata telefone removendo código do país se necessário"""
    if pd.isna(telefone):
        return ""
    tel = str(int(telefone))
    # Remove código do país (55) se presente
    if tel.startswith('55') and len(tel) > 11:
        tel = tel[2:]
    return tel

def gerar_id(seed):
    """Gera um ID único baseado em uma seed"""
    return hashlib.md5(str(seed).encode()).hexdigest()[:12]

def determinar_tipo_imovel(denominacao):
    """Determina o tipo do imóvel baseado na denominação"""
    denominacao_lower = denominacao.lower()
    
    if 'ag ' in denominacao_lower or 'agência' in denominacao_lower:
        return 'comercial'
    elif 'residencial' in denominacao_lower or 'casa' in denominacao_lower or 'apartamento' in denominacao_lower:
        return 'residencial'
    elif 'terreno' in denominacao_lower or 'lote' in denominacao_lower:
        return 'terreno'
    elif 'galpão' in denominacao_lower or 'industrial' in denominacao_lower:
        return 'industrial'
    else:
        return 'comercial'  # Default para agências

def determinar_status_contrato(row):
    """Determina o status do contrato baseado nas datas"""
    hoje = datetime.now()
    
    # Se tem data de rescisão, está inativo/vendido
    if pd.notna(row['Rescisão em']):
        return 'vendido'
    
    # Verifica se o contrato está vigente
    fim_validade = row['Fim da validade']
    if pd.notna(fim_validade):
        if fim_validade < hoje:
            return 'manutencao'  # Contrato vencido
        else:
            return 'ocupado'  # Contrato vigente
    
    return 'disponivel'

def converter_dados_sap(excel_path):
    """
    Converte dados do Excel SAP para o formato do protótipo SILIC 2.0
    """
    print("📂 Lendo arquivo Excel do SAP...")
    df = pd.read_excel(excel_path)
    
    print(f"✅ {len(df)} registros encontrados\n")
    
    imoveis = []
    locadores = []
    locadores_ids = {}  # Cache para evitar duplicatas
    
    for idx, row in df.iterrows():
        print(f"🔄 Processando registro {idx + 1}/{len(df)}: {row['Denominação do contrato']}")
        
        # === PROCESSAR LOCADOR ===
        documento = limpar_cpf_cnpj(row['NºID fiscal'])
        
        # Verifica se locador já foi processado
        if documento not in locadores_ids:
            locador_id = gerar_id(f"locador_{documento}")
            
            # Extrai nome do campo "Nome/ender." (formato: NOME / ENDEREÇO)
            nome_completo = row['Nome/ender.']
            nome = nome_completo.split('/')[0].strip() if '/' in nome_completo else nome_completo
            
            locador = {
                'id': locador_id,
                'nome': nome,
                'tipo': 'fisica' if row['Tipo ID Fiscal'] == 'CPF' else 'juridica',
                'documento': documento,
                'email': None,  # Não disponível no arquivo
                'telefone': formatar_telefone(row['Nº telefone']) if pd.notna(row['Nº telefone']) else None,
                'endereco': {
                    'logradouro': row['Rua'] if pd.notna(row['Rua']) else None,
                    'numero': str(row['Nº']) if pd.notna(row['Nº']) else None,
                    'bairro': row['Bairro'] if pd.notna(row['Bairro']) else None,
                    'cidade': row['Local'] if pd.notna(row['Local']) else None,
                    'estado': row['Região'] if pd.notna(row['Região']) else None,
                    'cep': row['Código postal'] if pd.notna(row['Código postal']) else None,
                },
                'status': 'ativo' if row['Denom.função PN'] == 'Proponente Credor' else 'inativo',
                'dataRegistro': datetime.now().isoformat(),
                'dataAtualizacao': datetime.now().isoformat()
            }
            
            locadores.append(locador)
            locadores_ids[documento] = locador_id
            print(f"  👤 Locador criado: {nome} ({documento})")
        else:
            locador_id = locadores_ids[documento]
            print(f"  👤 Locador já existente: {documento}")
        
        # === PROCESSAR IMÓVEL ===
        imovel_id = gerar_id(f"imovel_{row['Contrato']}")
        
        # Extrai informações do endereço do imóvel da denominação do contrato
        # Formato típico: "CT - AG VIÇOSA DE ALAGOAS, AL"
        denominacao = row['Denominação do contrato']
        partes = denominacao.split(',')
        
        if len(partes) >= 2:
            cidade_estado = partes[0].replace('CT - AG ', '').replace('CT - ', '').strip()
            estado = partes[1].strip() if len(partes) > 1 else ''
        else:
            cidade_estado = denominacao.replace('CT - AG ', '').replace('CT - ', '').strip()
            estado = ''
        
        imovel = {
            'id': imovel_id,
            'codigo': str(row['Contrato']),
            'endereco': denominacao,  # Usa a denominação completa como endereço
            'bairro': row['Bairro'] if pd.notna(row['Bairro']) else 'Centro',
            'cidade': cidade_estado,
            'cep': row['Código postal'] if pd.notna(row['Código postal']) else '',
            'estado': estado,
            'tipo': determinar_tipo_imovel(denominacao),
            'status': determinar_status_contrato(row),
            'area': None,  # Não disponível no arquivo
            'valor': None,  # Não disponível no arquivo
            'descricao': f"Contrato nº {row['Contrato']} - {row['Denom.tipo contrato']}",
            'fotos': [],
            'caracteristicas': {
                'contratoInicio': row['Início do contrato'].isoformat() if pd.notna(row['Início do contrato']) else None,
                'contratoFim': row['Fim da validade'].isoformat() if pd.notna(row['Fim da validade']) else None,
                'tipoContrato': row['Denom.tipo contrato'],
                'parceiroNegocio': str(row['Parceiro de negócios']),
            },
            'locadorId': locador_id,
            'dataRegistro': row['Início do contrato'].isoformat() if pd.notna(row['Início do contrato']) else datetime.now().isoformat(),
            'dataAtualizacao': datetime.now().isoformat()
        }
        
        imoveis.append(imovel)
        print(f"  🏢 Imóvel criado: {denominacao} (Código: {row['Contrato']})")
        print()
    
    return {
        'imoveis': imoveis,
        'locadores': locadores,
        'metadados': {
            'dataImportacao': datetime.now().isoformat(),
            'fonte': 'SAP - rel-SAP.xlsx',
            'totalImoveis': len(imoveis),
            'totalLocadores': len(locadores)
        }
    }

def main():
    """Função principal"""
    print("=" * 80)
    print("🏢 IMPORTADOR DE DADOS SAP → SILIC 2.0")
    print("=" * 80)
    print()
    
    excel_path = 'public/rel-SAP.xlsx'
    output_path = 'public/dados-sap.json'
    
    try:
        # Converter dados
        dados = converter_dados_sap(excel_path)
        
        # Salvar JSON
        print("💾 Salvando dados convertidos...")
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(dados, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Arquivo salvo: {output_path}")
        print()
        print("=" * 80)
        print("📊 RESUMO DA IMPORTAÇÃO")
        print("=" * 80)
        print(f"✅ Imóveis importados: {dados['metadados']['totalImoveis']}")
        print(f"✅ Locadores importados: {dados['metadados']['totalLocadores']}")
        print(f"📅 Data da importação: {dados['metadados']['dataImportacao']}")
        print()
        
        # Mostrar estatísticas detalhadas
        print("📈 ESTATÍSTICAS DOS IMÓVEIS:")
        tipos = {}
        status_list = {}
        
        for imovel in dados['imoveis']:
            tipos[imovel['tipo']] = tipos.get(imovel['tipo'], 0) + 1
            status_list[imovel['status']] = status_list.get(imovel['status'], 0) + 1
        
        print("\nPor tipo:")
        for tipo, count in tipos.items():
            print(f"  • {tipo.capitalize()}: {count}")
        
        print("\nPor status:")
        for status, count in status_list.items():
            print(f"  • {status.capitalize()}: {count}")
        
        print()
        print("=" * 80)
        print("🎉 IMPORTAÇÃO CONCLUÍDA COM SUCESSO!")
        print("=" * 80)
        
    except FileNotFoundError:
        print(f"❌ Erro: Arquivo {excel_path} não encontrado!")
    except Exception as e:
        print(f"❌ Erro durante importação: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
