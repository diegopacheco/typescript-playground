# typescript-essentials-pii-aes

Encrypting PII with AES-256-GCM using only Node's `node:crypto`: `scrypt` key derivation, `randomBytes` IV, authenticated encryption, and tamper detection via the auth tag.

### How it works

`src/main.ts` derives a 32-byte key with `scryptSync`, encrypts a plaintext with `aes-256-gcm` and a random 12-byte IV, keeps the auth tag, decrypts back, and shows that flipping one ciphertext byte makes `final()` throw because the tag no longer authenticates.

### Run

```bash
./run.sh
```

### Output

```
ciphertext: 5123429f81090b2fdba56ef890daf7
iv/tag lengths: 24 32
decrypted: SSN 123-45-6789
tamper detected: Unsupported state or unable to authenticate data
```
