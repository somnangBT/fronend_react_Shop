// Official EMVCo / NBC Bakong & ABA KHQR Utility for SOMNANG YORN

// 1. Bakong Open API Account (Supports Dynamic Pricing & Automatic Paid Verification via NBC API)
export const BAKONG_API_ACCOUNT_ID = 'somnang_yorn@bkrt';
export const BAKONG_API_MERCHANT_NAME = 'SOMNANG YORN';

// 2. Direct ABA Bank Account (Static Dual-Currency P2P KHQR matched to YORN SOMNANG's ABA QR)
export const ABA_BAKONG_ID = 'abaakhppxxx@abaa';
export const ABA_USD_ACCOUNT = '007842694';
export const ABA_USD_ACCOUNT_DISPLAY = '007 842 694';
export const ABA_KHR_ACCOUNT = '007842707';
export const ABA_P2P_SIGNATURE = '75CA5C9F9F5B';
export const ABA_MERCHANT_NAME = 'SOMNANG YORN';
export const ABA_DISPLAY_NAME = 'YORN SOMNANG';
export const ABA_MERCHANT_CITY = 'Phnom Penh';

// Default exports aligned to Bakong API account
export const BAKONG_ACCOUNT_ID = BAKONG_API_ACCOUNT_ID;
export const BAKONG_MERCHANT_NAME = BAKONG_API_MERCHANT_NAME;

function tlv(tag, value) {
  const str = String(value);
  const len = String(str.length).padStart(2, '0');
  return `${tag}${len}${str}`;
}

export function crc16(data) {
  let crc = 0xFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

// Pure JS MD5 (UTF-8 safe, RFC 1321) for NBC Bakong check_transaction_by_md5
export function md5(input) {
  const bytes = new TextEncoder().encode(input);
  const len = bytes.length;
  const wordCount = (((len + 8) >> 6) + 1) * 16;
  const words = new Uint32Array(wordCount);

  for (let i = 0; i < len; i++) {
    words[i >> 2] |= bytes[i] << ((i % 4) * 8);
  }
  words[len >> 2] |= 0x80 << ((len % 4) * 8);
  words[wordCount - 2] = len * 8;
  words[wordCount - 1] = Math.floor((len * 8) / 0x100000000);

  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];
  const K = new Uint32Array(64);
  for (let i = 0; i < 64; i++) {
    K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000) >>> 0;
  }

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let i = 0; i < wordCount; i += 16) {
    let A = a0, B = b0, C = c0, D = d0;
    for (let j = 0; j < 64; j++) {
      let F, g;
      if (j < 16) {
        F = (B & C) | (~B & D);
        g = j;
      } else if (j < 32) {
        F = (D & B) | (~D & C);
        g = (5 * j + 1) % 16;
      } else if (j < 48) {
        F = B ^ C ^ D;
        g = (3 * j + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * j) % 16;
      }
      const sum = (A + F + K[j] + words[i + g]) >>> 0;
      A = D;
      D = C;
      C = B;
      B = (B + ((sum << S[j]) | (sum >>> (32 - S[j])))) >>> 0;
    }
    a0 = (a0 + A) >>> 0;
    b0 = (b0 + B) >>> 0;
    c0 = (c0 + C) >>> 0;
    d0 = (d0 + D) >>> 0;
  }

  return [a0, b0, c0, d0]
    .map((w) =>
      [0, 8, 16, 24]
        .map((shift) => ((w >>> shift) & 0xff).toString(16).padStart(2, '0'))
        .join('')
    )
    .join('');
}

/**
 * Generate NBC Bakong Open API compliant Dynamic Individual KHQR payload + MD5 hash.
 * Uses somnang_yorn@bkrt so NBC /v1/check_transaction_by_md5 verifies payment automatically.
 */
export function generateBakongApiKhqr({
  amount,
  currency = 'USD',
  bakongAccountId = BAKONG_API_ACCOUNT_ID,
  merchantName = BAKONG_API_MERCHANT_NAME,
  merchantCity = ABA_MERCHANT_CITY,
  expiresInMinutes = 15,
} = {}) {
  const numericAmount = Number(amount);
  const isDynamic = Number.isFinite(numericAmount) && numericAmount > 0;
  const isKhr = String(currency).toUpperCase() === 'KHR';

  const nowMs = Date.now();
  const expiresAt = nowMs + expiresInMinutes * 60 * 1000;

  let payload = '';
  payload += tlv('00', '01');
  payload += tlv('01', isDynamic ? '12' : '11');
  payload += tlv('29', tlv('00', bakongAccountId));
  payload += tlv('52', '5999');
  payload += tlv('53', isKhr ? '116' : '840');

  if (isDynamic) {
    const amountStr = isKhr
      ? String(Math.round(numericAmount))
      : numericAmount.toFixed(2);
    payload += tlv('54', amountStr);
  }

  payload += tlv('58', 'KH');
  payload += tlv('59', merchantName.slice(0, 25));
  payload += tlv('60', merchantCity.slice(0, 15));

  if (isDynamic) {
    payload += tlv('99', tlv('00', String(nowMs)) + tlv('01', String(expiresAt)));
  }

  payload += '6304';
  const qr = payload + crc16(payload);

  return {
    provider: 'bakong',
    qr,
    md5: md5(qr),
    expiresAt,
    accountId: bakongAccountId,
    accountName: merchantName,
  };
}

/**
 * Generate YORN SOMNANG's Official ABA Dual-Currency Static KHQR payload.
 * Uses Static P2P (010211) with ABA Tag 29 + Tag 40 so ALL Cambodian banks
 * scan & pay directly into ABA 007 842 694 without [Q0625] merchant invoice errors.
 */
export function generateAbaKhqr({ currency = 'USD' } = {}) {
  const isKhr = String(currency).toUpperCase() === 'KHR';
  const primaryAccount = isKhr ? ABA_KHR_ACCOUNT : ABA_USD_ACCOUNT;

  const tag29 =
    tlv('00', ABA_BAKONG_ID) +
    tlv('01', primaryAccount) +
    tlv('02', 'ABA Bank');

  const tag40 =
    tlv('00', 'abaP2P') +
    tlv('01', ABA_P2P_SIGNATURE) +
    tlv('02', ABA_KHR_ACCOUNT) +
    tlv('03', ABA_USD_ACCOUNT) +
    tlv('04', 'Dual');

  let payload = '';
  payload += tlv('00', '01');
  payload += tlv('01', '11');
  payload += tlv('29', tag29);
  payload += tlv('40', tag40);
  payload += tlv('52', '5999');
  payload += tlv('53', isKhr ? '116' : '840');
  payload += tlv('58', 'KH');
  payload += tlv('59', ABA_MERCHANT_NAME);
  payload += tlv('60', ABA_MERCHANT_CITY);
  payload += '6304';

  const qr = payload + crc16(payload);

  return {
    provider: 'aba',
    qr,
    md5: md5(qr),
    accountNumber: primaryAccount,
    accountDisplay: isKhr ? '007 842 707' : ABA_USD_ACCOUNT_DISPLAY,
    accountName: ABA_DISPLAY_NAME,
  };
}

export const generateBakongKhqr = generateBakongApiKhqr;
