import PDFDocument from 'pdfkit';
import { SalesReportEntity } from '../../domain/index.js';



export class PdfService {

  static generateSalesReport(report: SalesReportEntity): Promise<Buffer> {

    return new Promise((resolve, reject) => {
      
        const doc = new PDFDocument();
        const chunks: Buffer[] = [];

        // meter la info del reporte en el PDF
        doc.on('data', (chunk) => chunks.push(chunk));
        //terminar
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        // cachar errore
        doc.on('error', (err) => reject(err));

      
        doc.fontSize(28).font('Helvetica-Bold').fillColor('#1a1a1a')
            .text('E_Store', { align: 'center' });
        doc.moveDown(1)

    
        doc.fontSize(16).font('Helvetica').fillColor('#555555')
            .text('Reporte de Ventas de Vendedor', { align: 'center' });
        doc.moveDown(0.5)

    
        doc.fontSize(12).fillColor('#777777')
            .text(`Vendedor: ${report.sellerName}`, { align: 'center' });
        doc.moveDown(2)

        
        const formatDateUTC = (fechaInput: Date) => {
            const date = new Date(fechaInput);
            const dia = String(date.getUTCDate()).padStart(2, '0')
            const mes = String(date.getUTCMonth() + 1).padStart(2, '0');
            const anio = date.getUTCFullYear()
  
            return `${dia}/${mes}/${anio}`;
        }

        doc.fontSize(14).font('Helvetica-Bold').fillColor('#1a1a1a')
            .text(`Reporte del Periodo: ${formatDateUTC(report.startDate)} - ${formatDateUTC(report.endDate)}`, { align: 'center' });
        doc.moveDown(2);

 
        doc.font('Helvetica').fontSize(12).fillColor('#333333')

        doc.text(`• Órdenes Exitosas: ${report.successfulOrders}`);
        doc.moveDown(0.5)

        doc.text(`• Órdenes Reembolsadas: ${report.refundedOrders}`);
        doc.moveDown(0.5)
        
        const formattedEarnings = report.totalEarnings.toLocaleString('es-MX', { 
                style: 'currency', 
                currency: 'MXN' 
            })

        doc.text(`• Ganancias Totales: ${formattedEarnings}`);
        doc.moveDown(0.5);

        const averageFormatted = report.averageTicket.toLocaleString('es-MX', { 
            style: 'currency', 
            currency: 'MXN' 
            });
            
        doc.text(`• Ticket Promedio: ${averageFormatted}`);
        doc.moveDown(0.5);

        doc.text(`• Producto Más Vendido: ${report.topSellingProduct}`);
        doc.moveDown(2);
        
  

      doc.end()

    })


  }
}