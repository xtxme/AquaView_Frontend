import styled from "styled-components";

const WhiteBox = styled.div`
    width: 90%;
    max-width: 1100px;
    margin: 24px auto 0;
    background: #FFFCF7;
    border-radius: 16px;
    padding: 24px 32px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    box-shadow: 0 4px 12px rgba(1, 32, 95, 0.08);
`;

const FeatureCard = styled.div`
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
    box-shadow: 0 2px 8px rgba(1, 32, 95, 0.06);
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 16px rgba(1, 32, 95, 0.12);
    }
`;

const FeatureImage = styled.img`
    width: 100%;
    max-width: 200px;
    height: auto;
    object-fit: contain;
    border-radius: 8px;
`;

export default function WhiteBoxPage() {
  const features = [
    "/features-1.png",
    "/features-2.png",
    "/features-3.png"
  ];

  return (
    <WhiteBox>
      {features.map((image, index) => (
        <FeatureCard key={index}>
          <FeatureImage src={image} alt={`Feature ${index + 1}`} />
        </FeatureCard>
      ))}
    </WhiteBox>
  );
}
