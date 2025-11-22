// generate_single_audio.js

import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Bu yardımcı fonksiyon, bir Readable Stream'i Buffer'a dönüştürür.
// Bu, fs.writeFileSync'ın stream yerine ham veri (Buffer) almasını sağlar.
function streamToBuffer(stream) {
  // Handle multiple possible stream-like return types from SDK:
  // - Node.js Readable (has .on)
  // - AsyncIterable (for await..of)
  // - Web ReadableStream (has getReader)
  // - Buffer / Uint8Array / ArrayBuffer
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        // Already a Buffer
        if (Buffer.isBuffer(stream)) return resolve(stream);

        // Node.js Readable (Event Emitter style)
        if (stream && typeof stream.on === 'function') {
          const chunks = [];
          stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
          stream.on('end', () => resolve(Buffer.concat(chunks)));
          stream.on('error', reject);
          return;
        }

        // Async iterable (for-await-of)
        if (stream && typeof stream[Symbol.asyncIterator] === 'function') {
          const chunks = [];
          for await (const chunk of stream) {
            chunks.push(Buffer.from(chunk));
          }
          return resolve(Buffer.concat(chunks));
        }

        // Web ReadableStream (browser-like) with getReader
        if (stream && typeof stream.getReader === 'function') {
          const reader = stream.getReader();
          const chunks = [];
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(Buffer.from(value));
          }
          return resolve(Buffer.concat(chunks));
        }

        // Response-like object with arrayBuffer()
        if (stream && typeof stream.arrayBuffer === 'function') {
          const ab = await stream.arrayBuffer();
          return resolve(Buffer.from(ab));
        }

        // Uint8Array / ArrayBuffer
        if (stream instanceof Uint8Array) return resolve(Buffer.from(stream));
        if (stream instanceof ArrayBuffer) return resolve(Buffer.from(new Uint8Array(stream)));

        return reject(new Error('Unsupported stream type'));
      } catch (err) {
        return reject(err);
      }
    })();
  });
}

// .env dosyasından ortam değişkenlerini yükle
dotenv.config();

async function generateSingleAudio() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const outputDir = 'audio';
  const outputFileName = path.join(outputDir, "final_audio.mp3"); 

  if (!apiKey) {
    console.error("HATA: ELEVENLABS_API_KEY ortam değişkeni ayarlanmamış.");
    return;
  }

  // Çıktı klasörünü oluştur
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir);
  }

  // ElevenLabs istemcisini başlat
  const client = new ElevenLabsClient({ apiKey });

  const fullText = `
    Test videoma hoş geldiniz! Bu video, bir hastane randevu yönetim sisteminde kullanıcı akışını göstermektedir.
    
    Uzmanlık alanı ve doktor seçildikten sonra hasta bilgileri, ad, soyad giriliyor ve takvimden uygun bir tarih seçiliyor. Ardından randevu oluştur butonuna tıklayarak randevu başarıyla kaydediliyor.
    
    Şimdi randevu listesi ekranına giderek oluşturulan bu randevu görüntüleniyor ve iptal et butonuna tıklanıp randevu sistemden kaldırılıyor. İşlem tamamlandı.
  `;

  // Ses Ayarları ve Model
  const voiceId = "21m00Tcm4TlvDq8ikWAM"; 
  const modelId = "eleven_multilingual_v2"; 
  const voiceSettings = {
    stability: 0.6,
    similarityBoost: 0.75,
    speed: 1.0,
    useSpeakerBoost: true,
  };

  try {
    console.log("--- ElevenLabs Tek Parça Ses Üretimi Başladı ---");

    // 1. API'den Stream olarak veriyi al
    const audioStream = await client.textToSpeech.convert(voiceId, {
      text: fullText,
      modelId: modelId,
      outputFormat: "mp3_44100_128",
      voiceSettings: voiceSettings,
    });
    
    // 2. Stream'i Buffer'a dönüştür
    const audioBuffer = await streamToBuffer(audioStream);

    // 3. Buffer'ı dosyaya yaz
    writeFileSync(outputFileName, audioBuffer);

    console.log(`Kaydedildi: ${outputFileName}`);

  } catch (e) {
    console.error(`Hata: '${outputFileName}' üretilemedi. Mesaj: ${e.message}`);
    return;
  }
  
  console.log("--- Ses dosyası başarıyla hazırlandı. ---");
}

generateSingleAudio();