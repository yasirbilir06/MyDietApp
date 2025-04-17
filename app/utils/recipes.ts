// data/recipes.ts
export const recipes = [
    {
      id: 'smoothie-bowl',
      title: 'Smoothie Bowl Tarifi',
      image: require('../../assets/images/smoothie1.jpg'),
      tags: ['Vegan', '10 dk', 'Kolay'],
      ingredients: [
        '2 yemek kaşığı yoğurt',
        '5 adet çilek (Donmuş)',
        'Yarım muz (Donmuş)',
        '2 yemek kaşığı granola',
        '1 tatlı kaşığı fıstık ezmesi',
        '2 adet çilek',
        '1 dilim ananas',
        'Yarım adet muz',
        '1 adet nar',
      ],
      steps: [
        'Yoğurt ve donmuş meyveleri bir kaseye al.',
        'Blender ile pürüzsüz kıvam alana kadar karıştır.',
        'Karışımı kaseye al, üstüne granola, fıstık ezmesi ve meyveleri ekle.',
      ]
    },
    {
        id: 'kirmizi-pancarli-nohut',
        title: 'Kırmızı Pancar ve Nohutlu Yoğurt',
        image: require('../../assets/images/nohut.jpeg'), // ← kendi resmini buraya koy
        tags: ['Probiyotik', 'Sağlıklı', 'Renkli'],
        ingredients: [
          '1 orta boy kırmızı pancar (1 tatlı kaşığı zeytinyağı)',
          '4 yemek kaşığı yoğurt',
          '1 diş sarımsak',
          'Dereotu',
          'Nohut',
          'Baharatlar',
        ],
        steps: [
          'Pancarı haşlayıp küçük küçük doğrayın, zeytinyağıyla karıştırın.',
          'Yoğurdu, ezilmiş sarımsakla birlikte bir kasede karıştırın.',
          'Haşlanmış nohutu ve pancarı yoğurda ekleyin.',
          'Üzerine dereotu ve dilediğiniz baharatları ekleyin.',
          'Soğuk servis edin. Afiyet olsun! 😊'
        ]
      },
      {
        id: 'mozafit-pasta',
        title: 'Mozafit Pasta',
        image: require('../../assets/images/mozafit.jpeg'), // ← burayı kendi görselinle güncelle
        tags: ['Şekersiz', 'Tatlı', 'Fit'],
        ingredients: [
          '6 tane hurma (150 g)',
          '2 yemek kaşığı şekersiz fıstık ezmesi',
          '1 yemek kaşığı kakao',
          '1 su bardağı yulaf',
          '1 fincan ceviz',
          '1 çay kaşığı tarçın',
        ],
        steps: [
          'Hurmaları sıcak suda yumuşatıp çekirdeklerini çıkarın.',
          'Tüm malzemeleri bir kaba alıp blenderdan geçirin.',
          '6 eşit parçaya ayırıp şekil verin.',
          'Buzlukta 3–4 saat beklettikten sonra servis edin.',
          'Afiyet olsun! 😋'
        ]
      }
      
      
  ];
  