export function generateCPF(): string {
  const cpf = Array.from({ length: 9 }, () =>
    Math.floor(Math.random() * 10),
  )

  const calculateDigit = (numbers: number[]) => {
    const sum = numbers.reduce(
      (acc, number, index) => acc + number * (numbers.length + 1 - index),
      0,
    )

    const remainder = sum % 11

    return remainder < 2 ? 0 : 11 - remainder
  }

  cpf.push(calculateDigit(cpf))
  cpf.push(calculateDigit(cpf))

  return cpf.join('')
}