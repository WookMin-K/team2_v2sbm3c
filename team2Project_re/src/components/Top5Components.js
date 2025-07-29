import React from 'react';

// 🔹 Top5 장소 목록 컴포넌트
export function Top5List({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <p>AI 기반 상세 분석은 여행지 페이지에서 확인하실 수 있어요! 😊</p>;
  }

  return (
    <div className="top5-list">
      {data.map((item, idx) => (
        <div className="top5-item" key={idx}>
          <div className="top5-rank">{idx + 1}위</div>
          <div className="top5-name">{item.name}</div>
          <div className="top5-count">{item.count.toLocaleString()}회</div>
        </div>
      ))}
      <p style={{ textAlign: 'right', marginRight: 20, fontSize: 10, color: '#666' }}>출처: 카카오맵(2024)</p>
    </div>
  );
}


// 🔹 LLM 분석 결과 박스 컴포넌트
export function InsightBox({ content }) {
  if (!content) return <p>AI 기반 상세 분석은 여행지 페이지에서 확인하실 수 있어요! 😊</p>;

  return (
    <div className="ai-analysis-container">
      <div className="ai-header">
        <span className="ai-icon"></span>
        <span className="ai-title">AI 분석 결과</span>
      </div>
      <div className="ai-content">
        <p style={{ margin: 0 }}>
          {content.split(/(?<=[.!?])\s+/).map((s, i) => (
            <span key={i}>{s}<br/></span>
          ))}
        </p>
      </div>
    </div>
  );
}

