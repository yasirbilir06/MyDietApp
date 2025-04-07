import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';

export default function AboutScreen() {
  const indent = '\u00A0\u00A0\u00A0\u00A0';
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.paragraph}>
       {indent} Merhaba, Ankara Üniversitesi Beslenme ve Diyetetik mezunu olarak, mesleğimi dijital dünyaya taşımak için bilgisayar mühendisi erkek arkadaşım ile birlikte bir mobil uygulama geliştirdik. Bu uygulama, diyet yazarken ihtiyaç duyulan tüm hesaplamaları kapsamakla birlikte, diyetisyenler için özel olarak tasarlanmış bir profesyonel mod da içermektedir.
      </Text>
      <Text style={styles.paragraph}>
      {indent} Diyetisyen modu sayesinde meslektaşlarımız, danışanlarını kolayca takip edebilir, güncel bilgilerine ulaşabilir ve işlemlerini pratik bir şekilde gerçekleştirebilir. Danışanlar ise diyetisyen profillerini görüntüleyebilir, istedikleri zaman danışmanlık alabilir ve kişisel sağlık süreçlerini daha bilinçli bir şekilde yönetebilirler.
      </Text>
      <Text style={styles.paragraph}>
      {indent}  Ayrıca, uygulamamızda sıkça sorulan sorular ve pratik bilgilerle günlük hayata katkı sağlayacak içerikler sunuyoruz. Günlük meşguliyetler arasında sağlıklı alışkanlıkları sürdürmek adına su içme ve hareket etme gibi hatırlatıcı bildirimler de ekledik.
      </Text>
      <Text style={styles.paragraph}>
      {indent}  Herhangi bir sorunuz veya geri bildiriminiz olursa, bizimle iletişime geçmekten çekinmeyin.
      </Text>
      <Text style={styles.contactTitle}>📩 İletişim:</Text>
      <Text style={styles.contact}>ebrargnz@gmail.com</Text>
      <Text style={styles.contact}>yasiryenihasan@gmail.com</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'rgb(194,185,125)',
  },
  paragraph: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 5,
    lineHeight: 24,
    paddingLeft: 20,
    fontStyle:'italic',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 20,
    marginBottom: 8,
    fontStyle:'italic',
    
  },
  contact: {
    fontSize: 16,
    color: '#FFF',
  },
});
