import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Button, Space, Spin } from 'antd';
import { 
  ArrowRightOutlined, 
  TrophyOutlined, 
  SafetyCertificateOutlined 
} from '@ant-design/icons';
import Config from "../../util/Config";

const { Title, Text, Paragraph } = Typography;

const Founder = () => {
  const [loading, setLoading] = useState(true);

  // Clear Full Page Refresh Spinner after 1 second
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  /** * IMPORTANT: You must copy the exact filenames from your 
   * 'public/storage/founderimages' folder here.
   */
  const founderImages = [
    "0oVX6GFCYWOJQU5fN...", // Replace with your actual full filename
    "6rphxuttr2CGgyCjv...", 
    "F17Kvg90r5xgguPYW..."
  ];

  const animationStyle = `
    @keyframes scrollLeft {
      0% { transform: translateX(0); }
      100% { transform: translateX(-33.33%); }
    }
    .marquee-content:hover { animation-play-state: paused !important; }
  `;

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {/* Fix: Wrapped Spin in a container to avoid 'tip' warning */}
        <Space direction="vertical" align="center">
          <Spin size="large" />
          <Text strong style={{ marginTop: 16 }}>Loading Founder Details...</Text>
        </Space>
      </div>
    );
  }

  return (
    <div style={{ padding: '80px 0', backgroundColor: '#fff', overflow: 'hidden' }}>
      <style>{animationStyle}</style>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
        <Row gutter={[40, 40]} align="middle">
          
          <Col xs={24} lg={10}>
            <Space direction="vertical" size="large">
              <div>
                <Text strong style={{ color: '#1890ff', textTransform: 'uppercase', letterSpacing: '2px' }}>
                  Establishment & Vision
                </Text>
                <Title level={1} style={{ fontSize: '48px', margin: '8px 0 24px 0', fontWeight: 800 }}>
                  SHEERLONG SHOP <br /> 
                  <span style={{ color: '#555' }}>Founder Detail</span>
                </Title>
                <Paragraph style={{ fontSize: '18px', lineHeight: '1.8', color: '#666' }}>
                  Founded with a passion for excellence, Pich Pisey Shop bridges the gap 
                  between high-end technology and everyday lifestyle.
                </Paragraph>
              </div>

              <div style={{ display: 'flex', gap: '40px' }}>
                <div style={{ textAlign: 'center' }}>
                  <TrophyOutlined style={{ fontSize: '32px' }} />
                  <div style={{ fontWeight: 'bold', marginTop: '8px' }}>Certified</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <SafetyCertificateOutlined style={{ fontSize: '32px' }} />
                  <div style={{ fontWeight: 'bold', marginTop: '8px' }}>Trusted</div>
                </div>
              </div>

              <Button 
                type="primary" size="large" icon={<ArrowRightOutlined />} 
                style={{ background: '#000', borderRadius: '4px', height: '50px', padding: '0 30px', border: 'none' }}
              >
                Contact Founder
              </Button>
            </Space>
          </Col>

          <Col xs={24} lg={14}>
            <div style={{ 
              width: '100%', overflow: 'hidden', position: 'relative',
              maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
            }}>
              <div className="marquee-content" style={{ display: 'flex', width: 'fit-content', animation: 'scrollLeft 25s linear infinite' }}>
                {[...founderImages, ...founderImages, ...founderImages].map((imgName, index) => (
                  <div key={index} style={{ width: '450px', flexShrink: 0, padding: '0 15px' }}>
                    <img 
                      /* Correct Path: storage + folder + exact hashed filename */
                      src={`${Config.imgPath}founderimages/${imgName}`} 
                      alt="Founder Milestone" 
                      style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} 
                      onError={(e) => { e.target.src = "https://via.placeholder.com/450x350?text=Image+Not+Found"; }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Founder;