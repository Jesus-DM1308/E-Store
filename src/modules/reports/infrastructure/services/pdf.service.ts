import PDFDocument from 'pdfkit';
import { SalesReportEntity } from '../../domain/index.js';



export class PdfService {


    // metodo para que las fechas tengan el formato dd/mm/yyyy
    private static formatDateUTC(fechaInput: Date): string {
        const date = new Date(fechaInput);
        const dia = String(date.getUTCDate()).padStart(2, '0');
        const mes = String(date.getUTCMonth() + 1).padStart(2, '0');
        const anio = date.getUTCFullYear();
        return `${dia}/${mes}/${anio}`;
    }

    // metodo para el formato de la moneta
    private static formatCurrency(value: number): string {
        return value.toLocaleString('es-MX', { 
        style: 'currency', 
        currency: 'MXN' 
        });
    }

    static generateSalesReport(report: SalesReportEntity): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument();
            const chunks: Buffer[] = [];


            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', (err) => reject(err));

            
            doc.fontSize(28).font('Helvetica-Bold').fillColor('#1a1a1a')
                .text('E_Store', { align: 'center' })
                .moveDown(1);

            doc.fontSize(16).font('Helvetica').fillColor('#555555')
                .text('Reporte de Ventas de Vendedor', { align: 'center' })
                .moveDown(0.5);

            doc.fontSize(12).fillColor('#777777')
                .text(`Vendedor: ${report.sellerName}`, { align: 'center' })
                .moveDown(2);


            // fecha del reporte
            const periodText = `Reporte del Periodo: ${this.formatDateUTC(report.startDate)} - ${this.formatDateUTC(report.endDate)}`;
            doc.fontSize(14).font('Helvetica-Bold').fillColor('#1a1a1a')
                .text(periodText, { align: 'center' })
                .moveDown(2);


            // doc.font('Helvetica').fontSize(12).fillColor('#333333');

            // doc.text(`• Ordenes Exitosas: ${report.successfulOrders}`).moveDown(0.5);

            // doc.text(`• Ordenes Reembolsadas: ${report.refundedOrders}`).moveDown(0.5);
            
            // doc.text(`• Ganancias Totales: ${this.formatCurrency(report.totalEarnings)}`).moveDown(0.5)

            // doc.text(`• Ticket Promedio: ${this.formatCurrency(report.averageTicket)}`).moveDown(0.5)
            
            // doc.text(`• Producto Más Vendido: ${report.topSellingProduct}`).moveDown(2);


        
            // coordenadas para la tabla
            const tableTop = doc.y;
            const labelX = 50; 
            const valueX = 350; 
            const rowHeight = 30;
            const tableWidth = 500


            // los datos de la tabla en un arreglo
            const tableData = [
                { label: 'Ordenes Exitosas', value: report.successfulOrders.toString() },
                { label: 'Ordenes Reembolsadas', value: report.refundedOrders.toString() },
                { label: 'Ganancias Totales', value: this.formatCurrency(report.totalEarnings) },
                { label: 'Ticket Promedio', value: this.formatCurrency(report.averageTicket) },
                { label: 'Producto Más Vendido', value: report.topSellingProduct }
            ];

            // un FOR para poner cada fila de la tabla
            tableData.forEach((row, index) => {

                const currentY = tableTop + ( index * rowHeight );

                // este en si pone las metricas
                doc.font('Helvetica-Bold').fontSize(11).fillColor('#444444')
                    .text(row.label, labelX, currentY + 10 )

                // los valores de cada metrica
                doc.font('Helvetica').fontSize(11).fillColor('#1a1a1a')
                    .text(row.value, valueX, currentY + 10 )

                //linea horizontal para separar cada fila
                doc.moveTo(labelX, currentY + rowHeight)
                    .lineTo(labelX + tableWidth, currentY + rowHeight)
                    .lineWidth(0.5)
                    .strokeColor('#e0e0e0')
                    .stroke()
                    
            })

       
            doc.end();
            
        })

    }

}