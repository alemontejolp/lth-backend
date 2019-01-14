'use strict';

const crypto = require('crypto');
const fs = require('fs');

let private_key = fs.readFileSync('../cert/private.key', { encoding: 'utf8' });
let public_key = fs.readFileSync('../cert/public.pem', { encoding: 'utf8' });
//let message = 'Una contraseña';
let message = 'Una contraseña mas largas  uashasgdysagdtasyfdysad';
let wrongMessage = 'Un mensaje que no es el correcto';

let sign = crypto.createSign('SHA256');
sign.write(message);
sign.end();

let signature = sign.sign(private_key, 'base64');
//base64 genera cadenas de longitud fija de 344 bytes.
//latin1 256, cabe en un tinytext...
//let signature = sign.sign(private_key);
console.log('signature:');
console.log(signature);
console.log('Length: ' + signature.length);

let verify = crypto.createVerify('SHA256');
verify.write(message);
verify.end();

let verified = verify.verify(public_key, signature, 'latin1');
//let verified = verify.verify(public_key, signature);
console.log('verified:');
console.log(verified);

let wrongVerify = crypto.createVerify('SHA256');
wrongVerify.write(wrongMessage);
wrongVerify.end();

let wrongVerified = wrongVerify.verify(public_key, signature, 'latin1');
//let wrongVerified = wrongVerify.verify(public_key, signature);
console.log('wrong verification:');
console.log(wrongVerified);
