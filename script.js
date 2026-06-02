const inputField = document.getElementById('aramaKutusu');

if (inputField) {
    inputField.addEventListener('keypress', async function(e) {
        if (e.key === 'Enter') {
            // Yazılan kelimeyi temizle ve küçük harfe çevir
            let aranan = inputField.value.trim().toLowerCase();
            if (aranan === "") return;

            // İlk harfi bul
            let ilkHarf = aranan.charAt(0);
            
            // Klasör ismi hatası olmaması için Türkçe karakterleri İngilizceye çeviriyoruz (Örn: "ç" -> "c")
            const turkceKarakterler = {
                'ı': 'i', 'ş': 's', 'ğ': 'g', 'ü': 'u', 'ö': 'o', 'ç': 'c'
            };
            if (turkceKarakterler[ilkHarf]) {
                ilkHarf = turkceKarakterler[ilkHarf];
            }

            const sonucAlani = document.getElementById('sonucAlani');

            try {
                // Dinamik dosya yolu: veri/a.json, veri/b.json, veri/c.json...
                const dosyaYolu = `veri/${ilkHarf}.json`;
                
                const response = await fetch(dosyaYolu);
                
                if (!response.ok) {
                    throw new Error("Dosya bulunamadı.");
                }

                const harfKelimeleri = await response.json();
                
                // Kelimeyi dosyanın içinde ara
                const bulunan = harfKelimeleri.find(k => k.id === aranan);

                if (bulunan) {
                    // HTML Alanlarını Doldur
                    document.getElementById('kelimeAdi').innerText = bulunan.kelime;
                    document.getElementById('kelimeArapca').innerText = bulunan.arapca;
                    document.getElementById('orijinalAnlam').innerText = bulunan.orijinal;
                    document.getElementById('guncelAnlam').innerText = bulunan.guncel;
                    
                    // Sav (Atasözü) Kontrolü
                    const savAlani = document.getElementById('savAlani');
                    if (bulunan.sav && bulunan.sav.trim() !== "") {
                        document.getElementById('savMetni').innerText = `"${bulunan.sav}"`;
                        document.getElementById('savAnlamı').innerHTML = `<strong>Anlamı:</strong> ${bulunan.savAnlam}`;
                        savAlani.style.display = "block";
                    } else {
                        savAlani.style.display = "none";
                    }
                    
                    // Sonucu Göster
                    sonucAlani.style.display = "block";
                } else {
                    sonucAlani.style.display = "none";
                    alert("Aradığınız kelime bu harfin veritabanında bulunamadı.");
                }

            } catch (error) {
                console.error("Sözlük Hatası:", error);
                sonucAlani.style.display = "none";
                alert("Bu harfe ait veritabanı dosyası (veri/" + ilkHarf + ".json) henüz yüklenmemiş veya sistem hatası oluştu.");
            }
        }
    });
}