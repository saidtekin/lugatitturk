const inputField = document.getElementById('aramaKutusu');
const oneriAlani = document.getElementById('oneriAlani');
const sonucAlani = document.getElementById('sonucAlani');
const geriButonu = document.getElementById('geriButonu');

// ARAMA MOTORU ANA FONKSİYONU
async function kelimeAra(arananKelime) {
    let aranan = arananKelime.trim().toLowerCase();
    if (aranan === "") return;

    let ilkHarf = aranan.charAt(0);
    
    const turkceKarakterler = {
        'ı': 'i', 'ş': 's', 'ğ': 'g', 'ü': 'u', 'ö': 'o', 'ç': 'c'
    };
    if (turkceKarakterler[ilkHarf]) {
        ilkHarf = turkceKarakterler[ilkHarf];
    }

    try {
        const dosyaYolu = `veri/${ilkHarf}.json`;
        const response = await fetch(dosyaYolu);
        
        if (!response.ok) throw new Error("Dosya bulunamadı.");

        const harfKelimeleri = await response.json();
        const bulunan = harfKelimeleri.find(k => k.id === aranan);

        if (bulunan) {
            document.getElementById('kelimeAdi').innerText = bulunan.kelime;
            document.getElementById('kelimeArapca').innerText = bulunan.arapca;
            document.getElementById('orijinalAnlam').innerText = bulunan.orijinal;
            document.getElementById('guncelAnlam').innerText = bulunan.guncel;
            
            const savAlani = document.getElementById('savAlani');
            if (bulunan.sav && bulunan.sav.trim() !== "") {
                document.getElementById('savMetni').innerText = `"${bulunan.sav}"`;
                document.getElementById('savAnlamı').innerHTML = `<strong>Anlamı:</strong> ${bulunan.savAnlam}`;
                savAlani.style.display = "block";
            } else {
                savAlani.style.display = "none";
            }
            
            // Görünüm Ayarları: Önerileri Gizle, Sonucu Göster
            if(oneriAlani) oneriAlani.style.display = "none";
            sonucAlani.style.display = "block";
        } else {
            alert("Aradığınız kelime bu harfin veritabanında bulunamadı.");
        }

    } catch (error) {
        console.error("Sözlük Hatası:", error);
        alert("Bu harfe ait veritabanı dosyası henüz yüklenmemiş veya sistem hatası oluştu.");
    }
}

// Enter'a basınca ara
if (inputField) {
    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            kelimeAra(inputField.value);
        }
    });
}

// Öneri etiketlerine tıklayınca direkt arama yapma fonksiyonu
function oneriAra(kelime) {
    if(inputField) inputField.value = kelime;
    kelimeAra(kelime);
}

// GERİ DÖN / TEMİZLE BUTONU TETİKLEYİCİSİ
if (geriButonu) {
    geriButonu.addEventListener('click', function() {
        if(inputField) inputField.value = ""; // Giriş alanını temizle
        sonucAlani.style.display = "none";   // Sonuç kutusunu gizle
        if(oneriAlani) oneriAlani.style.display = "block"; // Önerileri geri getir
    });
}