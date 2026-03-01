import React from 'react';
import { Button, Carousel, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import cover from '../../assets/cover.jpg';
import banner from '../../assets/banner1.jpg';
import banner2 from '../../assets/banner2.jpg';

const { Title, Text } = Typography;

const Banner = () => {
  const bannerItems = [
    {
      id: 1,
      title: "SHEERLONG ELETRONICS",
      subtitle: "Best Quality Products",
      desc: "Luxury Computer best quality Macbook TuF Gaming Lenovo Dell.",
    //   image: cover,
        image: banner,
      dark: true
    },
    {
      id: 2,
      title: "MODERN SMARTPHONES",
      subtitle: "New Collection",
      desc: "Experience the future with our latest range of smartphones.",
      image: banner2, 
      dark: false
    }
  ];

  return (
    <div style={{ width: '100%',}}>
      <Carousel autoplay effect="fade" speed={1000}>
        {bannerItems.map((item) => (
          <div key={item.id}>
            <div style={{
              height: '500px', // Balanced height to match big product cards
              width: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: `url(${item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            //   borderRadius: '24px', // Matches your modern card radius
              overflow: 'hidden'
            }}>
              {/* Overlay for text readability */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 60%)',
                zIndex: 1
              }} />

              {/* Content */}
              <div style={{
                position: 'relative',
                zIndex: 2,
                maxWidth: '1400px',
                width: '100%',
                padding: '0 60px',
                color: '#fff'
              }}>
                <div style={{ maxWidth: '600px' }}>
                  <Text style={{ 
                    color: 'rgba(255,255,255,0.8)', 
                    letterSpacing: '4px', 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    display: 'block',
                    marginBottom: '10px'
                  }}>
                    {item.subtitle}
                  </Text>
                  <Title style={{ 
                    color: '#fff', 
                    fontSize: '56px', 
                    margin: '0 0 20px', 
                    fontWeight: '900',
                    lineHeight: '1.1',
                    letterSpacing: '-2px'
                  }}>
                    {item.title}
                  </Title>
                  <Text style={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    fontSize: '18px', 
                    display: 'block', 
                    marginBottom: '30px',
                    fontWeight: '300'
                  }}>
                    {item.desc}
                  </Text>
                  
                  <Button 
                    size="large" 
                    style={{ 
                      background: '#fff', 
                      color: '#000', 
                      border: 'none', 
                      height: '54px', 
                      padding: '0 40px',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    Shop Now <ArrowRightOutlined />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;