import React from 'react';

function About() {
  return (
    <div className="mx-auto p-6 max-w-4xl">
      <h1 className="mb-6 font-bold text-3xl">Biz haqimizda</h1>

      {/* Kompaniya haqida ma'lumot */}
      <section className="mb-8">
        <h2 className="mb-4 font-semibold text-2xl">Kompaniya haqida</h2>
        <p className="text-gray-700 leading-relaxed">
          Bizning kompaniya 2010-yildan beri mijozlarimizga yuqori sifatli mahsulotlar va xizmatlarni taqdim etib kelmoqda. Bizning maqsadimiz - har bir mijozimizning ehtiyojlarini qondirish va ularga eng yaxshi tajribani taqdim etish.
        </p>
      </section>

      {/* Jamoamiz haqida ma'lumot */}
      <section className="mb-8">
        <h2 className="mb-4 font-semibold text-2xl">Jamoamiz</h2>
        <p className="text-gray-700 leading-relaxed">
          Bizning jamoamiz tajribali va ijodiy mutaxassislardan iborat. Har bir jamoa a'zosi o'z sohasining yetakchisi bo'lib, mijozlarimizga eng yaxshi yechimlarni taklif qilish uchun doim yangi g'oyalar bilan shug'ullanadi.
        </p>
      </section>

      {/* Kontakt ma'lumotlari */}
      <section>
        <h2 className="mb-4 font-semibold text-2xl">Biz bilan bog'laning</h2>
        <ul className="text-gray-700 leading-relaxed">
          <li className="mb-2">
            <strong>Manzil:</strong> Toshkent shahri, Yunusobod tumani, 12-uy
          </li>
          <li className="mb-2">
            <strong>Telefon:</strong> +998 71 123 45 67
          </li>
          <li className="mb-2">
            <strong>Email:</strong> info@muallimah.uz
          </li>
          <li className="mb-2">
            <strong>Ish vaqti:</strong> Dushanba - Juma, 9:00 - 18:00
          </li>
        </ul>
      </section>
    </div>
  );
}

export default About;