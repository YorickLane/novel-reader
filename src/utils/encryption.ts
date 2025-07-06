/**
 * 内容加密工具
 * 使用 Web Crypto API 实现 AES-GCM 加密
 */

export class ContentEncryption {
  private static encoder = new TextEncoder()
  private static decoder = new TextDecoder()

  /**
   * 从密码派生密钥
   */
  private static async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const passwordKey = await crypto.subtle.importKey(
      'raw',
      this.encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    )

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      passwordKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
  }

  /**
   * 加密文本内容
   */
  static async encrypt(text: string, password: string): Promise<{
    encrypted: ArrayBuffer
    salt: Uint8Array
    iv: Uint8Array
  }> {
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const key = await this.deriveKey(password, salt)

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      this.encoder.encode(text)
    )

    return { encrypted, salt, iv }
  }

  /**
   * 解密文本内容
   */
  static async decrypt(
    encrypted: ArrayBuffer,
    password: string,
    salt: Uint8Array,
    iv: Uint8Array
  ): Promise<string> {
    const key = await this.deriveKey(password, salt)

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    )

    return this.decoder.decode(decrypted)
  }

  /**
   * 将加密数据转换为可存储的格式
   */
  static packEncryptedData(encrypted: ArrayBuffer, salt: Uint8Array, iv: Uint8Array): string {
    const data = new Uint8Array(salt.length + iv.length + encrypted.byteLength)
    data.set(salt, 0)
    data.set(iv, salt.length)
    data.set(new Uint8Array(encrypted), salt.length + iv.length)
    
    return btoa(String.fromCharCode(...data))
  }

  /**
   * 从存储格式解包加密数据
   */
  static unpackEncryptedData(packed: string): {
    encrypted: ArrayBuffer
    salt: Uint8Array
    iv: Uint8Array
  } {
    const data = new Uint8Array(
      atob(packed).split('').map(char => char.charCodeAt(0))
    )

    const salt = data.slice(0, 16)
    const iv = data.slice(16, 28)
    const encrypted = data.slice(28).buffer

    return { encrypted, salt, iv }
  }

  /**
   * 加密并打包（便捷方法）
   */
  static async encryptAndPack(text: string, password: string): Promise<string> {
    const { encrypted, salt, iv } = await this.encrypt(text, password)
    return this.packEncryptedData(encrypted, salt, iv)
  }

  /**
   * 解包并解密（便捷方法）
   */
  static async unpackAndDecrypt(packed: string, password: string): Promise<string> {
    const { encrypted, salt, iv } = this.unpackEncryptedData(packed)
    return this.decrypt(encrypted, password, salt, iv)
  }

  /**
   * 生成安全的随机密码
   */
  static generateSecurePassword(length: number = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    
    return Array.from(array, byte => chars[byte % chars.length]).join('')
  }

  /**
   * 哈希密码（用于验证，不用于加密）
   */
  static async hashPassword(password: string): Promise<string> {
    const msgBuffer = this.encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }
}