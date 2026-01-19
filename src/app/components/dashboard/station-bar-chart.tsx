'use client';

import React, { useRef } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Cell } from 'recharts';

// 1. Declare a variable for card configuration
const CARD_WIDTH = 250;

// 2. Styled Components
const StyledCarouselSection = styled.div`
  width: 100%;
  position: relative;
  
  & .section-header {
    margin-bottom: 20px;
  }

  & .header-badge {
    display: inline-flex;
    align-items: center;
    background: #3B82F6;
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.5);
  }

  & .carousel-container {
    display: flex;
    align-items: center;
    gap: 16px;
    position: relative;
  }

  & .scroller {
    display: flex;
    overflow-x: auto;
    gap: 20px;
    padding-bottom: 20px; /* Space for scrollbar or shadow */
    scroll-behavior: smooth;
    scrollbar-width: none; /* Firefox */
    
    &::-webkit-scrollbar {
      display: none; /* Chrome/Safari */
    }
  }

  & .nav-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #3B82F6;
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.5);
    transition: transform 0.2s;
    flex-shrink: 0;
    z-index: 10;

    &:hover {
      transform: scale(1.1);
      background: #2563EB;
    }
    
    &:disabled {
      background: #CBD5E1;
      cursor: not-allowed;
      transform: none;
    }
  }
`;

const StyledStationCard = styled.div`
  min-width: ${CARD_WIDTH}px;
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  
  & .card-title {
    font-size: 16px;
    font-weight: 600;
    color: #1E293B;
    margin-bottom: 5px;
  }

  & .card-subtitle {
     font-size: 14px;
     color: #64748B;
     margin-bottom: 20px;
  }

  & .chart-wrapper {
    width: 100%;
    height: 180px;
    position: relative;
  }

  & .level-label {
    position: absolute;
    bottom: 10px;
    width: 100%;
    text-align: center;
    font-weight: bold;
    color: white;
    font-size: 12px;
    z-index: 10;
    pointer-events: none;
  }
`;

const mockDistricts = [
  { id: 1, name: 'สถานีดับเพลิง - P1', level: 3.5, max: 8 },
  { id: 2, name: 'สถานีดับเพลิง - P1', level: 3.8, max: 8 },
  { id: 3, name: 'สถานีดับเพลิง - P1', level: 4.2, max: 8 },
  { id: 4, name: 'สถานีบางซื่อ', level: 2.1, max: 8 },
  { id: 5, name: 'สถานีจตุจักร', level: 5.5, max: 8 },
  { id: 6, name: 'สถานีพญาไท', level: 4.0, max: 8 },
];

export function StationBarChart() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollerRef.current) {
      const scrollAmount = 300;
      scrollerRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <StyledCarouselSection>
      <div className="section-header">
        <div className="header-badge">
          รายงานระดับน้ำของสถานีระบายน้ำ 📊
        </div>
      </div>

      <div className="carousel-container">
        <button className="nav-btn prev" onClick={() => scroll('left')}>
          {/* Simple Left Arrow SVG */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>

        <div className="scroller" ref={scrollerRef}>
          {mockDistricts.map((station, index) => (
            <StyledStationCard key={index}>
              <div className="card-title">{station.name}</div>

              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[station]}>
                    {/* Background Bar (Total Capacity) */}
                    <Bar dataKey="max" fill="#BFDBFE" radius={[4, 4, 0, 0]} isAnimationActive={false} barSize={60} stackId="a" />
                    {/* Actual Level Bar - Overlaid logic handled by transforming data or custom shape, 
                         but for simple separate bars logic: */}
                  </BarChart>
                </ResponsiveContainer>

                {/* 
                   Recharts doesn't support "background bar" well without custom shapes or stacked hacks.
                   Let's use a simpler visual for the bar: Just ONE bar representing the level, colored blue.
                */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[station]} margin={{ top: 20, bottom: 0 }}>
                      <Bar
                        dataKey="max"
                        fill="#DBEAFE" /* Light Blue background bar */
                        radius={[8, 8, 8, 8]}
                        barSize={50}
                        xAxisId={0}
                      />
                      <Bar
                        dataKey="level"
                        fill="#2563EB" /* Dark Blue foreground bar */
                        radius={[0, 0, 8, 8]}
                        barSize={50}
                        xAxisId={0}
                        label={{ position: 'bottom', fill: 'white', fontSize: 12, formatter: (val: any) => `${val} ม.` }}
                      />
                      <XAxis hide xAxisId={0} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </StyledStationCard>
          ))}
        </div>

        <button className="nav-btn next" onClick={() => scroll('right')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </StyledCarouselSection>
  );
}
