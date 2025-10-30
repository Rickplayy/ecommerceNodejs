
const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const { sendEmail } = require('../services/emailService');
const auth = require('../middleware/auth');
const User = require('../models/User');

router.post('/generate-pdf', auth, async (req, res) => {
    try {
        const { items, total, last4 } = req.body;
        const userId = req.userData.userId;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Calculate subtotal and tax
        const subtotal = total / 1.16;
        const tax = total - subtotal;

        const logoPath = path.join(__dirname, '../public/logotipo_normal.png');
        const logoBuffer = fs.readFileSync(logoPath);
        const logoDataUri = `data:image/png;base64,${logoBuffer.toString('base64')}`;

        const data = {
            items,
            total: total.toFixed(2),
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            customerName: user.name, // Use user's name from DB
            last4,
            orderId: Math.floor(Math.random() * 1000000),
            date: new Date().toLocaleDateString(),
            logoDataUri
        };

        const templatePath = path.join(__dirname, '../templates/ticket.html');
        const templateHtml = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(templateHtml);
        const html = template(data);

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium'
        });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();

        // Send email with PDF attachment
        await sendEmail({
            to: user.email, // Use user's email from DB
            subject: 'Tu ticket de compra en ROCKPA',
            html: `<h1>Gracias por tu compra, ${user.name}</h1><p>Adjunto encontrarás el ticket de tu compra.</p>`,
            attachments: [
                {
                    filename: 'ticket.pdf',
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        });

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
            'Content-Disposition': 'attachment; filename=ticket.pdf'
        });
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});

module.exports = router;
