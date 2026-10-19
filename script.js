document.addEventListener('DOMContentLoaded', () => {
  const toastEl = document.getElementById('siteToast');
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3600 });
  const showToast = (message) => {
    document.getElementById('toastMessage').textContent = message;
    toast.show();
  };

  // Quick links open the request form and preselect the relevant category.
  document.querySelectorAll('[data-support]').forEach(button => {
    button.addEventListener('click', () => {
      const type = button.getAttribute('data-support');
      const radio = document.querySelector(`input[name="supportType"][value="${CSS.escape(type)}"]`);
      if (radio) radio.checked = true;
      document.getElementById('supportSuccess').classList.add('d-none');
      bootstrap.Modal.getOrCreateInstance(document.getElementById('supportModal')).show();
    });
  });

  // Demo-only request flow. The code is generated locally and is not saved to a server.
  document.getElementById('supportForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const selected = document.querySelector('input[name="supportType"]:checked');
    if (!selected) return;
    const code = 'GS-2026-' + String(Math.floor(10000 + Math.random() * 89999));
    const success = document.getElementById('supportSuccess');
    success.className = 'tracking-result';
    success.innerHTML = `<strong><i class="bi bi-check-circle-fill text-success me-2"></i>Demo müraciət kodun hazırdır</strong><span>Kateqoriya: ${escapeHtml(selected.value)} · Kod: <b>${code}</b></span><p class="mb-2 mt-2">Bu kodu saxla. Prototipdə məlumat serverə göndərilmir və səhifə yenilənəndə qorunmaya bilər.</p><button type="button" class="btn btn-sm btn-outline-primary" id="copyCode"><i class="bi bi-copy me-1"></i>Kodu kopyala</button>`;
    success.classList.remove('d-none');
    document.getElementById('copyCode').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(code); showToast('Müraciət kodu kopyalandı.'); }
      catch { showToast('Kodun: ' + code); }
    });
    success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // The example tracking code shows a sample workflow; other codes are not found.
  document.getElementById('trackForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const code = document.getElementById('trackingCode').value.trim().toUpperCase();
    const result = document.getElementById('trackingResult');
    result.classList.remove('d-none');
    if (code === 'GS-2026-48271') {
      result.innerHTML = '<strong><i class="bi bi-check-circle-fill text-success me-2"></i>Nümunə müraciət tapıldı</strong><span>Status: Mütəxəssisə yönləndirildi. Aşağıdakı mərhələlər yalnız nümayiş üçündür.</span>';
      document.getElementById('defaultTimeline').classList.remove('d-none');
    } else {
      result.innerHTML = '<strong><i class="bi bi-info-circle text-primary me-2"></i>Bu demo kod üzrə məlumat tapılmadı</strong><span>Yoxlama üçün GS-2026-48271 nümunə kodundan istifadə et. Real platformada kod serverdə yoxlanmalıdır.</span>';
    }
  });

  // Region and interest filters for sample opportunity cards.
  document.getElementById('filterOpportunities').addEventListener('click', () => {
    const region = document.getElementById('regionFilter').value;
    const interest = document.getElementById('interestFilter').value;
    let visible = 0;
    document.querySelectorAll('.opportunity-card').forEach(card => {
      const regionMatch = region === 'all' || card.dataset.region === 'all' || card.dataset.region === region;
      const interestMatch = interest === 'all' || card.dataset.interest === interest;
      card.classList.toggle('d-none', !(regionMatch && interestMatch));
      if (regionMatch && interestMatch) visible++;
    });
    document.getElementById('filterMessage').textContent = visible
      ? `${visible} uyğun nümunə imkan göstərilir. Real elanlar platforma idarəçiləri tərəfindən yenilənməlidir.`
      : 'Bu seçimə uyğun nümunə imkan tapılmadı. Başqa region və ya sahə seç.';
  });

  const regionDescriptions = {
    'İsmayıllı': 'İsmayıllı üzrə mövcud imkanlar, Gənc Səs xidmətləri və tərəfdaş qurumlarla tanış ol.',
    'Şəki': 'Şəki üzrə təhsil, könüllülük, karyera və gənclər üçün yerli təşəbbüsləri araşdır.',
    'Qəbələ': 'Qəbələ üzrə gənclərin inkişafı, kurslar və tərəfdaş xidmətləri haqqında məlumat əldə et.',
    'Gəncə': 'Gəncə üzrə karyera, təcrübə, təhsil və gənclər proqramları ilə tanış ol.',
    'Lənkəran': 'Lənkəran üzrə yerli xidmətlər, təhsil imkanları və gənclər təşəbbüslərini araşdır.',
    'Quba': 'Quba üzrə gənclər üçün dəstək xidmətlərini, kursları və yerli imkanları kəşf et.',
    'Bakı': 'Bakı üzrə təhsil, karyera, mentorluq və sosial dəstək imkanlarını araşdır.'
  };
  document.querySelectorAll('[data-region-select]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-region-select]').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      const region = button.dataset.regionSelect;
      document.getElementById('selectedRegionName').textContent = region;
      document.getElementById('selectedRegionText').textContent = regionDescriptions[region] || 'Bu region üzrə imkanları araşdır.';
    });
  });
  document.getElementById('regionExplore').addEventListener('click', () => {
    document.getElementById('regionFilter').value = document.getElementById('selectedRegionName').textContent;
    document.getElementById('interestFilter').value = 'all';
    document.getElementById('filterOpportunities').click();
    document.getElementById('opportunities').scrollIntoView({ behavior: 'smooth' });
  });

  // Prototype form feedback. No data is sent or stored.
  document.getElementById('institutionForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('instName').value.trim();
    const region = document.getElementById('instRegion').value;
    const message = document.getElementById('institutionMessage');
    message.textContent = `Təşəkkür edirik${name ? ', ' + name : ''}! ${region} üzrə əməkdaşlıq sorğunuz demo rejimində yoxlanıldı. Məlumat serverə göndərilməyib.`;
    message.classList.remove('d-none');
    showToast('Forma demo rejimində tamamlandı.');
    message.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  }
});