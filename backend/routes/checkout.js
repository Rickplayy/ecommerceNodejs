
const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const { sendEmail } = require('../services/emailService');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');

router.post('/generate-pdf', auth, async (req, res) => {
    try {
        const { items, total, last4, bank } = req.body;
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
            total: Number(total).toFixed(2),
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            customerName: user.name, // Use user's name from DB
            last4,
            bank: bank || 'Tarjeta Bancaria',
            orderId: Math.floor(Math.random() * 1000000),
            date: new Date().toLocaleDateString(),
            logoDataUri
        };

        const templatePath = path.join(__dirname, '../templates/ticket.html');
        const templateHtml = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(templateHtml);
        const html = template(data);

        const launchOptions = {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        };

        if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
            launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
        }

        const fallbackPaths = [
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
            'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
            '/usr/bin/chromium',
            '/usr/bin/google-chrome',
            '/usr/bin/chromium-browser'
        ];

        let browser;
        try {
            browser = await puppeteer.launch(launchOptions);
        } catch (launchErr) {
            console.warn('Standard Puppeteer launch failed, trying system browsers:', launchErr.message);
            for (const p of fallbackPaths) {
                if (fs.existsSync(p)) {
                    try {
                        browser = await puppeteer.launch({ ...launchOptions, executablePath: p });
                        break;
                    } catch (e) {
                        // continue
                    }
                }
            }
            if (!browser) throw launchErr;
        }
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

        // Clear user's cart in database after successful purchase
        try {
            const userCart = await Cart.findOne({ where: { UserId: userId } });
            if (userCart) {
                await CartItem.destroy({ where: { CartId: userCart.id } });
            }
        } catch (clearErr) {
            console.error('Error clearing cart after purchase:', clearErr);
        }

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
