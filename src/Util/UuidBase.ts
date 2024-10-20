const HEX_CHARS = '0123456789abcdef'.split("");

const UUID_BYTES_TEMPLATE = [
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0
];

class UuidBase {
  private alphabet: string[];
  private base: number;
  private minBaseStringLength;

  public constructor(alphabet: string) {
    this.alphabet = alphabet.split("");
    this.base = alphabet.length;
    this.minBaseStringLength = Math.floor(128 / Math.log2(this.base));
  }

  public encode(uuid: string): string | undefined {
    const bytes = uuid.replaceAll('-', '');
    if (bytes.length !== 32) {
      return undefined;
    }

    const base = this.base;
    const buffer: number[] = new Array(this.minBaseStringLength);
    buffer[0] = 0;
    let index = 1;
    for (let i = 0; i < 16; i++) {
      const byte = (this.parseHexChar(bytes.charCodeAt(i * 2)) << 4) | this.parseHexChar(bytes.charCodeAt(i * 2 + 1));
      let carry = byte;
      for (let j = 0; j < index; j++) {
        const value = buffer[j] * 256 + carry;
        buffer[j] = value % base;
        carry = 0 | (value / base);
      }

      while (carry > 0) {
        buffer[index] = (carry % base);
        index++;
        carry = 0 | (carry / base);
      }
    }

    let result = "";
    for (let i = buffer.length - 1; i >= 0; i--) {
      result += this.alphabet[buffer[i]];
    }

    return result;

  }

  private parseHexChar(charCode1: number): number {
    if (charCode1 >= 48 && charCode1 <= 57) {
      return charCode1 - 48; // '0'-'9'
    } else if (charCode1 >= 97 && charCode1 <= 102) {
      return charCode1 - 97 + 10; // 'a'-'f'
    } else if (charCode1 >= 65 && charCode1 <= 70) {
      return charCode1 - 65 + 10; // 'A'-'F'
    } else {
      return 999;
    }
  }

  public decode(baseString: string): string | undefined {
    if (baseString.length < this.minBaseStringLength || baseString > this.minBaseStringLength+1) {
      return undefined;
    }

    const base = this.base;
    const len = baseString.length;
    const decodedBytes = [...UUID_BYTES_TEMPLATE];

    for (let i = 0; i < len; i++) {
      const charCode = baseString.charCodeAt(i);
      let index: number;
      if (charCode >= 48 && charCode <= 57) {
        index = charCode - 48;        // '0' - '9'
      } else if (charCode >= 97 && charCode <= 122) {
        index = charCode - 97 + 10;   // 'a' - 'z'
      } else if (charCode >= 65 && charCode <= 90) {
        index = charCode - 65 + 36;   // 'A' - 'Z'
      } else {
        return undefined;
      }

      let carry = index;
      for (let j = 15; j >= 0; j--) {
        const value = decodedBytes[j] * base + carry;
        decodedBytes[j] = value % 256;
        carry = 0|(value / 256);
      }
    }

    let result = '';
    for (let i = 0; i < 16; i++) {
      const byte = decodedBytes[i];
      result += HEX_CHARS[(byte >> 4) & 0xf];
      result += HEX_CHARS[byte & 0xf];

      // Insert dashes at appropriate positions for the UUID format (8-4-4-4-12)
      if (i === 3 || i === 5 || i === 7 || i === 9) {
        result += '-';
      }
    }

    return result;
  }
}

export const Base62 = new UuidBase("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
export const Base36 = new UuidBase("0123456789abcdefghijklmnopqrstuvwxyz");
