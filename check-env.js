console.log('🔍 Checking environment variables...');

const requiredEnvVars = [
  'RDS_DB_NAME',
  'RDS_USERNAME', 
  'RDS_PASSWORD',
  'RDS_HOSTNAME'
];

requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar}: ${envVar.includes('PASSWORD') ? '***' : process.env[envVar]}`);
  } else {
    console.log(`❌ ${envVar}: NOT FOUND`);
  }
});

console.log('\n📋 Complete process.env:');
console.log({
  RDS_DB_NAME: process.env.RDS_DB_NAME,
  RDS_USERNAME: process.env.RDS_USERNAME,
  RDS_PASSWORD: process.env.RDS_PASSWORD ? '***' : 'NOT SET',
  RDS_HOSTNAME: process.env.RDS_HOSTNAME,
  RDS_PORT: process.env.RDS_PORT || '3306 (default)',
  NODE_ENV: process.env.NODE_ENV || 'not set'
});