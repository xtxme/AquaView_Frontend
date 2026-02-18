import styled from "styled-components";

const WhiteBox = styled.div`
  width: 90%;
  max-width: 1100px;
  margin: 24px auto 0;
  background: var(--color-surface-soft);
  border-radius: 16px;
  padding: 24px 32px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  box-shadow: var(--shadow-soft);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    width: calc(100% - 20px);
    padding: 20px;
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: transparent;
  border-radius: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  box-shadow: none;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: none;
  }
`;

const FeatureImage = styled.img`
  width: 100%;
  max-width: 200px;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
`;

const FeatureTitle = styled.h3`
  margin: 4px 0 0;
  color: var(--color-primary);
  font-size: 20px;
  font-weight: 600;
  font-family: "Kanit", sans-serif;
`;

const FeatureDescription = styled.p`
  margin: 0;
  color: var(--color-text-muted);
  font-size: 15px;
  line-height: 1.45;
  font-family: "Kanit", sans-serif;
`;

export default function WhiteBoxPage() {
  const features = [
    {
      image: "/features-1.png",
      title: "ติดตามระดับน้ำเรียลไทม์",
      description: "ดูค่าน้ำล่าสุดของสถานีแบบต่อเนื่องและตรวจแนวโน้มทันทีบนแผนที่รวม",
      alt: "แสดงหน้าจอติดตามระดับน้ำแบบเรียลไทม์",
    },
    {
      image: "/features-2.png",
      title: "แจ้งเตือนก่อนถึงจุดวิกฤต",
      description: "ระบบประเมินความเสี่ยงจากระดับตลิ่งและช่วยแจ้งเตือนเพื่อวางแผนรับมือได้เร็วขึ้น",
      alt: "หน้าจอแจ้งเตือนสถานการณ์ระดับน้ำใกล้จุดวิกฤต",
    },
    {
      image: "/features-3.png",
      title: "รายงานย้อนหลังและส่งออกข้อมูล",
      description: "เรียกดูข้อมูลย้อนหลังเป็นตารางและกราฟ พร้อมส่งออกเพื่อใช้งานต่อในหน่วยงาน",
      alt: "หน้าจอรายงานย้อนหลังพร้อมตัวเลือกส่งออกข้อมูล",
    },
  ];

  return (
    <WhiteBox>
      {features.map((feature) => (
        <FeatureCard key={feature.title}>
          <FeatureImage src={feature.image} alt={feature.alt} />
          <FeatureTitle>{feature.title}</FeatureTitle>
          <FeatureDescription>{feature.description}</FeatureDescription>
        </FeatureCard>
      ))}
    </WhiteBox>
  );
}
