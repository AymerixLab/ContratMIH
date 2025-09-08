import { COLORS } from './constants';

export const CSS_STYLES = `
body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f8f9fa;
    color: #333;
}
.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
.header {
    background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%);
    color: white;
    padding: 30px;
    text-align: center;
}
.header h1 {
    margin: 0;
    font-size: 28px;
    font-weight: bold;
}
.header p {
    margin: 10px 0 0 0;
    font-size: 16px;
    opacity: 0.9;
}
.content {
    padding: 30px;
}
.info-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-bottom: 30px;
}
.info-box {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid ${COLORS.secondary};
}
.info-box h3 {
    margin: 0 0 15px 0;
    color: ${COLORS.primary};
    font-size: 16px;
    font-weight: bold;
}
.info-box p {
    margin: 5px 0;
    font-size: 14px;
    line-height: 1.4;
}
.devis-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}
.devis-table th {
    background: ${COLORS.secondary};
    color: white;
    padding: 15px;
    text-align: left;
    font-weight: bold;
    font-size: 14px;
}
.devis-table td {
    padding: 12px 15px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
}
.devis-table tr:nth-child(even) {
    background-color: #f8f9fa;
}
.total-section {
    background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%);
    color: white;
    padding: 25px;
    border-radius: 10px;
    text-align: center;
    margin-top: 30px;
}
.total-section h2 {
    margin: 0 0 15px 0;
    font-size: 24px;
}
.total-details {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 20px;
}
.total-item {
    background: rgba(255,255,255,0.1);
    padding: 15px;
    border-radius: 8px;
}
.total-item .label {
    font-size: 14px;
    opacity: 0.9;
    margin-bottom: 5px;
}
.total-item .value {
    font-size: 18px;
    font-weight: bold;
}
.footer {
    background: #f8f9fa;
    padding: 20px;
    text-align: center;
    border-top: 2px solid ${COLORS.secondary};
    font-size: 12px;
    color: #666;
}
@media print {
    body { background: white; }
    .container { box-shadow: none; }
}
`;

export const CONTRACT_STYLES = `
${CSS_STYLES}
body {
    line-height: 1.6;
}
.section {
    margin-bottom: 30px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid ${COLORS.secondary};
}
.section h2 {
    margin: 0 0 15px 0;
    color: ${COLORS.primary};
    font-size: 18px;
    font-weight: bold;
}
.field-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 15px;
}
.field {
    display: flex;
    flex-direction: column;
}
.field label {
    font-weight: bold;
    color: ${COLORS.primary};
    margin-bottom: 5px;
    font-size: 14px;
}
.field .value {
    padding: 8px 12px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}
.totals-section {
    background: ${COLORS.primary};
    color: white;
    padding: 25px;
    border-radius: 10px;
    margin: 20px 0;
}
.totals-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    margin-bottom: 20px;
}
.total-box {
    background: rgba(255,255,255,0.1);
    padding: 15px;
    border-radius: 8px;
    text-align: center;
}
.signature-section {
    background: ${COLORS.secondary};
    color: white;
    padding: 25px;
    border-radius: 10px;
    margin-top: 30px;
}
.signature-section h2 {
    margin: 0 0 20px 0;
    color: white;
}
.signature-box {
    background: rgba(255,255,255,0.1);
    padding: 15px;
    border-radius: 8px;
    min-height: 100px;
    margin-top: 15px;
    white-space: pre-wrap;
}
`;