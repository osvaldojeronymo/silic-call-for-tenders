#!/usr/bin/env python3
"""
Script para converter planilha Excel (rel-SAP.xlsx) para JSON (dados-sap.json)
"""

import pandas as pd
import json
from datetime import datetime
import os

def limpar_valor(valor):
    """Limpa e converte valores, tratando NaN"""
    if pd.isna(valor):
        return None
    if isinstance(valor, (int, float)):
        return valor
    return str(valor).strip()

def converter_data(data_str):
    """Converte string de data para formato ISO"""
    if pd.isna(data_str) or data_str is None:
        return None
    
    try:
        # Tenta diferentes formatos de data
        if isinstance(data_str, datetime):
            return data_str.isoformat()
        
        # Tenta converter string
        data_str = str(data_str).strip()
        
        # Formato DD/MM/YYYY
        if '/' in data_str:
            partes = data_str.split('/')
            if len(partes) == 3:
                dia, mes, ano = partes
                return f"{ano}-{mes.zfill(2)}-{dia.zfill(2)}"
        
        return data_str
    except:
        return None

def main():
    # Caminhos
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    excel_path = os.path.join(base_dir, 'public', 'rel-SAP.xlsx')
    json_path = os.path.join(base_dir, 'public', 'dados-sap.json')
    
    print(f"📂 Lendo planilha: {excel_path}")
    
    try:
        # Ler a planilha Excel
        df = pd.read_excel(excel_path, sheet_name=0)
        
        print(f"✅ Planilha lida com sucesso!")
        print(f"📊 Total de linhas: {len(df)}")
        print(f"📋 Colunas encontradas: {', '.join(df.columns.tolist())}")
        
        # Estrutura de dados
        dados = {
            "imoveis": [],
            "locadores": [],
            "metadados": {
                "dataImportacao": datetime.now().isoformat(),
                "fonte": "rel-SAP.xlsx",
                "totalRegistros": len(df)
            }
        }
        
        # Mapear locadores únicos
        locadores_map = {}
        locador_id = 1
        
        # Processar cada linha
        for idx, row in df.iterrows():
            # Gerar ID único para o imóvel
            imovel_id = f"imovel_{str(idx + 1).zfill(6)}"
            
            # Processar locador - mapeamento das colunas SAP
            nome_locador = limpar_valor(row.get('Nome/ender.', ''))
            cpf_cnpj = limpar_valor(row.get('NºID fiscal', ''))
            tipo_id = limpar_valor(row.get('Tipo ID Fiscal', ''))
            
            # Criar ou encontrar locador
            chave_locador = f"{nome_locador}_{cpf_cnpj}"
            
            if chave_locador not in locadores_map and nome_locador:
                locador_obj_id = f"locador_{str(locador_id).zfill(6)}"
                
                # Determinar tipo de pessoa baseado no Tipo ID Fiscal
                tipo_pessoa = 'juridica' if tipo_id and 'BR2' in str(tipo_id) else 'fisica'
                
                locador = {
                    "id": locador_obj_id,
                    "nome": nome_locador,
                    "tipo": tipo_pessoa,
                    "tipoIdFiscal": tipo_id,
                    "documento": cpf_cnpj,
                    "email": limpar_valor(row.get('Endereço de e-mail', None)),
                    "telefone": limpar_valor(row.get('Nº telefone', None)),
                    "telefoneCelular": limpar_valor(row.get('Telefone celular', None)),
                    "endereco": {
                        "logradouro": limpar_valor(row.get('Rua', '')),
                        "numero": limpar_valor(row.get('Nº', '')),
                        "bairro": limpar_valor(row.get('Bairro', '')),
                        "cidade": limpar_valor(row.get('Local', '')),
                        "estado": limpar_valor(row.get('Região', '')),
                        "cep": limpar_valor(row.get('Código postal', ''))
                    },
                    "funcao": limpar_valor(row.get('Denom.função PN', '')),
                    "parceiroNegocio": limpar_valor(row.get('Parceiro de negócios', '')),
                    "inicioRelacao": converter_data(row.get('Início da relação', None)),
                    "fimRelacao": converter_data(row.get('Fim da relação', None)),
                    "status": "ativo",
                    "dataRegistro": datetime.now().isoformat()
                }
                
                dados["locadores"].append(locador)
                locadores_map[chave_locador] = locador_obj_id
                locador_id += 1
            
            # Processar imóvel - mapeamento das colunas SAP
            codigo_contrato = limpar_valor(row.get('Contrato', ''))
            denominacao = limpar_valor(row.get('Denominação do contrato', ''))
            tipo_contrato_denom = limpar_valor(row.get('Denom.tipo contrato', ''))
            
            # Extrair cidade e estado da denominação (formato: CT - AG CIDADE, UF)
            cidade = ''
            estado = ''
            if denominacao:
                partes = denominacao.split(',')
                if len(partes) >= 2:
                    estado = partes[-1].strip()
                    cidade_parte = partes[-2].split('-')[-1].strip() if '-' in partes[-2] else partes[-2].strip()
                    # Remover "AG " se existir
                    cidade = cidade_parte.replace('AG ', '').strip()
            
            imovel = {
                "id": imovel_id,
                "codigo": codigo_contrato,
                "denominacao": denominacao,
                "tipoContrato": tipo_contrato_denom or 'Contrato de Locação - Imóveis',
                "local": cidade,
                "cidade": cidade,
                "estado": estado,
                "endereco": limpar_valor(row.get('Rua', '')),
                "numero": limpar_valor(row.get('Nº', '')),
                "bairro": limpar_valor(row.get('Bairro', '')),
                "cep": limpar_valor(row.get('Código postal', '')),
                "utilizacaoPrincipal": "Próprio",  # Pode ser ajustado conforme regra de negócio
                "status": "Ativo",  # Pode ser derivado das datas de validade
                "inicioValidade": converter_data(row.get('Início do contrato', None)),
                "objetoValidoAte": converter_data(row.get('Fim da validade', None)),
                "rescisaoEm": converter_data(row.get('Rescisão em', None)),
                "parceiroNegocio": limpar_valor(row.get('Parceiro de negócios', '')),
                "inscricaoIPTU": None,
                "numeroITR": None,
                "area": None,
                "valorAluguel": None,
                "locadorId": locadores_map.get(chave_locador, None) if nome_locador else None,
                "dataRegistro": datetime.now().isoformat()
            }
            
            dados["imoveis"].append(imovel)
        
        # Salvar JSON
        print(f"\n💾 Salvando JSON: {json_path}")
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(dados, f, ensure_ascii=False, indent=2)
        
        print(f"\n✅ Conversão concluída com sucesso!")
        print(f"📊 Resumo:")
        print(f"   - Imóveis: {len(dados['imoveis'])}")
        print(f"   - Locadores: {len(dados['locadores'])}")
        print(f"   - Arquivo gerado: {json_path}")
        
    except FileNotFoundError:
        print(f"❌ Erro: Arquivo não encontrado: {excel_path}")
        print(f"   Certifique-se de que o arquivo rel-SAP.xlsx está na pasta public/")
    except Exception as e:
        print(f"❌ Erro ao processar arquivo: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
