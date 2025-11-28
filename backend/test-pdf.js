const axios = require('axios');
const fs = require('fs');

async function testPdfGeneration() {
    try {
        const response = await axios.post('http://localhost:3000/api/generate-receipt', {
            amount: '100.00',
            authorization: '123456',
            reference: 'REF-TEST',
            audit: 'AUD-TEST',
            linkCode: 'LINK-TEST'
        }, {
            responseType: 'arraybuffer' // Important for binary data
        });

        if (response.status === 200) {
            fs.writeFileSync('test_receipt.pdf', response.data);
            console.log('✅ PDF generated successfully and saved to test_receipt.pdf');
        } else {
            console.log('❌ Failed: Status code', response.status);
        }
    } catch (error) {
        console.error('❌ Error generating PDF:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data.toString());
        }
    }
}

testPdfGeneration();
