
export class CEP {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(cep: string) {
    const cepFormatted = cep.replace(/\D/g, '')

    if (!CEP.isValid(cepFormatted)) {
      throw new Error('Invalid CEP')
    }
    
    return new CEP(cepFormatted)
  }

  static isValid(cep: string) {
    if (!/^\d{8}$/.test(cep)) {
      return false
    }

    // Rejeita valores como 00000000, 11111111 etc.
    if (/^(\d)\1{7}$/.test(cep)) {
      return false
    }

    return true
  }

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  equals(cep: CEP) {
    return cep.toValue() === this.value
  }
}