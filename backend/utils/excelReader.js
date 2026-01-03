import XLSX from 'xlsx'

export const readExcel = (path) => {
  const wb = XLSX.readFile(path)
  const sheet = wb.Sheets[wb.SheetNames[0]]
  return XLSX.utils.sheet_to_json(sheet)
}
