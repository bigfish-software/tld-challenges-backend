const crypto = require('crypto');

console.log('Railway Environment Variables:');
console.log('Copy these to Railway dashboard → Backend Service → Variables tab');
console.log('');

const appKeys = Array.from({length: 4}, () => crypto.randomBytes(32).toString('base64'));

console.log('APP_KEYS=' + appKeys.join(','));
console.log('API_TOKEN_SALT=' + crypto.randomBytes(32).toString('base64'));
console.log('ADMIN_JWT_SECRET=' + crypto.randomBytes(32).toString('base64'));
console.log('TRANSFER_TOKEN_SALT=' + crypto.randomBytes(32).toString('base64'));
console.log('JWT_SECRET=' + crypto.randomBytes(32).toString('base64'));
console.log('');
console.log('Additional Railway variables:');
console.log('NODE_ENV=production');
console.log('DATABASE_URL=${{ PostgreSQL.DATABASE_URL }}');
console.log('HOST=0.0.0.0');
console.log('PORT=$PORT');