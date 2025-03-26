import { formatNumberToVnCurrency, translateBillKey } from '@/lib/utils'
import { IBill } from '@/types/backend.type'
import { format } from 'date-fns'
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'

export const exportBillToPDF = async (bill: IBill) => {
  if (!bill) return

  try {
    // Create a new div for printing
    const printContainer = document.createElement('div')
    printContainer.style.position = 'absolute'
    printContainer.style.left = '-9999px'
    printContainer.style.top = '-9999px'
    printContainer.style.width = '600px' // Fixed width for better rendering
    printContainer.style.height = '500px' // Reduced height for more compact PDF
    printContainer.style.padding = '40px'
    printContainer.style.backgroundColor = 'white'
    printContainer.style.zIndex = '-1'

    printContainer.innerHTML = `
        <div style="font-family: Arial, sans-serif; color: black;">
          <h2 style="margin-bottom: 20px; text-align: center; font-size: 24px; color: #2563eb; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Smart Order</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold; width: 200px;">${translateBillKey('billCode')}</td>
                <td style="padding: 10px;">${bill.billCode}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold;">${translateBillKey('customerCode')}</td>
                <td style="padding: 10px;">${bill.customerCode}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold;">${translateBillKey('orderItems')}</td>
                <td style="padding: 10px;">
                  <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${bill.orderItems
                      .map(
                        (item, index) => `
                      <div style="display: flex; justify-content: space-between; gap: 5px;">
                        <div style="font-weight: bold;">${index + 1}.</div>
                        <div style="flex-grow: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.dish?.title || ''}</div>
                        <div>x${item.quantity}</div>
                      </div>
                    `
                      )
                      .join('')}
                  </div>
                </td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold;">${translateBillKey('createdAt')}</td>
                <td style="padding: 10px;">${format(bill.createdAt, 'dd/MM/yyyy hh:mm:ss a')}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; width: 200px;">Tổng tiền:</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px;">
                  ${formatNumberToVnCurrency(bill.totalPrice)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      `

    // Add to document
    document.body.appendChild(printContainer)

    // Wait a bit to ensure rendering
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Capture with html2canvas
    const canvas = await html2canvas(printContainer, {
      scale: 2,
      useCORS: true,
      logging: true,
      allowTaint: true,
      backgroundColor: 'white',
      onclone: (clonedDoc, element) => {
        element.style.display = 'block'
      }
    })

    // Remove the print container
    document.body.removeChild(printContainer)

    // Create PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // Calculate dimensions
    const imgWidth = 210 - 40 // A4 width minus margins
    const pageHeight = 297 // A4 height
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // Add image to PDF with padding
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight)

    // Save the PDF
    pdf.save(`bill-${bill.billCode}.pdf`)
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Có lỗi khi tạo PDF. Vui lòng thử lại.')
  }
}
