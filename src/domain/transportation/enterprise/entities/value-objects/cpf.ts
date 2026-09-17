

export class CPF {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(cpf: string) {

    const normalizedCpf  = cpf.replace(/\D/g, '')

    if (!CPF.isValid(normalizedCpf )) {
      throw new Error('Invalid CPF')
    }
    
    return new CPF(normalizedCpf)
  }

  static isValid(cpf: string) {
    if (cpf.length !== 11) {
      return false
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
      return false
    }

    const digits = cpf.split('').map(Number)

    // Primeiro dígito verificador
    let sum = 0

    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (10 - i)
    }

    let remainder = sum % 11
    const firstDigit = remainder < 2 ? 0 : 11 - remainder

    if (digits[9] !== firstDigit) {
      return false
    }

    // Segundo dígito verificador
    sum = 0

    for (let i = 0; i < 10; i++) {
      sum += digits[i] * (11 - i)
    }

    remainder = sum % 11
    const secondDigit = remainder < 2 ? 0 : 11 - remainder

    return digits[10] === secondDigit
  }

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  equals(cpf: CPF) {
    return cpf.toValue() === this.value
  }

}