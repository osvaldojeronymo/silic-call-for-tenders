// Utilitários para o sistema SILIC

export class Utils {
  /**
   * Gera um ID único baseado em timestamp e random
   */
  static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Formata CPF/CNPJ
   */
  static formatDocument(doc: string): string {
    const numbers = doc.replace(/\D/g, '');
    
    if (numbers.length === 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (numbers.length === 14) {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    
    return doc;
  }

  /**
   * Formata CEP
   */
  static formatCEP(cep: string): string {
    const numbers = cep.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  /**
   * Formata valor monetário
   */
  static formatMoney(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  /**
   * Formata valor monetário (alias)
   */
  static formatCurrency(value: number): string {
    return this.formatMoney(value);
  }

  /**
   * Formata data
   */
  static formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR');
  }

  /**
   * Aplica máscara em elementos HTML
   */
  static applyMask(element: HTMLInputElement, mask: 'cep' | 'phone' | 'cpf' | 'cnpj'): void {
    element.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      let value = target.value.replace(/\D/g, '');

      switch (mask) {
        case 'cep':
          if (value.length <= 8) {
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
          }
          break;
        case 'phone':
          if (value.length <= 11) {
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
          }
          break;
        case 'cpf':
          if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{2})$/, '$1-$2');
          }
          break;
        case 'cnpj':
          if (value.length <= 14) {
            value = value.replace(/(\d{2})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1/$2');
            value = value.replace(/(\d{4})(\d{2})$/, '$1-$2');
          }
          break;
      }

      target.value = value;
    });
  }

  /**
   * Debounce para otimizar eventos
   */
  static debounce<T extends (...args: any[]) => void>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: number;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay) as any;
    };
  }

  /**
   * Escapa HTML para prevenir XSS
   */
  static escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Validações
   */
  static validators = {
    cpf: (cpf: string): boolean => {
      const numbers = cpf.replace(/\D/g, '');
      if (numbers.length !== 11 || /^(\d)\1+$/.test(numbers)) return false;

      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(numbers[i]) * (10 - i);
      }
      let remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(numbers[9])) return false;

      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += parseInt(numbers[i]) * (11 - i);
      }
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      return remainder === parseInt(numbers[10]);
    },

    cnpj: (cnpj: string): boolean => {
      const numbers = cnpj.replace(/\D/g, '');
      if (numbers.length !== 14 || /^(\d)\1+$/.test(numbers)) return false;

      let sum = 0;
      let pos = 5;
      for (let i = 0; i < 12; i++) {
        sum += parseInt(numbers[i]) * pos--;
        if (pos < 2) pos = 9;
      }
      let remainder = sum % 11 < 2 ? 0 : 11 - (sum % 11);
      if (remainder !== parseInt(numbers[12])) return false;

      sum = 0;
      pos = 6;
      for (let i = 0; i < 13; i++) {
        sum += parseInt(numbers[i]) * pos--;
        if (pos < 2) pos = 9;
      }
      remainder = sum % 11 < 2 ? 0 : 11 - (sum % 11);
      return remainder === parseInt(numbers[13]);
    },

    email: (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    cep: (cep: string): boolean => {
      const numbers = cep.replace(/\D/g, '');
      return numbers.length === 8;
    }
  };
}