const forge = require('node-forge');
const fs = require('fs');
const PropertiesReader = require('properties-reader');

const properties = PropertiesReader('./keystore.properties');
var pswd = properties.get('keystore.password');

console.log("Password to store: <<<"+pswd+">>>\n");

var pem = fs.readFileSync('./cert.pem', 'utf8');
var certificate = forge.pki.certificateFromPem(pem);
var publicKey = certificate.publicKey;

var buffer = Buffer.from(pswd, 'utf8');
var forgeBuffer = forge.util.createBuffer(buffer.toString('binary'));
var sskEnc = publicKey.encrypt(forgeBuffer.getBytes(), 'RSA-OAEP');

console.log("Password Encrypted Decoded: <<<"+sskEnc+">>>, len: "+sskEnc.length+"\n");
var sskB64 = forge.util.encode64(sskEnc);
console.log("Password Encrypted Encoded B64: <<<"+sskB64+">>>\n");


console.log("\n\n");


let buffer4Persistence = Buffer.from(sskB64, 'utf8');
fs.writeFileSync('keystore.b64', buffer4Persistence, (err) => {
    if (err) {
        console.error('The b64 file couldn\'t been saved!');
    } else {
        console.log('The b64 file has been saved!');
    }
});

let buffer4PersistenceBin = Buffer.from(sskEnc, 'binary');
fs.writeFileSync('keystore.bin', buffer4PersistenceBin, (err) => {
    if (err) {
        console.error('The bin file couldn\'t been saved!');
    } else {
        console.log('The bin file has been saved!');
    }
});


/*
var sskB64RX = sskB64;
console.log("Supoused RX-Simetric Key B64: <<<"+sskB64RX+">>>\n");

var sskRXEncDecoded = forge.util.decode64(sskB64RX);

var pem2 = fs.readFileSync('./key.pem', 'utf8');
var key = forge.pki.privateKeyFromPem(pem2);

var sskRXEncDecodedBinBuffer = Buffer.from(sskRXEncDecoded, 'binary');
console.log("sskRXEncDecodedBinBuffer: <<<"+sskRXEncDecodedBinBuffer.toString('hex')+">>>");
var forgeBufferSskRXEncDecodedBinBufferCreated = forge.util.createBuffer(sskRXEncDecodedBinBuffer.toString('binary'));
console.log("forgeBufferSskRXEncDecodedBinBufferCreated: <<<"+forgeBufferSskRXEncDecodedBinBufferCreated.bytes()+">>>, len: "+forgeBufferSskRXEncDecodedBinBufferCreated.bytes().length);
var sskRXDecrypted = key.decrypt(forgeBufferSskRXEncDecodedBinBufferCreated.bytes(), 'RSA-OAEP');

console.log("SSK Decrypted: <<<"+sskRXDecrypted+">>>\n");
*/