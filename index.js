import passkit from "passkit-generator";
const PKPass = passkit.PKPass;

import path from "path"
import fs from "fs"
import crypto from 'crypto'

const passID = crypto.createHash('md5').update(`${'Andrea Facheris'}_${Date.now()}`).digest('hex')

const certDirectory = path.resolve(process.cwd(), 'certs');
const wwdr = fs.readFileSync(path.join(certDirectory, 'wwdr.pem'));
const signerCert = fs.readFileSync(path.join(certDirectory, 'signerCert.pem'));
const signerKey = fs.readFileSync(path.join(certDirectory, 'signerKey.pem'));
const signerKeyPassphrase = 'cloud3.0'

try {
	const pass = await PKPass.from({
		model: path.resolve(process.cwd(), 'cloud3.0.pass'),
		certificates: {
			signerCert,
			signerKey,
			wwdr,
			signerKeyPassphrase
		},

	},
	 {
      serialNumber: passID,
    });

pass.setBarcodes({
	message: "https://apicci.cloud/cloud3",
	format: "PKBarcodeFormatQR",
	//altText: "text"
});
	// Generate the stream, which gets returned through a Promise
 const stream = pass.getAsBuffer();

  fs.writeFileSync("test.pkpass",stream);

} catch (err) {
	console.log(err);
}
