const puppeteer = require('puppeteer');

const pdf = {
    createPDF: async function (req, res) {
        const text = req.body.text;

        if (!text) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/pdf",
                    title: "Text not sent",
                    details: "Text missing from body"
                }
            });
        }

        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        let page = await browser.newPage();

        await page.setContent(text);

        let pdf2 = await page.pdf();

        await browser.close();

        return res.send(pdf2);
    }
};

module.exports = pdf;
