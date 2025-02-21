import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/players', async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        await page.goto('https://growtopiagame.com/detail', { waitUntil: 'networkidle2' });

        const onlinePlayers = await page.evaluate(() => {
            const el = document.querySelector('#onlineUser'); 
            return el ? el.innerText.trim() : 'N/A';
        });

        await browser.close();
        res.json({ onlinePlayers });
    } catch (error) {
        res.status(500).json({ error: 'Scraping failed', details: error.message });
    }
});

app.listen(PORT, () => console.log(`API running on port ${PORT}`));
