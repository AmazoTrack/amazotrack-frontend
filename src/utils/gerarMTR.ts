import jsPDF from 'jspdf'

// tipos
export interface MTRData {
  number: string
  issueDate: string
  transporter: string
}

export interface WasteData {
  description: string
  code?: string
  class: 'I' | 'II_A' | 'II_B'
  quantity: number
  unit: string
}

export interface CompanyData {
  corporateName: string
  cnpj: string
  licenseNumber?: string
  issuingAgency?: string
  licenseExpiry?: string
}

// helpers
function classeLabel(c: string): string {
  const map: Record<string, string> = {
    I:    'Classe I (Perigoso)',
    II_A: 'Classe II-A (Não Inerte)',
    II_B: 'Classe II-B (Inerte)',
  }
  return map[c] ?? c
}

function linha(doc: jsPDF, y: number): number {
  doc.setDrawColor(220, 220, 220)
  doc.line(14, y, 196, y)
  return y + 6
}

// função principal

export function gerarMTR(
  mtr: MTRData,
  waste: WasteData,
  geradora: CompanyData,
  destinadora: CompanyData
): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  let y = 20

// cabeçalho mtr

  doc.setFillColor(6, 38, 48) // #062630
  doc.rect(0, 0, 210, 22, 'F')

  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('MANIFESTO DE TRANSPORTE DE RESÍDUOS', 14, 11)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(180, 220, 225)
  doc.text('AMAZOTRACK — Sistema de Gestão de Resíduos Industriais', 14, 15)

// num MTR e data (canto direito)

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text(mtr.number, 196, 10, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(
    'Emissão: ' + new Date(mtr.issueDate).toLocaleDateString('pt-BR'),
    196, 16, { align: 'right' }
  )

  y = 28

//empresa geradora 

  doc.setTextColor(0, 95, 115) // #005F73
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('EMPRESA GERADORA', 14, y)
  y += 2
  y = linha(doc, y)

  doc.setTextColor(50, 50, 50)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(`Razão Social: ${geradora.corporateName}`, 14, y)
  doc.text(`CNPJ: ${geradora.cnpj}`, 130, y)
  y += 10

//empresa destinadora

  doc.setTextColor(0, 95, 115)
  doc.setFont('helvetica', 'bold')
  doc.text('EMPRESA DESTINADORA', 14, y)
  y += 2
  y = linha(doc, y)

  doc.setTextColor(50, 50, 50)
  doc.setFont('helvetica', 'normal')
  doc.text(`Razão Social: ${destinadora.corporateName}`, 14, y)
  doc.text(`CNPJ: ${destinadora.cnpj}`, 130, y)
  y += 6

  if (destinadora.licenseNumber || destinadora.issuingAgency) {
    const licenca = [destinadora.licenseNumber, destinadora.issuingAgency]
      .filter(Boolean).join(' — ')
    doc.text(`Licença Ambiental: ${licenca}`, 14, y)
    if (destinadora.licenseExpiry) {
      doc.text(`Validade: ${new Date(destinadora.licenseExpiry).toLocaleDateString('pt-BR')}`, 130, y)
    }
    y += 6
  }
  y += 4

//transportador

  doc.setTextColor(0, 95, 115)
  doc.setFont('helvetica', 'bold')
  doc.text('TRANSPORTADOR', 14, y)
  y += 2
  y = linha(doc, y)

  doc.setTextColor(50, 50, 50)
  doc.setFont('helvetica', 'normal')
  doc.text(`Responsável: ${mtr.transporter}`, 14, y)
  y += 10

// tabela de resíduos

  doc.setTextColor(0, 95, 115)
  doc.setFont('helvetica', 'bold')
  doc.text('RESÍDUOS TRANSPORTADOS', 14, y)
  y += 2
  y = linha(doc, y)

//cabeçalho da tabela

  doc.setFillColor(240, 245, 248)
  doc.rect(14, y - 1, 182, 8, 'F')

  doc.setTextColor(80, 80, 80)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('Descrição', 16, y + 4)
  doc.text('Código', 100, y + 4)
  doc.text('Classe NBR', 122, y + 4)
  doc.text('Quantidade', 168, y + 4)
  y += 10

//linha do resíduo
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(40, 40, 40)
  doc.setFontSize(9)

// descrição com quebra de linha caso necessário

  const descLines = doc.splitTextToSize(waste.description, 80)
  doc.text(descLines, 16, y)
  doc.text(waste.code ?? '—', 100, y)
  doc.text(classeLabel(waste.class), 122, y)
  doc.text(`${waste.quantity.toLocaleString('pt-BR')} ${waste.unit}`, 168, y)
  y += Math.max(descLines.length * 5, 8)

// linha separadora da tabela
  doc.setDrawColor(220, 220, 220)
  doc.line(14, y, 196, y)
  y += 5

  // Total
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(0, 95, 115)
  doc.text(
    `Total: ${waste.quantity.toLocaleString('pt-BR')} ${waste.unit}`,
    196, y, { align: 'right' }
  )
  y += 16

//assinaturas 

  y = linha(doc, y)
  y += 2

  const assinaturas = ['Gerador', 'Transportador', 'Destinador']
  const xPositions = [30, 105, 175]

  assinaturas.forEach((label, i) => {
    const x = xPositions[i]
    doc.setDrawColor(100, 100, 100)
    doc.line(x - 25, y + 12, x + 25, y + 12)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text(label, x, y + 18, { align: 'center' })
  })

  y += 28

//rodapé 

  doc.setFontSize(7)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(150, 150, 150)
  doc.text(
    'Documento simplificado para fins acadêmicos. Não substitui o MTR oficial do SINIR.',
    105, 287, { align: 'center' }
  )

//download

  doc.save(`${mtr.number}.pdf`)
}

//dados mockados p/ teste

export function gerarMTRMock(): void {
  gerarMTR(
    {
      number: 'MTR-2026-0042',
      issueDate: new Date().toISOString(),
      transporter: 'Elogística Transportes Especiais Ltda',
    },
    {
      description: 'Lodo de Tratamento de Efluentes',
      code: 'F006',
      class: 'I',
      quantity: 4500,
      unit: 'kg',
    },
    {
      corporateName: 'Metalúrgica Amazon Tech Ltda',
      cnpj: '23.111.444/0001-00',
    },
    {
      corporateName: 'EcoDestino Soluções Ambientais Ltda',
      cnpj: '12.345.678/0001-90',
      licenseNumber: 'LO-2023/882-A',
      issuingAgency: 'IPAAM',
      licenseExpiry: '2027-01-15',
    }
  )
}
