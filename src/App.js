import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import './App.css';

// 앱 상태 관리를 위한 상수
const APP_STATES = {
  HOME: 'HOME',
  START: 'START',
  SURVEY: 'SURVEY',
  RESULTS: 'RESULTS',
  PROCESSING: 'PROCESSING'
};

// 설문 카테고리 정의
const CATEGORIES = [
  { id: 'work_style', name: '작업 스타일', icon: '💼' },
  { id: 'communication', name: '커뮤니케이션 방식', icon: '💬' },
  { id: 'problem_solving', name: '문제 해결 접근법', icon: '🧩' },
  { id: 'environment', name: '환경 선호도', icon: '🏢' },
  { id: 'values', name: '가치 및 동기', icon: '✨' }
];

// 테스트 카드 데이터
const TEST_CARDS = [
  {
    id: 'job_test',
    title: '일본취업 업종 적합도 검사',
    description: '당신의 성향과 맞는 업계를 찾아보세요',
    image: '/images/01.png'
  },
  {
    id: 'mbti_test',
    title: '일본 비즈니스 적응력 검사',
    description: '일본 비즈니스 문화에 잘 맞는지 알아보세요',
    image: '/images/02.png'
  },
  {
    id: 'japan_life_test',
    title: '일본어 능력 검사',
    description: '당신의 일본어 구사 수준을 확인해보세요',
    image: '/images/03.png'
  }
];

// 12개 직종별 핵심 특성 (1-5순위)
const INDUSTRY_TRAITS = {
  '금융': {
    traits: [
      { name: '분석적이고 정확한', weight: 5 },
      { name: '대인관계가 원활하고 신뢰감 있는', weight: 4 },
      { name: '꼼꼼하고 규정을 준수하는', weight: 3 },
      { name: '신중하고 리스크에 민감한', weight: 2 },
      { name: '기술에 능통하고 혁신적', weight: 1 }
    ],
    description: '귀하의 분석적 성향과 원활한 대인관계와 신뢰감을 중시하는 점이 금융 분야와 높은 적합성을 보입니다.',
    overview: '일본의 금융 섹터는 은행, 증권, 보험, 자산 관리, 핀테크 등 다양한 분야를 포함하며, 세계적으로 중요한 금융 허브 중 하나입니다. 외국인 금융 전문가에 대한 수요가 증가하고 있으며, 특히 글로벌 시장에 대한 통찰력을 가진 인재를 찾고 있습니다.'
  },
  'IT': {
    traits: [
      { name: '기술적으로 유능하고 문제 해결에 능한', weight: 5 },
      { name: '체계적이고 구조적 사고가 가능한', weight: 4 },
      { name: '효율적이고 조직력 있는', weight: 3 },
      { name: '혁신적이고 창의적인', weight: 2 },
      { name: '세심하고 정확한', weight: 1 }
    ],
    description: '문제 해결 접근법과 논리적 사고방식이 IT 분야에 매우 적합합니다.',
    overview: '일본의 IT 산업은 소프트웨어 개발, 시스템 통합, AI, 로봇공학 등 다양한 분야에서 성장하고 있습니다. 디지털 트랜스포메이션 추진으로 인해 기술 전문가 수요가 높으며, 외국인 IT 인재를 적극적으로 채용하고 있습니다.'
  },
  '컨설팅': {
    traits: [
      { name: '논리적이고 분석적인', weight: 5 },
      { name: '명료하고 설득력 있는', weight: 4 },
      { name: '조직적이고 책임감 있는', weight: 3 },
      { name: '데이터 중심적이고 객관적인', weight: 2 },
      { name: '전문적이고 박식한', weight: 1 }
    ],
    description: '논리적이고 분석적이며 설득력을 갖춘 당신은 컨설팅 업무와 일치합니다.',
    overview: '일본의 컨설팅 업계는 글로벌 컨설팅 기업과 일본 현지 기업이 공존하며, 디지털 전환, 글로벌 확장, 경영 효율화 등의 분야에서 자문 서비스를 제공합니다. 외국인 컨설턴트는 국제적 시각과 산업 전문성을 바탕으로 가치를 창출할 수 있습니다.'
  },
  '정보통신': {
    traits: [
      { name: '기술적으로 전문적이고 최신 트렌드에 민감한', weight: 5 },
      { name: '실용적이고 솔루션 지향적인', weight: 4 },
      { name: '안정적이고 신뢰할 수 있는', weight: 3 },
      { name: '고객 중심적이고 서비스 지향적인', weight: 2 },
      { name: '경계심이 강하고 보안 의식이 높은', weight: 1 }
    ],
    description: '기술적 문제 해결 능력과 실용성에 대한 추구가 정보통신 분야와 적합합니다.',
    overview: '일본의 정보통신 산업은 첨단 통신 인프라, 네트워크 서비스, 데이터 센터 운영 등을 포함하며 지속적으로 발전하고 있습니다. 디지털 전환의 가속화로 특히 5G, 클라우드, IoT 분야에서 전문가에 대한 수요가 높습니다.'
  },
  '종합상사': {
    traits: [
      { name: '글로벌 시장에 민감하고 통찰력 있는', weight: 5 },
      { name: '체계적이고 전략적인', weight: 4 },
      { name: '다국어에 능통하고 국제적인', weight: 3 },
      { name: '창의적이고 추진력 있는', weight: 2 },
      { name: '예리하고 판단력이 뛰어난', weight: 1 }
    ],
    description: '글로벌 시장에 대한 인사이트, 체계성과 전략성과 다양한 환경 적응력이 종합상사 업무와 잘 어울립니다.',
    overview: '일본 종합상사는 무역, 투자, 프로젝트 개발 등 다양한 비즈니스를 글로벌 규모로 운영하는 대기업입니다. 다양한 산업 분야와 지역에 걸친 네트워크를 통해 글로벌 비즈니스를 조정하며, 국제적 감각을 가진 인재를 중요시합니다.'
  },
  '제조업・에너지': {
    traits: [
      { name: '실용적이고 기술적으로 정확한', weight: 5 },
      { name: '세심하고 품질 지향적인', weight: 4 },
      { name: '효율적이고 계획적인', weight: 3 },
      { name: '개선 지향적이고 끊임없이 발전하는', weight: 2 },
      { name: '창의적이고 혁신을 추구하는', weight: 1 }
    ],
    description: '세부사항에 대한 주의력과 품질 지향적 접근법이 제조업과 일치합니다.',
    overview: '일본의 제조업은 자동차, 전자제품, 정밀기계 등 다양한 분야에서 세계적인 경쟁력을 갖추고 있습니다. 품질, 혁신, 효율성을 중시하며 특히 품질 관리 및 지속적 개선 분야에서 외국인 전문가를 찾고 있습니다.'
  },
  '식품': {
    traits: [
      { name: '고객 중심적이고 서비스 지향적인', weight: 5 },
      { name: '안정적이고 신뢰할 수 있는', weight: 4 },
      { name: '트렌드에 민감하고 창의적인', weight: 3 },
      { name: '적응력 있는', weight: 2 },
      { name: '체계적이고 효율적인', weight: 1 }
    ],
    description: '체계적인 작업 접근법이 식품 산업의 품질 관리와 관련이 있습니다.',
    overview: '일본의 식품 산업은 전통 식품부터 혁신적인 신제품까지 다양한 분야를 아우르며, 품질과 안전성에 대한 높은 기준을 가지고 있습니다. 국제적 시장 확장과 새로운 제품 개발을 위해 글로벌 시각을 가진 전문가를 필요로 합니다.'
  },
  '유통・소매': {
    traits: [
      { name: '고객 지향적이고 공감 능력이 높은', weight: 5 },
      { name: '시장 감각이 뛰어나고 창의적인', weight: 4 },
      { name: '효율적이고 물류에 정통한', weight: 3 },
      { name: '운영에 능숙하고 실용적인', weight: 2 },
      { name: '디지털에 능통하고 혁신적인', weight: 1 }
    ],
    description: '고객 지향적이며 시장 감각이 뛰어나며 효율적인 작업 방식이 유통 및 소매 분야와 높은 연관성이 있습니다.',
    overview: '일본의 유통 및 소매 산업은 편의점, 백화점부터 이커머스 플랫폼까지 다양한 채널을 포함합니다. 고객 서비스 품질에 대한 높은 기준과 함께 디지털 혁신을 추구하며, 특히 옴니채널 전략과 고객 경험 향상에 중점을 두고 있습니다.'
  },
  '관광・인재서비스': {
    traits: [
      { name: '대인관계가 원활하고 사람을 잘 이해하는', weight: 5 },
      { name: '서비스 정신이 투철하고 세심한', weight: 4 },
      { name: '교육적이고 인내심 있는', weight: 3 },
      { name: '마케팅에 능숙하고 창의적인', weight: 2 },
      { name: '다국어에 유창하고 친절한', weight: 1 }
    ],
    description: '사람을 잘 이해하며 서비스 정신이 투철하고 세심한 당신은 관광/인재서비스 분야에 적합성을 보입니다.',
    overview: '일본의 관광 및 인재 서비스 산업은 코로나19 이후 회복 중이며, 외국인 관광객 유치와 글로벌 인재 채용에 중점을 두고 있습니다. 언어 능력과 문화적 이해를 겸비한 전문가가 필요하며, 특히 인바운드 관광과 해외 인재 채용 분야에서 기회가 증가하고 있습니다.'
  },
  '광고・미디어・엔터': {
    traits: [
      { name: '디지털에 정통하고 트렌드를 선도하는', weight: 5 },
      { name: '사교적이고 관계 구축에 능한', weight: 4 },
      { name: '데이터에 민감하고 통찰력 있는', weight: 3 },
      { name: '전략적이고 분석적인', weight: 2 },
      { name: '창의적이고 예술적인', weight: 1 }
    ],
    description: '트렌디함과 사교성, 데이터 기반 통찰력을 가진 당신은 광고 및 미디어 업계와 일치합니다.',
    overview: '일본의 광고 및 미디어 산업은 전통적인 매체와 디지털 플랫폼을 아우르며 빠르게 변화하고 있습니다. 디지털 마케팅, 콘텐츠 마케팅, 소셜 미디어 전략 분야에서 혁신을 추구하며, 국제적 관점과 창의적 접근법을 가진 인재를 필요로 합니다.'
  }
};

// 각 질문이 어떤 특성과 관련되는지 매핑
const QUESTION_TRAIT_MAPPING = {
  // 작업 스타일 관련 질문
  'ws1': ['고객 중심적이고 서비스 지향적인', '대인관계가 원활하고 사람을 잘 이해하는', '사교적이고 관계 구축에 능한'],  // 분석적 사고에서 고객 중심으로 변경
  'ws2': ['창의적이고 독창적인', '혁신적이고 창의적인', '창의적이고 예술적인'],         // 창의성
  'ws3': ['체계적이고 구조적 사고가 가능한', '실용적이고 기술적으로 정확한', '효율적이고 계획적인'], // 작업 방식
  'ws4': ['세심하고 정확한', '서비스 정신이 투철하고 세심한', '고객 지향적이고 공감 능력이 높은'], // 세부사항 주의력에서 서비스 정신으로 변경
  'ws5': ['고객 중심적이고 서비스 지향적인', '대인관계가 원활하고 신뢰감 있는', '고객 지향적이고 공감 능력이 높은'], // 전략적 사고에서 고객 중심으로 변경
  // 커뮤니케이션 방식 질문
  'cm1': ['다국어에 능통하고 국제적인', '다국어에 유창하고 친절한', '국제적 감각이 있고 협상에 능한_1'], // 언어 능력
  'cm2': ['대인관계가 원활하고 신뢰감 있는', '사교적이고 관계 구축에 능한', '고객 중심적이고 서비스 지향적인'], // 커뮤니케이션 스타일
  'cm3': ['서비스 정신이 투철하고 세심한', '고객 지향적이고 공감 능력이 높은', '대인관계가 원활하고 사람을 잘 이해하는'], // 설명 능력에서 서비스 정신으로 변경
  'cm4': ['대인관계가 원활하고 신뢰감 있는', '조직적이고 책임감 있는', '대인관계가 원활하고 사람을 잘 이해하는'], // 갈등 해결
  'cm5': ['다국어에 능통하고 국제적인', '국제적 감각이 있고 적응력 있는', '사교적이고 관계 구축에 능한'], // 다문화 소통
  // 문제 해결 접근법 질문
  'ps1': ['고객 중심적이고 서비스 지향적인', '서비스 정신이 투철하고 세심한', '대인관계가 원활하고 사람을 잘 이해하는'], // 분석적 사고에서 고객 중심으로 변경
  'ps2': ['고객 지향적이고 공감 능력이 높은', '대인관계가 원활하고 신뢰감 있는', '서비스 정신이 투철하고 세심한'], // 체계적 분석에서 고객 지향으로 변경
  'ps3': ['창의적이고 독창적인', '혁신적이고 창의적인', '실용적이고 솔루션 지향적인'], // 창의적 문제 해결
  'ps4': ['고객 중심적이고 서비스 지향적인', '서비스 정신이 투철하고 세심한', '대인관계가 원활하고 사람을 잘 이해하는'], // 분석적 사고에서 고객 중심으로 변경
  'ps5': ['고객 지향적이고 공감 능력이 높은', '시장 감각이 뛰어나고 창의적인', '사교적이고 관계 구축에 능한'], // 전략적 사고에서 고객 지향으로 변경
  // 환경 선호도 질문
  'en1': ['안정적이고 신뢰할 수 있는', '꼼꼼하고 규정을 준수하는', '효율적이고 조직력 있는'], // 업무 환경 선호
  'en2': ['체계적이고 구조적 사고가 가능한', '꼼꼼하고 규정을 준수하는', '세심하고 정확한'], // 규칙과 구조
  'en3': ['적응력 있는', '국제적 감각이 있고 적응력 있는', '트렌드에 민감하고 창의적인'], // 적응력
  'en4': ['고객 지향적이고 공감 능력이 높은', '서비스 정신이 투철하고 세심한', '대인관계가 원활하고 신뢰감 있는'], // 작업 방식에서 고객 지향으로 변경
  'en5': ['효율적이고 조직력 있는', '적응력 있는', '다재다능하고 유연한'], // 멀티태스킹
  // 가치 및 동기 질문
  'va1': ['고객 중심적이고 서비스 지향적인', '서비스 정신이 투철하고 세심한', '대인관계가 원활하고 사람을 잘 이해하는'], // 서비스 지향
  'va2': ['개선 지향적이고 끊임없이 발전하는', '전문적이고 박식한', '고객 지향적이고 공감 능력이 높은'], // 성장 지향에서 일부 고객 지향으로 변경
  'va3': ['안정적이고 신뢰할 수 있는', '도전적이고 성취 지향적인', '창의적이고 독창적인'], // 핵심 가치
  'va4': ['혁신적이고 창의적인', '창의적이고 독창적인', '창의적이고 추진력 있는'], // 혁신 주도
  'va5': ['고객 중심적이고 서비스 지향적인', '도전적이고 성취 지향적인', '고객 지향적이고 공감 능력이 높은'] // 직업 동기에서 일부 고객 지향으로 변경
};

// 설문 질문 데이터
const QUESTIONS = [
  // 작업 스타일 질문
  {
    id: 'ws1',
    category: 'work_style',
    text: "나는 분석적인 사고를 통해 복잡한 문제를 해결하는 것을 즐긴다.",
    type: 'likert'
  },
  {
    id: 'ws2',
    category: 'work_style',
    text: "나는 독창적이고 창의적인 아이디어를 개발하는 것을 선호한다.",
    type: 'likert'
  },
  {
    id: 'ws3',
    category: 'work_style',
    text: "다음 중 어떤 방식으로 일하는 것을 더 선호하나요?",
    type: 'choice',
    options: [
      { label: "체계적이고 계획된 방식", value: "systematic" },
      { label: "유연하고 즉흥적인 방식", value: "flexible" }
    ]
  },
  {
    id: 'ws4',
    category: 'work_style',
    text: "나는 세부사항에 주의를 기울이며 업무를 꼼꼼하게 처리하는 편이다.",
    type: 'likert'
  },
  {
    id: 'ws5',
    category: 'work_style',
    text: "프로젝트 수행 시 내가 더 선호하는 역할은?",
    type: 'choice',
    options: [
      { label: "계획 수립 및 전략 개발", value: "strategic" },
      { label: "실행 및 결과 도출", value: "execution" }
    ]
  },
  // 커뮤니케이션 방식 질문
  {
    id: 'cm1',
    category: 'communication',
    text: "나는 여러 언어로 의사소통하는 것에 자신이 있거나 배우는 것에 관심이 있다.",
    type: 'likert'
  },
  {
    id: 'cm2',
    category: 'communication',
    text: "다음 중 어떤 커뮤니케이션 상황에서 더 편안함을 느끼나요?",
    type: 'choice',
    options: [
      { label: "명확하고 직접적인 정보 전달", value: "direct" },
      { label: "관계 구축과 감정적 연결 형성", value: "relational" }
    ]
  },
  {
    id: 'cm3',
    category: 'communication',
    text: "나는 복잡한 개념이나 아이디어를 다른 사람들이 이해하기 쉽게 설명하는 것을 잘한다.",
    type: 'likert'
  },
  {
    id: 'cm4',
    category: 'communication',
    text: "갈등 상황에서 나는 주로:",
    type: 'choice',
    options: [
      { label: "문제 해결을 위해 직접적으로 대화한다", value: "confrontation" },
      { label: "조화를 유지하기 위해 타협점을 찾는다", value: "compromise" }
    ]
  },
  {
    id: 'cm5',
    category: 'communication',
    text: "나는 다양한 문화적 배경을 가진 사람들과 효과적으로 소통하는 것에 자신이 있다.",
    type: 'likert'
  },
  // 문제 해결 접근법 질문
  {
    id: 'ps1',
    category: 'problem_solving',
    text: "문제를 해결할 때 나는 주로:",
    type: 'choice',
    options: [
      { label: "데이터와 사실에 기반하여 분석적으로 접근한다", value: "analytical" },
      { label: "직관과 경험에 의존한다", value: "intuitive" }
    ]
  },
  {
    id: 'ps2',
    category: 'problem_solving',
    text: "나는 문제의 근본 원인을 파악하기 위해 체계적으로 분석하는 것을 좋아한다.",
    type: 'likert'
  },
  {
    id: 'ps3',
    category: 'problem_solving',
    text: "복잡한 문제에 직면했을 때, 나는 창의적인 해결책을 찾아내는 것을 잘한다.",
    type: 'likert'
  },
  {
    id: 'ps4',
    category: 'problem_solving',
    text: "어려운 결정을 내릴 때 나는:",
    type: 'choice',
    options: [
      { label: "가능한 많은 정보를 수집하고 분석한다", value: "thorough" },
      { label: "핵심 정보만 확인하고 신속하게 결정한다", value: "quick" }
    ]
  },
  {
    id: 'ps5',
    category: 'problem_solving',
    text: "나는 여러 관점에서 문제를 바라보고 다양한 해결 방안을 고려하는 것을 중요시한다.",
    type: 'likert'
  },
  // 환경 선호도 질문
  {
    id: 'en1',
    category: 'environment',
    text: "나는 다음과 같은 업무 환경을 선호한다:",
    type: 'choice',
    options: [
      { label: "안정적이고 예측 가능한 환경", value: "stable" },
      { label: "역동적이고 빠르게 변화하는 환경", value: "dynamic" }
    ]
  },
  {
    id: 'en2',
    category: 'environment',
    text: "나는 명확한 규칙과 구조가 있는 환경에서 더 편안함을 느낀다.",
    type: 'likert'
  },
  {
    id: 'en3',
    category: 'environment',
    text: "새로운 환경이나 상황에 빠르게 적응하는 것을 잘한다.",
    type: 'likert'
  },
  {
    id: 'en4',
    category: 'environment',
    text: "업무 수행 시 나는 다음 방식을 선호한다:",
    type: 'choice',
    options: [
      { label: "독립적으로 일하는 방식", value: "independent" },
      { label: "팀과 협업하는 방식", value: "collaborative" }
    ]
  },
  {
    id: 'en5',
    category: 'environment',
    text: "나는 다양한 업무와 프로젝트를 동시에 처리하는 것에 능숙하다.",
    type: 'likert'
  },
  // 가치 및 동기 질문
  {
    id: 'va1',
    category: 'values',
    text: "나는 다른 사람들에게 서비스를 제공하고 도움을 주는 것에서 만족감을 느낀다.",
    type: 'likert'
  },
  {
    id: 'va2',
    category: 'values',
    text: "새로운 것을 배우고 지속적으로 성장하는 것이 나에게 중요하다.",
    type: 'likert'
  },
  {
    id: 'va3',
    category: 'values',
    text: "다음 중 어떤 것이 당신에게 더 중요한 가치인가요?",
    type: 'choice',
    options: [
      { label: "안정성과 보안", value: "stability" },
      { label: "도전과 성취", value: "achievement" }
    ]
  },
  {
    id: 'va4',
    category: 'values',
    text: "나는 혁신과 변화를 주도하는 역할을 맡는 것을 즐긴다.",
    type: 'likert'
  },
  {
    id: 'va5',
    category: 'values',
    text: "직업 선택 시 가장 중요하게 생각하는 요소는?",
    type: 'choice',
    options: [
      { label: "업무의 의미와 사회적 영향력", value: "meaning" },
      { label: "경제적 보상과 성장 기회", value: "reward" }
    ]
  }
];

// 응답 값 정규화 함수
const normalizeResponse = (question, answer) => {
  // 리커트 척도(1-5) 질문인 경우
  if (question.type === 'likert') {
    return answer; // 1-5 값 그대로 사용
  }
  
  // 선택형 질문의 경우 응답 유형에 따라 값 변환
  if (question.type === 'choice') {
    // 예: 체계적(5점) vs 유연한(1점) 작업 스타일 질문
    if (question.id === 'ws3') {
      return answer === 'systematic' ? 5 : 1;
    }
    
    // 전략적(5점) vs 실행(2점) 역할 선호도
    if (question.id === 'ws5') {
      return answer === 'strategic' ? 5 : 2;
    }
    
    // 직접적(4점) vs 관계적(2점) 커뮤니케이션
    if (question.id === 'cm2') {
      return answer === 'direct' ? 4 : 2;
    }
    
    // 갈등 해결: 직접 대화(3점) vs 타협(4점)
    if (question.id === 'cm4') {
      return answer === 'confrontation' ? 3 : 4;
    }
    
    // 문제 해결 접근법: 분석적(5점) vs 직관적(2점)
    if (question.id === 'ps1') {
      return answer === 'analytical' ? 5 : 2;
    }
    
    // 의사결정 방식: 철저함(5점) vs 신속함(2점)
    if (question.id === 'ps4') {
      return answer === 'thorough' ? 5 : 2;
    }
    
    // 업무 환경 선호: 안정적(4점) vs 역동적(3점)
    if (question.id === 'en1') {
      return answer === 'stable' ? 4 : 3;
    }
    
    // 작업 방식: 독립적(3점) vs 협업(4점)
    if (question.id === 'en4') {
      return answer === 'independent' ? 3 : 4;
    }
    
    // 핵심 가치: 안정성(4점) vs 도전(3점)
    if (question.id === 'va3') {
      return answer === 'stability' ? 4 : 3;
    }
    
    // 직업 동기: 의미(3점) vs 보상(4점)
    if (question.id === 'va5') {
      return answer === 'meaning' ? 3 : 4;
    }
    
    // 기본값
    return 3;
  }
  
  return 3; // 기본값
};

// 일본 비즈니스 적응력 검사 데이터
const JAPAN_BUSINESS_TEST = {
  introduction: "일본 비즈니스 문화 적응력 진단 평가",
  guidance: [
    "각 문항은 일본 비즈니스 환경에서 마주할 수 있는 복잡한 상황을 제시합니다.",
    "각 상황에서 본인이 취할 것 같은 행동을 4개 선택지 중에서 고르세요.",
    "모든 선택지는 정답이 없으며 나름의 장단점이 있으므로 신중하게 판단하세요.",
    "본인의 주관에 맞춰서 솔직하게 선택해 주세요."
  ],
  questions: [
    {
      id: "jb1",
      text: "당신은 일본 회사에 입사한 지 6개월 된 직원입니다. 중요한 프로젝트에 대한 회의 중, 당신의 직속 상사가 아닌 다른 부서의 과장(課長)이 프로젝트 방향에 대해 당신이 볼 때 비효율적인 접근법을 제안했습니다. 이 과장은 회사에서 평판이 좋고 당신보다 10년 이상 경력이 많습니다. 당신은 더 효과적인 방법을 알고 있다고 확신합니다. 어떻게 대응하겠습니까?",
      options: [
        { value: "A", label: "회의 중에 '제 경험에 비추어 볼 때, 이런 접근 방식이 더 효율적일 것 같습니다'라고 말하며 자신의 의견을 명확하게 제시한다." },
        { value: "B", label: "회의가 끝난 후 자신의 직속 상사에게 먼저 자신의 생각을 설명하고, 상사의 조언에 따라 과장에게 개인적으로 대안을 제안하거나 다음 회의에서 의견을 내도록 한다." },
        { value: "C", label: "회의 중 '질문이 있습니다'라고 말한 후, 과장의 방식에 대해 더 자세히 물어보면서 간접적으로 자신의 대안을 암시한다." },
        { value: "D", label: "회의 직후 해당 과장을 개인적으로 찾아가 '다른 관점에서 생각해 보았는데, 이런 방법도 고려해보시면 어떨까요?'라고 조심스럽게 제안한다." }
      ],
      category: "hierarchy",
      explanation: {
        title: "계층 구조와 연공서열",
        answers: {
          "A": { score: 2, description: "최악의 선택" },
          "B": { score: 5, description: "최선" },
          "C": { score: 3, description: "그닥 좋지 않은 선택" },
          "D": { score: 4, description: "차선" }
        },
        detail: "일본의 계층 구조에서는 직접적인 의견 대립을 피하는 것이 중요합니다. 직속 상사를 통해 의견을 전달하는 것이 가장 적절한 채널입니다. 개인적으로 과장에게 접근하는 것도 가능하지만, 상사를 통하지 않으면 조직 위계를 무시하는 행동으로 보일 수 있습니다."
      }
    },
    {
      id: "jb2",
      text: "당신은 국제 마케팅 부서에서 일하고 있으며, 해외 시장을 위한 새로운 판촉 전략을 구상했습니다. 이 아이디어는 회사의 전통적인 접근 방식과는 다소 다르지만, 효과가 있을 것이라고 확신합니다. 이 아이디어를 어떻게 추진하겠습니까?",
      options: [
        { value: "A", label: "정기 부서 회의에서 준비한 자료를 바탕으로 자신의 아이디어를 발표하고, 자신의 해외 경험을 강조하며 즉각적인 피드백을 요청한다." },
        { value: "B", label: "영향력 있는 선임 동료 몇 명에게 먼저 비공식적으로 아이디어를 설명하고 지지를 얻은 후, 상사에게 개인적으로 제안하고, 공식 제안서를 작성한다." },
        { value: "C", label: "상사에게 이메일로 아이디어의 개요를 보내고 의견을 구한 후, 긍정적인 반응이 있으면 부서 회의에서 발표할 수 있도록 안건에 포함시켜 달라고 요청한다." },
        { value: "D", label: "먼저 공식 제안서를 작성하여 링기(稟議) 절차를 시작하고, 관련 부서의 승인을 얻을 수 있도록 문서를 회람시킨다." }
      ],
      category: "decision_making",
      explanation: {
        title: "의사결정 프로세스",
        answers: {
          "A": { score: 2, description: "최악의 선택" },
          "B": { score: 5, description: "최선" },
          "C": { score: 4, description: "차선" },
          "D": { score: 3, description: "그닥 좋지 않은 선택" }
        },
        detail: "네마와시(根回し)를 통한 사전 합의 형성이 중요합니다. 특히 전통적인 방식과 다른 새로운 아이디어일수록 공식 절차 전에 비공식적인 지지를 얻는 것이 성공 확률을 높입니다."
      }
    },
    {
      id: "jb3",
      text: "당신은 일본 클라이언트와 새로운 프로젝트에 대해 논의 중입니다. 제안서를 보낸 후 클라이언트로부터 '흥미로운 제안이네요. 검토해 보겠습니다만, 일정과 예산 면에서 조금 재고가 필요할 것 같습니다(興味深いご提案ですね。検討させていただきますが、スケジュールと予算面で少し考慮が必要かもしれません)'라는 답변을 받았습니다. 어떻게 해석하고 대응하겠습니까?",
      options: [
        { value: "A", label: "긍정적인 반응으로 이해하고, 추가 정보와 구체적인 일정 및 예산 조정안을 포함한 상세 제안서를 준비하여 보낸다." },
        { value: "B", label: "이것을 부드러운 거절로 해석하고, '다른 접근 방식에 관심이 있으신지' 물어보며 완전히 새로운 제안을 준비한다." },
        { value: "C", label: "'어떤 부분이 구체적으로 우려되시는지 알려주시면, 그에 맞게 조정할 수 있습니다'라고 회신하여 더 명확한 피드백을 요청한다." },
        { value: "D", label: "일주일 정도 기다린 후 '제안서에 대한 검토는 어떻게 진행되고 있습니까?'라고 후속 이메일을 보낸다." }
      ],
      category: "communication",
      explanation: {
        title: "독특한 커뮤니케이션 방식",
        answers: {
          "A": { score: 2, description: "최악의 선택" },
          "B": { score: 4, description: "차선" },
          "C": { score: 5, description: "최선" },
          "D": { score: 3, description: "그닥 좋지 않은 선택" }
        },
        detail: "일본식 커뮤니케이션에서 '재고가 필요하다'는 표현은 거절이나 큰 우려를 의미할 수 있습니다. 그러나 완전한 거절로 해석하기보다는, 구체적인 우려 사항을 파악하여 대응하는 것이 효과적입니다."
      }
    },
    {
      id: "jb4",
      text: "당신은 일본 기업과 중요한 비즈니스 협상을 앞두고 있습니다. 첫 미팅 이후, 일본 측 담당자가 정식 계약 논의 전에 저녁 식사, 골프, 회사 견학 등 여러 비공식적인 만남을 제안했습니다. 협상 일정이 빠듯한 상황에서 어떻게 대응하겠습니까?",
      options: [
        { value: "A", label: "모든 제안을 수락하고 이러한 비공식적 만남에 시간을 충분히 할애하되, 각 자리에서 자연스럽게 비즈니스 관련 대화도 조금씩 섞어 논의를 진전시킨다." },
        { value: "B", label: "'먼저 계약 조건에 대해 합의한 후, 그것을 축하하는 의미로 함께 시간을 보내면 어떨까요?'라고 정중히 제안하며 비즈니스 논의를 우선시한다." },
        { value: "C", label: "식사와 회사 견학은 수락하되 골프는 시간 제약을 이유로 정중히 사양하고, 비공식 만남과 공식 협상을 병행하여 진행한다." },
        { value: "D", label: "모든 제안을 수락하고 이 기회를 통해 비즈니스 대화는 최소화하면서 개인적 관계 형성과 일본 문화 이해에 집중한다." }
      ],
      category: "relationship",
      explanation: {
        title: "관계 중심 비즈니스",
        answers: {
          "A": { score: 5, description: "최선" },
          "B": { score: 2, description: "최악의 선택" },
          "C": { score: 4, description: "차선" },
          "D": { score: 3, description: "그닥 좋지 않은 선택" }
        },
        detail: "일본 비즈니스에서는 개인적 관계 형성이 계약보다 선행됩니다. 비공식 만남을 통해 신뢰를 구축하면서도 자연스럽게 비즈니스 논의를 진전시키는 균형 잡힌 접근이 효과적입니다."
      }
    },
    {
      id: "jb5",
      text: "당신이 일본 본사에 새로운 마케팅 전략을 제안한 후, 부장(部長)이 '매우 독창적인 아이디어입니다. 참고하겠습니다(参考にさせていただきます). 일본 시장의 특성을 잘 반영했군요'라고 말했습니다. 다른 동료들은 아무 말도 하지 않고 미소만 짓고 있습니다. 이 반응을 어떻게 해석하고 다음 단계로 무엇을 하겠습니까?",
      options: [
        { value: "A", label: "긍정적인 피드백으로 이해하고, 곧바로 세부 실행 계획을 작성하여 공유한다." },
        { value: "B", label: "일본 시장 특성에 대한 언급이 있었으므로, 제안을 수정하여 더 현지화된 버전을 준비한다." },
        { value: "C", label: "실질적으로는 거절이라고 판단하고, 다른 접근법을 모색하되 이 아이디어는 더 이상 언급하지 않는다." },
        { value: "D", label: "애매한 반응으로 해석하고, 개인적으로 일본인 동료에게 '부장님의 실제 의견이 어떤 것 같았나요?'라고 비공식적으로 물어본다." }
      ],
      category: "implicit_communication",
      explanation: {
        title: "긍정적 표현 속 부정적 의미 파악",
        answers: {
          "A": { score: 2, description: "최악의 선택" },
          "B": { score: 3, description: "그닥 좋지 않은 선택" },
          "C": { score: 4, description: "차선" },
          "D": { score: 5, description: "최선" }
        },
        detail: "'매우 독창적' 또는 '참고하겠습니다'라는 표현은 종종 부정적 의미를 함축합니다. 특히 다른 참석자들의 침묵은 중요한 신호입니다. 일본 문화에서는 직접적인 거절을 피하므로, 비공식 채널을 통해 실제 반응을 확인하는 것이 현명합니다."
      }
    },
    {
      id: "jb6",
      text: "당신이 속한 팀은 6개월간 진행될 신규 프로젝트의 접근 방식을 논의 중입니다. 팀 내 대다수는 안전하고 검증된 방법을 선호하고 있지만, 당신은 혁신적인 새로운 방법이 훨씬 효과적이라고 확신합니다. 회의에서 어떻게 행동하겠습니까?",
      options: [
        { value: "A", label: "'팀의 의견을 존중하지만, 제가 제안하는 방식이 왜 더 효과적인지 설명하겠습니다'라고 말한 후, 자신의 접근법에 대한 명확한 이점을 데이터와 함께 제시한다." },
        { value: "B", label: "먼저 팀이 선호하는 방식의 장점을 인정한 후, '기존 방식에 몇 가지 새로운 요소를 추가하면 더욱 효과적일 수 있을 것 같습니다'라고 제안하며 점진적 변화를 모색한다." },
        { value: "C", label: "회의에서는 다수의 의견에 따르겠다고 동의하고, 이후 프로젝트 진행 과정에서 자신의 아이디어를 부분적으로 적용할 기회를 찾는다." },
        { value: "D", label: "자신의 아이디어를 회의 전에 팀원들에게 개별적으로 설명하여 지지를 얻은 후, 회의에서 '몇몇 팀원들과 논의해 본 결과...'라고 시작하며 집단적 지지가 있는 것처럼 제안한다." }
      ],
      category: "group_harmony",
      explanation: {
        title: "집단주의와 조화",
        answers: {
          "A": { score: 2, description: "최악의 선택" },
          "B": { score: 5, description: "최선" },
          "C": { score: 4, description: "차선" },
          "D": { score: 3, description: "그닥 좋지 않은 선택" }
        },
        detail: "일본 비즈니스 문화에서는 '와(和)' 즉 조화가 중요합니다. 혁신적인 아이디어도 기존 방식에 점진적으로 통합하는 접근법이 더 수용되기 쉽습니다."
      }
    },
    {
      id: "jb7",
      text: "당신이 맡은 프로젝트에 대해 일본인 상사가 '이 보고서를 내일까지 완성할 수 있을까요?(このレポートは明日までに完成できますか？)'라고 물었습니다. 당신은 현재 다른 긴급한 업무도 있어 사실상 어렵다고 생각합니다. 어떻게 대응하겠습니까?",
      options: [
        { value: "A", label: "'죄송합니다만, 현재 진행 중인 긴급 업무가 있어 내일까지는 어렵습니다. 목요일까지 제출해도 될까요?'라고 직접적으로 답한다." },
        { value: "B", label: "'최선을 다해 보겠습니다만, 현재 다른 업무도 진행 중이라 일정이 빠듯합니다. 우선순위를 어떻게 조정하면 좋을지 조언 부탁드립니다'라고 대답한다." },
        { value: "C", label: "이것이 사실상 지시임을 이해하고, 다른 업무를 미루더라도 내일까지 완성하여 제출한다." },
        { value: "D", label: "'네, 가능합니다'라고 대답한 후, 실제로 완성이 어려우면 내일 지연 사유와 함께 진행 상황을 보고한다." }
      ],
      category: "implicit_instruction",
      explanation: {
        title: "질문 형태의 지시나 요청 이해",
        answers: {
          "A": { score: 2, description: "최악의 선택" },
          "B": { score: 5, description: "최선" },
          "C": { score: 4, description: "차선" },
          "D": { score: 3, description: "그닥 좋지 않은 선택" }
        },
        detail: "일본 비즈니스 문화에서 상사의 '할 수 있을까요?'라는 질문은 실제로는 지시인 경우가 많습니다. 그러나 실제로 불가능한 경우, 직접적인 거절보다는 상황을 설명하고 조언을 구하는 방식이 관계를 유지하면서도 현실적인 해결책을 찾는 방법입니다."
      }
    },
    {
      id: "jb8",
      text: "당신의 팀은 다음 주 금요일까지 중요한 프로젝트를 완료해야 합니다. 목요일 저녁, 아직 많은 작업이 남아있어 팀장이 모두에게 금요일 밤과 필요하다면 주말까지 연장 근무를 해야 할 수도 있다고 알렸습니다. 그런데 당신은 오래 전부터 계획된 가족 행사가 토요일에 있습니다. 어떻게 대응하겠습니까?",
      options: [
        { value: "A", label: "금요일 밤까지는 최대한 일하되, 토요일 가족 행사는 참석해야 한다고 미리 팀장에게 알리고, 일요일에 다시 와서 작업을 계속하겠다고 제안한다." },
        { value: "B", label: "가족 행사를 취소하고 팀과 함께 주말까지 근무하여 프로젝트를 완료한다. 가족에게는 업무 상황을 설명하고 이해를 구한다." },
        { value: "C", label: "목요일과 금요일에 가능한 한 많은 작업을 처리하고, 토요일 가족 행사에는 짧게 참석한 후 다시 사무실로 복귀하여 나머지 작업을 완료한다." },
        { value: "D", label: "팀장에게 가족 행사가 중요하다고 설명하고, 개인적으로 목요일 밤과 금요일에 추가 시간을 투자하여 자신의 담당 부분을 완료하겠다고 제안한다." }
      ],
      category: "loyalty",
      explanation: {
        title: "충성도와 소속감",
        answers: {
          "A": { score: 3, description: "그닥 좋지 않은 선택" },
          "B": { score: 2, description: "최악의 선택" },
          "C": { score: 4, description: "차선" },
          "D": { score: 5, description: "최선" }
        },
        detail: "일본 기업문화에서는 팀에 대한 헌신이 중요하지만, 개인의 희생만을 요구하지는 않습니다. 중요한 것은 팀의 목표 달성에 자신이 기여하려는 의지를 보여주는 것입니다. 효과적인 타협안을 제시하는 것이 가장 바람직합니다."
      }
    },
    {
      id: "jb9",
      text: "당신이 근무하는 일본 회사에서 새로운 시장에 진출하는 계획을 논의 중입니다. 이 시장은 잠재력이 크지만 위험도 상당합니다. 초기 회의에서 여러 의견이 나왔고, 이제 당신의 의견을 물어봅니다. 어떻게 대응하겠습니까?",
      options: [
        { value: "A", label: "경쟁사의 성공 사례와 실패 사례를 상세히 분석하고, 단계적 접근법과 각 단계별 리스크 관리 방안을 구체적으로 제시한다." },
        { value: "B", label: "이 시장의 잠재력과 혁신적인 진입 전략을 강조하며, 빠른 결정과 과감한 투자가 경쟁 우위를 가져올 수 있다고 주장한다." },
        { value: "C", label: "회사의 기존 강점과 일치하는 안전한 부분부터 시작하여 점진적으로 확장해 나가는 보수적 접근법을 지지한다." },
        { value: "D", label: "다른 임원들의 의견을 참고하여 대체로 지지를 받는 방향으로 자신의 의견을 조정하여 발표한다." }
      ],
      category: "uncertainty_avoidance",
      explanation: {
        title: "불확실성 회피",
        answers: {
          "A": { score: 5, description: "최선" },
          "B": { score: 2, description: "최악의 선택" },
          "C": { score: 4, description: "차선" },
          "D": { score: 3, description: "그닥 좋지 않은 선택" }
        },
        detail: "일본 기업은 불확실성을 회피하는 경향이 있습니다. 철저한 사례 분석과 리스크 관리 방안을 제시하는 것이 가장 효과적이며, 급진적 변화보다는 점진적 접근을 선호합니다."
      }
    },
    {
      id: "jb10",
      text: "당신은 일본 대기업의 국제부서에서 유일한 외국인 관리자로 일하고 있습니다. 6개월이 지났지만 여전히 중요한 의사결정 과정에서 배제되는 느낌이 들고, 일본인 동료들은 당신 앞에서도 종종 일본어로 대화하여 소외감을 줍니다. 어떻게 대응하겠습니까?",
      options: [
        { value: "A", label: "상사와의 1:1 면담을 요청하여 현 상황에 대한 우려를 전문적으로 표현하고, 팀에 더 효과적으로 기여하기 위한 방법을 논의한다." },
        { value: "B", label: "동료들과의 관계 형성에 더 많은 노력을 기울이며, 점심 시간이나 회식에 적극 참여하고, 일본어 학습에 더 투자하면서 점진적 변화를 기대한다." },
        { value: "C", label: "국제부서임에도 이런 분위기가 지속된다면 불공정하다고 판단하고, 인사부에 공식적으로 이의를 제기하거나 타 부서로의 이동을 요청한다." },
        { value: "D", label: "문화적 차이를 인정하고, 일본식 업무 방식에 자신을 완전히 적응시키기 위해 노력하면서, 의사결정 과정에는 참여하지 못하더라도 주어진 역할에 집중한다." }
      ],
      category: "insider_outsider",
      explanation: {
        title: "외부인과 내부인의 구분",
        answers: {
          "A": { score: 4, description: "차선" },
          "B": { score: 5, description: "최선" },
          "C": { score: 2, description: "최악의 선택" },
          "D": { score: 3, description: "그닥 좋지 않은 선택" }
        },
        detail: "일본 사회에서 외부인으로서 인정받기 위해서는 장기적인 관계 구축과 문화적 적응 노력이 필요합니다. 공식적 이의 제기보다는 개인적 노력과 점진적 접근이 더 효과적입니다."
      }
    }
  ],
  interpretation: {
    scores: [
      { min: 41, max: 50, level: "일본진출 준비 완료", description: "일본 비즈니스 문화에 대한 뛰어난 이해도를 보여줍니다. 미묘한 문화적 차이와 비즈니스 관행에 능숙하게 대응할 수 있습니다." },
      { min: 31, max: 40, level: "고지가 눈앞에", description: "일본 비즈니스 문화의 여러 측면을 잘 이해하고 있으며, 대부분의 상황에서 적절히 대응할 수 있습니다. 더 깊은 문화적 뉘앙스를 파악하는 데 집중하면 좋겠습니다." },
      { min: 21, max: 30, level: "아직 갈 길이 멀지만", description: "일본 비즈니스 문화의 기본 개념은 이해하고 있지만, 복잡한 상황에서 적절히 대응하는 능력을 발전시켜야 합니다." },
      { min: 0, max: 20, level: "천리길도 한 걸음부터", description: "일본 비즈니스 문화에 대한 이해가 초기 단계입니다. 기본적인 비즈니스 예절과 문화적 차이에 대한 학습이 필요합니다." }
    ]
  }
};

// 일본어 수준 검사 데이터
const JAPAN_LANGUAGE_TEST = {
  introduction: "일본어 능력 검사",
  guidance: [
    "각 문항은 일본어 비즈니스 용어나 표현에 관한 질문입니다.",
    "제시된 용어에 대한 가장 적절한 일본어 설명을 골라주세요.",
    "결과는 일본어 능력과 비즈니스 일본어에 대한 이해도를 평가하는 데 사용됩니다."
  ],
  questions: [
    {
      id: "jl1",
      text: "「定例会」とは、業務上どのような性質の会合を指すか？",
      options: [
        { value: "A", label: "毎週または毎月といった定期的なスケジュールに基づき開催される会議" },
        { value: "B", label: "緊急事態の際に臨時召集される会議" },
        { value: "C", label: "経営陣のみで秘密裏に行われる会合" },
        { value: "D", label: "自由形式で出席者が自由に意見を交わす非公式ミーティング" }
      ],
      correctAnswer: "A",
      explanation: "「定例会」とは、組織内で定められたスケジュールに従い、定期的に開催される会議であり、業務の進捗報告や問題解決のための情報共有が目的."
    },
    {
      id: "jl2",
      text: "「根回し」の意味として最も適切なものはどれか？",
      options: [
        { value: "A", label: "決定事項を上層部に正式に報告する行為" },
        { value: "B", label: "非公式な場で事前に関係者と意見交換し、合意形成を図るプロセス" },
        { value: "C", label: "会議終了後に決定事項を関係各所へ一方的に伝達する方法" },
        { value: "D", label: "定例会で話し合われた内容を議事録としてまとめること" }
      ],
      correctAnswer: "B",
      explanation: "「根回し」は、正式な決定前に非公式な話し合いや相談を通じ、関係者間でお互いの意向や情報を調整して合意形成を促す重要なプロセスを意味するよ."
    },
    {
      id: "jl3",
      text: "「議事録」とは、どのような内容や役割を持つ記録か？",
      options: [
        { value: "A", label: "会議や打ち合わせの内容、決定事項、議論の過程を文書化した記録" },
        { value: "B", label: "会議の開始前に配布する、議題やアジェンダのリスト" },
        { value: "C", label: "会議中に発表されたプレゼンテーション資料のコピー" },
        { value: "D", label: "会議後に外部の関係者向けに作成される経営報告書" }
      ],
      correctAnswer: "A",
      explanation: "「議事録」は、会議での発言内容や決定事項、討議の流れを正確に記録し、後日確認やフォローアップに利用するための文書記録を意味する。"
    },
    {
      id: "jl4",
      text: "「ほれんそう」とは何を略した言葉であり、その重要性は何か？",
      options: [
        { value: "A", label: "個々の業務に対する自主的な自己管理" },
        { value: "B", label: "報告・連絡・相談の三拍子で、効率的な業務遂行と円滑なコミュニケーションを支える基本原則" },
        { value: "C", label: "上司と部下との定期的な1対1ミーティング" },
        { value: "D", label: "電子メールを用いた業務連絡のみに限定された手法" }
      ],
      correctAnswer: "B",
      explanation: "「ほれんそう」は、報告、連絡、相談の略であり、組織内での情報共有と問題解決、リスク管理の基本として極めて重要なコミュニケーション手法を示す言葉。"
    },
    {
      id: "jl5",
      text: "「認識合わせ」のプロセスとして最も適切な説明はどれか？",
      options: [
        { value: "A", label: "決定事項が一方的に伝達され、受け手がそのまま実行する状態" },
        { value: "B", label: "複数の関係者間で意見や理解をすり合わせ、共通の認識を持つよう調整すること" },
        { value: "C", label: "既存の計画や意見を変更せず、そのまま維持する意思表示" },
        { value: "D", label: "会議前に個々の目標や役割を別々に確認するだけの手法" }
      ],
      correctAnswer: "B",
      explanation: "「認識合わせ」は、関係者全体が同じ情報や状況理解を共有するためのプロセスで、誤解やズレを防ぎ、効果的な協働を実現するために欠かせない取り組みだよ。"
    },
    {
      id: "jl6",
      text: "「稟議」とは、主に社内においてどのようなプロセスを指すか？",
      options: [
        { value: "A", label: "社員全員に自由意見を求める会議の開催" },
        { value: "B", label: "提案や決裁事項を文書で回覧し、複数の責任者の承認を得るプロセス" },
        { value: "C", label: "日々の業務報告のための定例会の実施" },
        { value: "D", label: "プロジェクト終了後の反省会の記録作成" }
      ],
      correctAnswer: "B",
      explanation: "「稟議」は、会社内で提案や決裁事項を回覧し、関係部署や上司の承認を段階的に得る意思決定プロセスのことを指す。"
    },
    {
      id: "jl7",
      text: "「決裁」とは、企業内においてどのような行為を意味するか？",
      options: [
        { value: "A", label: "複数の部署で情報を共有すること" },
        { value: "B", label: "上層部が最終的な権限で文書や提案の承認を行うこと" },
        { value: "C", label: "同僚間で自由に意見を交換する会議を開くこと" },
        { value: "D", label: "社内イベントの開催を担当する業務" }
      ],
      correctAnswer: "B",
      explanation: "「決裁」は、上司や経営陣が最終的な判断権をもって提案や文書の内容を正式に承認するプロセスを意味する。"
    },
    {
      id: "jl8",
      text: "「商談」とは、どのようなビジネスの状況を指すか？",
      options: [
        { value: "A", label: "社内スタッフ間のカジュアルな意見交換" },
        { value: "B", label: "企業間で正式な条件交渉を目的として行われる会議" },
        { value: "C", label: "定例の進捗報告会の一部として行われる短い打合せ" },
        { value: "D", label: "経営方針を発表するための社内プレゼンテーション" }
      ],
      correctAnswer: "B",
      explanation: "「商談」は、企業同士が取引条件や契約内容などを正式に交渉するための会合を意味し,これにより両社間の商取引が成立するための基盤を整えるプロセスとなる。"
    },
    {
      id: "jl9",
      text: "「リスク管理」とは、企業活動においてどのようなプロセスを指すか？",
      options: [
        { value: "A", label: "企業の予算配分を最適化するための計画策定" },
        { value: "B", label: "企業が直面する可能性のある問題や危険を事前に特定し、対策を講じる活動" },
        { value: "C", label: "新製品の市場投入に際してのプロモーション戦略の実施" },
        { value: "D", label: "業務プロセスの効率化のために外部委託を積極的に進める手法" }
      ],
      correctAnswer: "B",
      explanation: "「リスク管理」は、企業が業務を進める上で発生し得る不確定要素や潜在的なリスクを事前に把握・評価し、その影響を最小限に抑えるための対策を計画・実行するプロセスを意味する。"
    },
    {
      id: "jl10",
      text: "「コンプライアンス」とは、企業活動においてどのような意味を持つか？",
      options: [
        { value: "A", label: "社内のイノベーション促進や新規事業開発の推進" },
        { value: "B", label: "企業が法令、倫理、内部規定などを遵守し、社会的な信頼を維持するための取り組み" },
        { value: "C", label: "部署間の情報共有を促進するための定例ミーティング" },
        { value: "D", label: "業務プロセスの改善を目的とした外部コンサルタントの起用" }
      ],
      correctAnswer: "B",
      explanation: "「コンプライアンス」は、企業が業務を遂行する上で関係法令や社内規定、社会倫理などを遵守し、透明性と信頼性の高い経営を実現するための基本的な考え方と実践体制を 意味する。"
    }
  ],
  interpretation: {
    scores: [
      { min: 0, max: 3, level: "초급 수준", description: "비즈니스 일본어의 기본 용어에 익숙해지는 단계입니다. 기초적인 비즈니스 회화와 자주 사용되는 표현을 학습하는 것이 도움이 될 것입니다." },
      { min: 4, max: 6, level: "중급 수준", description: "비즈니스 일본어의 주요 개념과 표현을 이해하고 있습니다. 업계별 전문 용어와 좀 더 복잡한 표현을 학습하면 실무에서의 의사소통이 더욱 원활해질 것입니다." },
      { min: 7, max: 8, level: "중상급 수준", description: "비즈니스 일본어에 대한 이해도가 높습니다. 대부분의 비즈니스 상황에서 효과적으로 의사소통할 수 있으며, 더 미묘한 표현과 업계별 전문 용어를 학습하면 좋겠습니다." },
      { min: 9, max: 10, level: "고급 수준", description: "비즈니스 일본어에 매우 능숙합니다. 다양한 비즈니스 상황에서 자신감 있게 의사소통할 수 있으며, 전문적인 문맥에서도 일본어를 효과적으로 사용할 수 있습니다." }
    ]
  }
};

// 일본취업 적합 업종 테스트 문항
// ... existing code ...

function App() {
  const [appState, setAppState] = useState(APP_STATES.HOME);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [currentTest, setCurrentTest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const startSurvey = () => {
    setAppState(APP_STATES.SURVEY);
  };
  
  const handleAnswer = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };
  
  // 산업 적합도 계산 함수
  const calculateIndustryFit = () => {
    const industryScores = {};
    
    // 각 산업에 대한 점수 계산
    Object.keys(INDUSTRY_TRAITS).forEach(industry => {
      let score = 0;
      let totalPossible = 0;
      
      // 해당 산업의 중요 특성 확인
      const industryTraits = INDUSTRY_TRAITS[industry].traits.map(t => t.name);
      
      // 각 질문에 대해
      Object.keys(answers).forEach(questionId => {
        // 이 질문이 어떤 특성과 관련되는지 확인
        const relatedTraits = QUESTION_TRAIT_MAPPING[questionId] || [];
        const answer = answers[questionId];
        const question = QUESTIONS.find(q => q.id === questionId);
        
        if (question && answer) {
          // 점수 정규화
          const normalizedScore = normalizeResponse(question, answer);
          
          // 이 질문이 해당 산업의 특성과 관련이 있는지 확인
          relatedTraits.forEach(trait => {
            if (industryTraits.includes(trait)) {
              // 특성의 가중치 찾기
              const traitWeight = INDUSTRY_TRAITS[industry].traits.find(t => t.name === trait)?.weight || 1;
              
              // 가중치를 고려하여 점수 추가
              score += normalizedScore * traitWeight;
              totalPossible += 5 * traitWeight; // 최대 점수(5)에 가중치 곱함
            }
          });
        }
      });
      
      // 최종 점수를 백분율로 변환 (최대 100점)
      industryScores[industry] = totalPossible > 0 ? Math.round((score / totalPossible) * 100) : 0;
    });
    
    return industryScores;
  };
  
  // 헤더 렌더링
  const renderHeader = () => (
    <header className="header">
      <button className="logo" onClick={() => setAppState(APP_STATES.HOME)}>entry.ai</button>
      <div className="header-right">
        <a 
          href="#" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="header-button"
        >
          ❤️ Who made this?
        </a>
      </div>
    </header>
  );
  
  // 홈페이지 렌더링
  const renderHomePage = () => (
    <div className="container">
      <div className="test-grid">
        {TEST_CARDS.map(card => (
          <div 
            key={card.id} 
            className="test-card" 
            onClick={() => {
              setCurrentTest(card.id);
              setAppState(APP_STATES.START);
            }}
          >
            <div 
              className="test-card-image" 
              style={{ backgroundImage: `url(${card.image})` }}
            ></div>
            <div className="test-card-content">
              <h3 className="test-card-title">{card.title}</h3>
              <p className="test-card-description">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="iq-test-section">
        <div className="iq-test-content">
          <h2>entry.ai 엔트리시트 메이커</h2>
          <p>5분만에 만들어보는 업계/직종별 맞춤형 엔트리시트</p>
        </div>
        <a 
          href="https://chatgpt.com/g/g-67e6593863c8819182fe301338057534-entry-ai-enteurisiteu-meikeo" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="iq-test-button"
        >
          ›
        </a>
      </div>
    </div>
  );
  
  // 시작 페이지
  const renderStartPage = () => (
    <div className="start-page">
      <h1>
        {currentTest === 'mbti_test' ? 
          '일본 비즈니스 문화 적응력 진단 평가' : 
          currentTest === 'japan_life_test' ?
          '일본어 능력 검사' :
          '일본취업 업종 적합도 검사'}
      </h1>
      
      {currentTest === 'mbti_test' ? (
        <div className="test-instructions">
          <p>다양한 비즈니스 상황에서의 당신의 적응력과 적합도를 평가합니다.</p>
          <ul>
            {JAPAN_BUSINESS_TEST.guidance.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
          <button onClick={startSurvey}>검사 시작하기</button>
        </div>
      ) : currentTest === 'japan_life_test' ? (
        <div className="test-instructions">
          <p>일본 사회생활에서 자주 쓰이는 용어로 일본어 실력을 점검해봅니다.</p>
          <ul>
            {JAPAN_LANGUAGE_TEST.guidance.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
          <button onClick={startSurvey}>검사 시작하기</button>
        </div>
      ) : (
        <>
          <p>당신의 성향과 특성에 맞는 업계를 추천해드립니다.</p>
          <button onClick={startSurvey}>시작하기</button>
        </>
      )}
    </div>
  );
  
  // 설문조사 페이지
  const renderSurveyPage = () => {
    // 현재 선택된 테스트에 따라 질문 가져오기
    let currentQuestions = [];
    let categoryTitle = '';
    let categoryIcon = '';
    
    if (currentTest === 'mbti_test') {
      // 일본 비즈니스 적응력 검사인 경우
      currentQuestions = JAPAN_BUSINESS_TEST.questions;
      if (currentStep < currentQuestions.length) {
        const question = currentQuestions[currentStep];
        categoryTitle = question.category === 'hierarchy' ? '계층 구조와 연공서열' : 
                       question.category === 'decision_making' ? '의사결정 프로세스' :
                       question.category === 'communication' ? '독특한 커뮤니케이션 방식' :
                       question.category === 'relationship' ? '관계 중심 비즈니스' :
                       question.category === 'implicit_communication' ? '긍정적 표현 속 부정적 의미 파악' :
                       question.category === 'group_harmony' ? '집단주의와 조화' :
                       question.category === 'implicit_instruction' ? '질문 형태의 지시나 요청 이해' :
                       question.category === 'loyalty' ? '충성도와 소속감' :
                       question.category === 'uncertainty_avoidance' ? '불확실성 회피' :
                       question.category === 'insider_outsider' ? '외부인과 내부인의 구분' :
                       '일본 비즈니스 문화';
        categoryIcon = '🇯🇵';
      }
    } else if (currentTest === 'japan_life_test') {
      // 일본어 수준 검사인 경우
      currentQuestions = JAPAN_LANGUAGE_TEST.questions;
      categoryTitle = '일본어 비즈니스 용어';
      categoryIcon = '📝';
    } else {
      // 기본 적성 검사인 경우
      currentQuestions = QUESTIONS.filter(q => q.category === CATEGORIES[currentStep].id);
      categoryTitle = CATEGORIES[currentStep].name;
      categoryIcon = CATEGORIES[currentStep].icon;
    }
    
    // 현재 질문이 없는 경우 처리
    if (currentQuestions.length === 0) {
      return (
        <div className="survey-page">
          <h2>질문이 없습니다</h2>
          <div className="navigation">
            <button onClick={() => setAppState(APP_STATES.START)}>
              처음으로 돌아가기
            </button>
          </div>
        </div>
      );
    }
    
    // 일본 비즈니스 적응력 검사와 기본 적성 검사에 따라 다른 UI 렌더링
    if (currentTest === 'mbti_test') {
      const currentQuestion = currentQuestions[currentStep];
      
      return (
        <div className="survey-page japan-business-test">
          <div className="questions">
            <div className="question">
              <p className="question-number">문제 {currentStep + 1}/{currentQuestions.length}</p>
              <p className="question-text">{currentQuestion.text}</p>
              
              <div className="choice-options">
                {currentQuestion.options.map((option) => (
                  <button 
                    key={option.value}
                    onClick={() => handleAnswer(currentQuestion.id, option.value)}
                    className={answers[currentQuestion.id] === option.value ? 'selected' : ''}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="navigation">
            <button 
              disabled={currentStep === 0} 
              onClick={() => {
                if (currentStep > 0) {
                  setCurrentStep(currentStep - 1);
                }
              }}
            >
              이전
            </button>
            <button 
              onClick={() => {
                if (answers[currentQuestion.id]) {
                  if (currentStep < currentQuestions.length - 1) {
                    setCurrentStep(currentStep + 1);
                  } else {
                    setAppState(APP_STATES.RESULTS);
                  }
                } else {
                  alert('답변을 선택해주세요.');
                }
              }}
            >
              {currentStep < currentQuestions.length - 1 ? '다음' : '결과 보기'}
            </button>
          </div>
        </div>
      );
    } else if (currentTest === 'japan_life_test') {
      // 일본어 수준 검사 UI
      const currentQuestion = currentQuestions[currentStep];
      
      return (
        <div className="survey-page japan-language-test">
          <h2>{categoryIcon} {categoryTitle}</h2>
          <div className="questions">
            <div className="question">
              <p className="question-number">문제 {currentStep + 1}/{currentQuestions.length}</p>
              <p className="question-text">{currentQuestion.text}</p>
              
              <div className="choice-options">
                {currentQuestion.options.map((option) => (
                  <button 
                    key={option.value}
                    onClick={() => handleAnswer(currentQuestion.id, option.value)}
                    className={answers[currentQuestion.id] === option.value ? 'selected' : ''}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="navigation">
            <button 
              disabled={currentStep === 0} 
              onClick={() => {
                if (currentStep > 0) {
                  setCurrentStep(currentStep - 1);
                }
              }}
            >
              이전
            </button>
            <button 
              onClick={() => {
                if (answers[currentQuestion.id]) {
                  if (currentStep < currentQuestions.length - 1) {
                    setCurrentStep(currentStep + 1);
                  } else {
                    setAppState(APP_STATES.RESULTS);
                  }
                } else {
                  alert('답변을 선택해주세요.');
                }
              }}
            >
              {currentStep < currentQuestions.length - 1 ? '다음' : '결과 보기'}
            </button>
          </div>
        </div>
      );
    } else {
      // 기존 직업 적성 검사 UI
      return (
        <div className="survey-page">
          <h2>{categoryIcon} {categoryTitle}</h2>
          <div className="questions">
            {currentQuestions.map(question => (
              <div key={question.id} className="question">
                <p>{question.text}</p>
                
                {question.type === 'likert' ? (
                  <div className="likert-scale">
                    {[1, 2, 3, 4, 5].map(value => (
                      <button 
                        key={value} 
                        onClick={() => handleAnswer(question.id, value)}
                        className={answers[question.id] === value ? 'selected' : ''}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="choice-options">
                    {question.options.map((option) => (
                      <button 
                        key={option.value}
                        onClick={() => handleAnswer(question.id, option.value)}
                        className={answers[question.id] === option.value ? 'selected' : ''}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="navigation">
            <button 
              disabled={currentStep === 0} 
              onClick={() => {
                if (currentStep > 0) {
                  setCurrentStep(currentStep - 1);
                }
              }}
            >
              이전
            </button>
            <button 
              disabled={currentQuestions.some(q => !answers[q.id])}
              onClick={() => {
                // 현재 카테고리의 모든 질문에 답변했는지 확인
                const allAnswered = currentQuestions.every(q => answers[q.id]);
                
                if (!allAnswered) {
                  alert('모든 질문에 답변해주세요.');
                  return;
                }
                
                if (currentStep < CATEGORIES.length - 1) {
                  setCurrentStep(currentStep + 1);
                } else {
                  setAppState(APP_STATES.RESULTS);
                }
              }}
            >
              {currentStep < CATEGORIES.length - 1 ? '다음' : '결과 보기'}
            </button>
          </div>
        </div>
      );
    }
  };
  
  // 결과 페이지
  const renderResultsPage = () => {
    // 일본 비즈니스 적응력 검사 결과
    if (currentTest === 'mbti_test') {
      // 점수 계산
      let totalScore = 0;
      const detailScores = {};
      
      JAPAN_BUSINESS_TEST.questions.forEach(question => {
        if (answers[question.id]) {
          const score = question.explanation.answers[answers[question.id]].score;
          totalScore += score;
          detailScores[question.category] = (detailScores[question.category] || 0) + score;
        }
      });
      
      // 점수 범위에 따른 결과 판정
      const result = JAPAN_BUSINESS_TEST.interpretation.scores.find(
        range => totalScore >= range.min && totalScore <= range.max
      );
      
      // 카테고리별 점수 데이터 (레이더 차트용)
      const categories = [...new Set(JAPAN_BUSINESS_TEST.questions.map(q => q.category))];
      const categoryLabels = {
        'hierarchy': '계층 구조',
        'decision_making': '의사결정',
        'communication': '커뮤니케이션',
        'relationship': '관계 중심',
        'implicit_communication': '암묵적 소통',
        'group_harmony': '집단 조화',
        'implicit_instruction': '간접 지시',
        'loyalty': '소속감',
        'uncertainty_avoidance': '불확실성 회피',
        'insider_outsider': '내부인/외부인'
      };
      
      const categoryScores = categories.map(category => {
        const questions = JAPAN_BUSINESS_TEST.questions.filter(q => q.category === category);
        const maxScore = questions.length * 5; // 각 질문당 최대 5점
        const score = detailScores[category] || 0;
        return {
          subject: categoryLabels[category] || category,
          A: (score / maxScore) * 100, // 100점 만점으로 변환
          fullMark: 100
        };
      });
      
      return (
        <div className="results-page">
          <h2>일본 비즈니스 적응력 진단 결과</h2>
          
          <div className="result-summary">
            <div className="result-score">
              <h3>당신의 점수</h3>
              <div className="score-circle">
                <span>{totalScore}점</span>
              </div>
              <h3 className="result-label">{result?.level}</h3>
            </div>
            
            <div className="result-description">
              <p>{result?.description}</p>
            </div>
          </div>
          
          <div className="result-details">
            <h3>영역별 점수</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={categoryScores}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar name="적응력 점수" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="navigation">
            <button onClick={() => {
              setAppState(APP_STATES.HOME);
              setCurrentStep(0);
              setAnswers({});
              setCurrentTest(null);
            }}>
              홈으로 돌아가기
            </button>
          </div>
        </div>
      );
    }
    
    // 일본어 수준 검사 결과
    if (currentTest === 'japan_life_test') {
      // 정답 개수 계산
      let correctCount = 0;
      let wrongAnswers = [];
      
      JAPAN_LANGUAGE_TEST.questions.forEach(question => {
        if (answers[question.id]) {
          if (answers[question.id] === question.correctAnswer) {
            correctCount++;
          } else {
            wrongAnswers.push({
              question: question.text,
              userAnswer: question.options.find(opt => opt.value === answers[question.id])?.label,
              correctAnswer: question.options.find(opt => opt.value === question.correctAnswer)?.label,
              explanation: question.explanation
            });
          }
        }
      });
      
      // 점수 범위에 따른 결과 판정
      const result = JAPAN_LANGUAGE_TEST.interpretation.scores.find(
        range => correctCount >= range.min && correctCount <= range.max
      );
      
      return (
        <div className="results-page">
          <h2>일본어 능력 검사 결과</h2>
          
          <div className="result-summary">
            <div className="result-score">
              <h3>당신의 점수</h3>
              <div className="score-circle">
                <span>{correctCount}/10</span>
              </div>
              <h3 className="result-label">{result?.level}</h3>
            </div>
            
            <div className="result-description">
              <p>{result?.description}</p>
            </div>
          </div>
          
          {wrongAnswers.length > 0 && (
            <div className="result-details">
              <h3>오답 노트</h3>
              <div className="wrong-answers">
                {wrongAnswers.map((item, index) => (
                  <div key={index} className="wrong-answer-item">
                    <p className="question"><strong>문제:</strong> {item.question}</p>
                    <p className="user-answer"><strong>내 답변:</strong> {item.userAnswer}</p>
                    <p className="correct-answer"><strong>정답:</strong> {item.correctAnswer}</p>
                    <p className="explanation"><strong>해설:</strong> {item.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="navigation">
            <button onClick={() => {
              setAppState(APP_STATES.HOME);
              setCurrentStep(0);
              setAnswers({});
              setCurrentTest(null);
            }}>
              홈으로 돌아가기
            </button>
          </div>
        </div>
      );
    }
    
    // 기존 산업 적합도 검사 결과
    const industryScores = calculateIndustryFit();
    
    // 점수를 기반으로 정렬된 산업 데이터 생성
    const sortedIndustryData = Object.keys(industryScores)
      .map(industry => ({
        name: industry,
        value: industryScores[industry]  // score를 value로 변경
      }))
      .sort((a, b) => b.value - a.value)  // 정렬 기준도 변경
      .slice(0, 5); // 상위 5개만 표시
    
    // 레이더 차트 데이터
    const categoryScores = CATEGORIES.map(category => {
      const categoryQuestions = QUESTIONS.filter(q => q.category === category.id);
      let total = 0;
      let count = 0;
      
      categoryQuestions.forEach(question => {
        if (answers[question.id]) {
          total += normalizeResponse(question, answers[question.id]);
          count++;
        }
      });
      
      const average = count > 0 ? (total / count) * 20 : 0; // 0-100 범위로 변환
      
      return {
        subject: category.name,
        A: average,
        fullMark: 100
      };
    });
    
    // 특성별 점수 계산
    const traitScores = {};
    
    // 모든 업종에서 언급된 특성들을 수집
    Object.values(INDUSTRY_TRAITS).forEach(industry => {
      industry.traits.forEach(trait => {
        if (!traitScores[trait.name]) {
          traitScores[trait.name] = { score: 0, count: 0 };
        }
      });
    });
    
    // 각 질문에 대한 응답을 기반으로 특성 점수 계산
    Object.keys(answers).forEach(questionId => {
      const relatedTraits = QUESTION_TRAIT_MAPPING[questionId] || [];
      const answer = answers[questionId];
      const question = QUESTIONS.find(q => q.id === questionId);
      
      if (question && answer) {
        const normalizedScore = normalizeResponse(question, answer);
        
        relatedTraits.forEach(trait => {
          if (traitScores[trait]) {
            traitScores[trait].score += normalizedScore;
            traitScores[trait].count += 1;
          }
        });
      }
    });
    
    // 특성별 등장 빈도 계산
    const traitFrequency = {};
    Object.keys(QUESTION_TRAIT_MAPPING).forEach(questionId => {
      const traits = QUESTION_TRAIT_MAPPING[questionId] || [];
      traits.forEach(trait => {
        traitFrequency[trait] = (traitFrequency[trait] || 0) + 1;
      });
    });
    
    // 산업별 특성 중요도 계산
    const industryTraitImportance = {};
    Object.keys(INDUSTRY_TRAITS).forEach(industry => {
      INDUSTRY_TRAITS[industry].traits.forEach(trait => {
        if (!industryTraitImportance[trait.name]) {
          industryTraitImportance[trait.name] = 0;
        }
        // 각 산업에서의 가중치(1-5)를 합산
        industryTraitImportance[trait.name] += trait.weight;
      });
    });
    
    // 평균 특성 점수 계산 및 정렬 (균형 조정 알고리즘 적용)
    const sortedTraits = Object.keys(traitScores)
      .map(trait => {
        // 기본 점수 계산
        const baseScore = traitScores[trait].count > 0 
          ? (traitScores[trait].score / traitScores[trait].count) * 20
          : 0;
        
        // 등장 빈도에 따른 보정 계수 (등장 빈도가 낮을수록 가중치 증가)
        const frequencyFactor = traitFrequency[trait] 
          ? 1 + (1 / Math.max(1, traitFrequency[trait]))
          : 1;
        
        // 산업 중요도에 따른 보정 계수
        const importanceFactor = industryTraitImportance[trait]
          ? 1 + (industryTraitImportance[trait] / 50) // 최대 30% 가중치 부여
          : 1;
          
        // 균형 조정된 최종 점수 계산
        const balancedScore = baseScore * frequencyFactor * importanceFactor;
        
        return {
          name: trait,
          score: Math.round(balancedScore),
          // 개발 및 디버깅용 정보 (나중에 제거 가능)
          debug: {
            baseScore: Math.round(baseScore),
            frequencyFactor: frequencyFactor.toFixed(2),
            importanceFactor: importanceFactor.toFixed(2)
          }
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // 상위 3개 특성만 선택
    
    // 특성별 해석 및 어필 포인트
    const traitInterpretations = {
      '분석적이고 정확한': {
        interpretation: '복잡한 정보를 체계적으로 분석하고 정확한 결론을 도출하는 능력이 뛰어납니다.',
        appealPoints: [
          '데이터 기반 의사결정을 통해 프로젝트의 성공률을 높인 경험을 강조하세요.',
          '복잡한 문제를 체계적으로 분석하여 효율적인 해결책을 찾은 사례를 언급하세요.'
        ]
      },
      '실용적이고 기술적으로 정확한': {
        interpretation: '실질적인 문제 해결에 초점을 맞추고 기술적 정확성을 중요시하는 능력이 있습니다.',
        appealPoints: [
          '기술적 정확성을 통해 품질을 향상시킨 프로젝트 사례를 강조하세요.',
          '실용적인 솔루션으로 비용과.시간을 절약한 경험을 구체적으로 설명하세요.'
        ]
      },
      '실용적이고 솔루션 지향적인': {
        interpretation: '문제에 대한 실질적인 해결책을 찾고 효과적으로 실행하는 능력이 뛰어납니다.',
        appealPoints: [
          '실용적인 접근법으로 복잡한 비즈니스 문제를 해결한 경험을 강조하세요.',
          '솔루션 중심 사고로 팀이나 프로젝트의 효율성을 높인 사례를 설명하세요.'
        ]
      },
      '데이터 중심적이고 객관적인': {
        interpretation: '감정이나 주관적 판단보다 데이터와 사실에 기반하여 의사결정을 내리는 능력이 있습니다.',
        appealPoints: [
          '데이터 기반 분석을 통해 중요한 비즈니스 통찰력을 제공한 경험을 강조하세요.',
          '객관적인 평가와 측정을 통해 프로젝트 성과를 개선한 사례를 설명하세요.'
        ]
      },
      '기술에 능통하고 트렌드에 민감한': {
        interpretation: '새로운 기술을 빠르게 습득하고 최신 트렌드를 비즈니스에 적용하는 능력이 뛰어납니다.',
        appealPoints: [
          '최신 기술 트렌드를 활용하여 혁신적인 솔루션을 개발한 경험을 강조하세요.',
          '디지털 전환 프로젝트에서 기술적 리더십을 발휘한 사례를 설명하세요.'
        ]
      },
      '기술적으로 전문적이고 최신 트렌드에 민감한': {
        interpretation: '전문적인 기술 지식을 보유하고 있으며, 업계의 최신 동향을 파악하고 적용하는 능력이 있습니다.',
        appealPoints: [
          '새로운 기술 트렌드를 비즈니스에 성공적으로 통합한 경험을 강조하세요.',
          '기술적 전문성을 바탕으로 혁신적인 솔루션을 개발한 사례를 설명하세요.'
        ]
      },
      '기술적으로 유능하고 문제 해결에 능한': {
        interpretation: '기술적 지식을 바탕으로 실질적인 문제를 효과적으로 해결하는 능력이 뛰어납니다.',
        appealPoints: [
          '기술적 난제를 해결하여 업무 효율성을 크게 향상시킨 경험을 이야기하세요.',
          '복잡한 기술 문제를 단계적으로 해결한 과정과 결과를 구체적으로 설명하세요.'
        ]
      },
      '체계적이고 구조적 사고가 가능한': {
        interpretation: '복잡한 상황에서도 체계적으로 접근하여 구조화된 해결책을 제시할 수 있습니다.',
        appealPoints: [
          '복잡한 프로젝트를 체계적으로 구조화하여 성공적으로 관리한 경험을 강조하세요.',
          '구조적 사고를 통해 비즈니스 프로세스를 최적화한 사례를 제시하세요.'
        ]
      },
      '글로벌 시장에 민감하고 통찰력 있는': {
        interpretation: '글로벌 비즈니스 환경에 대한 깊은 이해와 통찰력을 바탕으로 전략적 결정을 내릴 수 있습니다.',
        appealPoints: [
          '글로벌 시장 트렌드를 분석하여 비즈니스 기회를 발굴한 경험을 강조하세요.',
          '국제적 환경에서의 성공적인 프로젝트 경험과 그로부터 얻은 통찰력을 공유하세요.'
        ]
      },
      '세심하고 품질 지향적인': {
        interpretation: '작은 디테일까지 주의를 기울이며 품질에 높은 가치를 두는 특성이 있습니다.',
        appealPoints: [
          '품질 관리 프로세스를 개선하여 제품이나 서비스의 품질을 향상시킨 경험을 강조하세요.',
          '세심한 관찰을 통해 개선 기회를 발견하고 실행한 사례를 설명하세요.'
        ]
      },
      '효율적이고 계획적인': {
        interpretation: '자원과 시간을 효율적으로 사용하며 체계적으로 계획하고 실행하는 능력이 있습니다.',
        appealPoints: [
          '효율적인 계획 수립을 통해 프로젝트를 기한 내에 성공적으로 완료한 경험을 강조하세요.',
          '제한된 자원을 효율적으로 활용하여 최대의 성과를 이끌어 낸 사례를 설명하세요.'
        ]
      },
      '개선 지향적이고 끊임없이 발전하는': {
        interpretation: '현재에 안주하지 않고 지속적인 개선과 발전을 추구하는 자세가 있습니다.',
        appealPoints: [
          '프로세스나 시스템을 개선하여 효율성을 크게 높인 경험을 강조하세요.',
          '자기 개발을 통해 전문성을 키우고 이를 업무에 적용한 사례를 설명하세요.'
        ]
      },
      '논리적이고 분석적인': {
        interpretation: '논리적 사고를 바탕으로 문제의 원인과 해결책을 명확하게 파악하는 능력이 있습니다.',
        appealPoints: [
          '논리적 분석을 통해 비즈니스 프로세스를 개선한 경험을 이야기하세요.',
          '데이터 분석을 통해 중요한 인사이트를 도출하고 적용한 사례를 제시하세요.'
        ]
      },
      '대인관계가 원활하고 신뢰감 있는': {
        interpretation: '다양한 사람들과 효과적으로 소통하고 긍정적인 관계를 구축하는 능력이 있습니다.',
        appealPoints: [
          '팀 내 갈등을 조율하고 협력적인 환경을 조성한 경험을 강조하세요.',
          '다양한 이해관계자들과 신뢰 관계를 구축하여 프로젝트를 성공시킨 사례를 공유하세요.'
        ]
      },
      '창의적이고 독창적인': {
        interpretation: '기존 틀에서 벗어나 새롭고 혁신적인 아이디어를 제시하는 능력이 있습니다.',
        appealPoints: [
          '창의적인 접근법으로 기존 문제를 혁신적으로 해결한 경험을 강조하세요.',
          '독창적인 아이디어를 통해 프로젝트나 제품의 가치를 높인 사례를 설명하세요.'
        ]
      },
      '효율적이고 조직력 있는': {
        interpretation: '제한된 자원에서 최대의 결과를 도출할 수 있는 효율성과, 업무를 체계적으로 관리하는 능력이 있습니다.',
        appealPoints: [
          '시간과 자원을 효율적으로 관리하여 프로젝트를 기한 내에 완료한 경험을 이야기하세요.',
          '조직력을 발휘해 복잡한 업무를 체계적으로 처리하여 성과를 높인 사례를 공유하세요.'
        ]
      },
      '고객 중심적이고 서비스 지향적인': {
        interpretation: '고객의 니즈와 기대를 이해하고 이를 충족시키기 위해 노력하는 자세가 돋보입니다.',
        appealPoints: [
          '고객 만족도를 향상시키기 위한 이니셔티브를 주도한 경험을 강조하세요.',
          '고객 피드백을 적극적으로 수용하여 서비스나 제품을 개선한 사례를 설명하세요.'
        ]
      },
      '안정적이고 신뢰할 수 있는': {
        interpretation: '어떤 상황에서도 일관되게 책임감 있게 업무를 수행하며 주변에 신뢰를 주는 특성이 있습니다.',
        appealPoints: [
          '어려운 상황에서도 안정적으로 성과를 유지한 경험을 이야기하세요.',
          '책임감 있는 태도로 팀원들의 신뢰를 얻고 리더십을 발휘한 사례를 공유하세요.'
        ]
      },
      '트렌드에 민감하고 창의적인': {
        interpretation: '최신 트렌드를 빠르게 파악하고 이를 창의적으로 활용하는 능력이 있습니다.',
        appealPoints: [
          '시장 트렌드를 분석하고 이를 비즈니스 전략에 성공적으로 적용한 경험을 강조하세요.',
          '트렌드를 창의적으로 해석하여 새로운 기회를 발굴한 사례를 설명하세요.'
        ]
      },
      '적응력 있는': {
        interpretation: '새로운 환경과 변화하는 상황에 빠르게 적응하고 유연하게 대처하는 능력이 있습니다.',
        appealPoints: [
          '급변하는 시장 환경에 신속하게 적응하여 비즈니스 성과를 유지한 경험을 이야기하세요.',
          '예상치 못한 문제에 유연하게 대처하고 위기를 기회로 전환한 사례를 공유하세요.'
        ]
      },
      '체계적이고 효율적인': {
        interpretation: '업무를 체계적으로 계획하고 효율적으로 실행하는 능력이 뛰어납니다.',
        appealPoints: [
          '복잡한 프로젝트를 체계적으로 관리하여 시간과 자원을 절약한 경험을 강조하세요.',
          '업무 프로세스를 효율화하여 팀의 생산성을 크게 향상시킨 사례를 설명하세요.'
        ]
      },
      '공감능력이 뛰어난': {
        interpretation: '타인의 감정과 상황을 이해하고 공감하는 능력이 뛰어납니다.',
        appealPoints: [
          '다양한 이해관계자들의 요구사항을 공감적으로 듣고 해결책을 제시한 경험을 강조하세요.',
          '팀원들의 어려움을 공감하고 지원하여 팀워크를 향상시킨 사례를 설명하세요.'
        ]
      },
      '책임감 있는': {
        interpretation: '맡은 일에 책임을 다하고 끝까지 완수하는 성실함이 돋보입니다.',
        appealPoints: [
          '어려운 상황에서도 책임감 있게 업무를 완수한 경험을 강조하세요.',
          '팀 프로젝트에서 책임감 있는 리더십을 발휘하여 성과를 달성한 사례를 설명하세요.'
        ]
      },
      '협업을 잘하는': {
        interpretation: '팀원들과 효과적으로 협력하여 시너지를 창출하는 능력이 있습니다.',
        appealPoints: [
          '다양한 역할과 배경을 가진 사람들과 협업하여 프로젝트를 성공시킨 경험을 강조하세요.',
          '팀 내 협업 문화를 조성하여 생산성을 높인 사례를 설명하세요.'
        ]
      },
      '전략적 사고가 가능한': {
        interpretation: '장기적인 목표와 큰 그림을 보며 전략적으로 계획하고 실행하는 능력이 있습니다.',
        appealPoints: [
          '전략적 접근을 통해 비즈니스 목표를 달성한 경험을 강조하세요.',
          '복잡한 상황에서 전략적 방향을 설정하고 팀을 리드한 사례를 설명하세요.'
        ]
      },
      '커뮤니케이션 능력이 뛰어난': {
        interpretation: '자신의 생각과 아이디어를 명확하게 전달하고 효과적으로 소통하는 능력이 있습니다.',
        appealPoints: [
          '복잡한 정보를 쉽게 이해시키는 커뮤니케이션 능력을 발휘한 경험을 강조하세요.',
          '효과적인.커뮤니케이션을 통해 이해관계자들을 설득하고 협력을 이끌어낸 사례를 설명하세요.'
        ]
      },
      '독립적이고 자기주도적인': {
        interpretation: '스스로 목표를 설정하고 주도적으로 업무를 수행하는 능력이 뛰어납니다.',
        appealPoints: [
          '자기주도적으로 새로운 프로젝트를 기획하고 실행한 경험을 강조하세요.',
          '독립적으로 문제를 해결하고 성과를 창출한 사례를 설명하세요.'
        ]
      },
      '조직력 있는': {
        interpretation: '복잡한 정보와 자원을 체계적으로 정리하고 관리하는 능력이 있습니다.',
        appealPoints: [
          '효율적인 조직 시스템을 구축하여 업무 효율성을 높인 경험을 강조하세요.',
          '다양한 업무와 프로젝트를 체계적으로 관리하여 성공적으로 완수한 사례를 설명하세요.'
        ]
      },
      '리더십 있는': {
        interpretation: '팀을 이끌고 동기부여하며 목표 달성을 위해 영향력을 발휘하는 능력이 있습니다.',
        appealPoints: [
          '팀을 리드하여 도전적인 목표를 달성한 경험을 강조하세요.',
          '리더로서 팀원들의 잠재력을 끌어내고 성장을 도운 사례를 설명하세요.'
        ]
      },
      '꼼꼼하고 규정을 준수하는': {
        interpretation: '세부 사항에 주의를 기울이고 규정과 프로세스를 철저히 준수하는 성실함이 있습니다.',
        appealPoints: [
          '정확한 업무 처리와 규정 준수를 통해 오류를 최소화한 경험을 강조하세요.',
          '복잡한 규정이나 절차를 성공적으로 관리하여 프로젝트를 안정적으로 진행한 사례를 설명하세요.'
        ]
      },
      '신중하고 리스크에 민감한': {
        interpretation: '결정을 내리기 전 잠재적 위험을 식별하고 평가하는 능력이 뛰어납니다.',
        appealPoints: [
          '리스크 분석을 통해 중요한 의사결정 과정에서 불필요한 손실을 방지한 경험을 강조하세요.',
          '위기 상황에서 신중한 판단으로 문제를 효과적으로 해결한 사례를 설명하세요.'
        ]
      },
      '국제적 감각이 있고 적응력 있는': {
        interpretation: '다양한 문화와 환경에 빠르게 적응하고 글로벌 시각으로 업무를 수행하는 능력이 있습니다.',
        appealPoints: [
          '국제적 프로젝트나 팀에서 문화적 차이를 효과적으로 관리한 경험을 강조하세요.',
          '해외 비즈니스나 글로벌 시장에서의 성공적인 적응 사례를 설명하세요.'
        ]
      },
      '다국어에 유창하고 친절한': {
        interpretation: '여러 언어로 소통할 수 있는 능력과 따뜻한 인간관계를 형성하는 친절함을 갖추고 있습니다.',
        appealPoints: [
          '언어 능력을 활용하여 국제 비즈니스에서 커뮤니케이션 장벽을 해소한 경험을 강조하세요.',
          '다양한 문화적 배경을 가진 사람들과 친절하고 효과적으로 소통한 사례를 설명하세요.'
        ]
      },
      '서비스 정신이 투철하고 세심한': {
        interpretation: '타인의 필요를 예상하고 최상의 서비스를 제공하기 위해 노력하는 태도가 있습니다.',
        appealPoints: [
          '고객 경험을 향상시키기 위한 세심한 서비스 개선 노력을 강조하세요.',
          '어려운 상황에서도 뛰어난 서비스 정신으로 고객 만족도를 높인 사례를 설명하세요.'
        ]
      },
      '대인관계가 원활하고 사람을 잘 이해하는': {
        interpretation: '다양한 성격의 사람들과 원활하게 소통하고 그들의 필요와 감정을 잘 이해하는 능력이 있습니다.',
        appealPoints: [
          '다양한 이해관계자들 사이에서 원활한 관계를 구축하고 협력을 이끌어낸 경험을 강조하세요.',
          '갈등 상황에서 상대방의 입장을 이해하고 효과적으로 중재한 사례를 설명하세요.'
        ]
      },
      '교육적이고 인내심 있는': {
        interpretation: '지식과 기술을 효과적으로 전달하고 타인의 성장을 돕는 인내심을 갖추고 있습니다.',
        appealPoints: [
          '복잡한 개념이나 기술을 다른 사람들이 이해하기 쉽게 설명한 경험을 강조하세요.',
          '인내심을 가지고 팀원이나 동료의 성장을 지원한 사례를 설명하세요.'
        ]
      },
      '마케팅에 능숙하고 창의적인': {
        interpretation: '제품이나 서비스의 가치를 효과적으로 알리고 창의적인 마케팅 전략을 개발하는 능력이 있습니다.',
        appealPoints: [
          '창의적인 마케팅 캠페인을 통해 브랜드 인지도나 매출을 향상시킨 경험을 강조하세요.',
          '새로운 마케팅 접근법으로 기존 고객 유지 및 신규 고객 확보에 성공한 사례를 설명하세요.'
        ]
      },
      '전략적이고 시장 감각이 뛰어난': {
        interpretation: '시장 트렌드를 예측하고 비즈니스 전략을 효과적으로 수립하는 능력이 있습니다.',
        appealPoints: [
          '시장 분석을 통해 비즈니스 기회를 발견하고 성공적으로 활용한 경험을 강조하세요.',
          '전략적 사고를 바탕으로 조직의 경쟁력을 향상시킨 사례를 설명하세요.'
        ]
      },
      '국제적 감각이 있고 협상에 능한': {
        interpretation: '다양한 배경을 가진 사람들과 국제적인 환경에서 원활히 소통하고 협상하는 능력이 있습니다. 이는 글로벌 프로젝트 및 국제 비즈니스에 중요한 자질입니다.',
        appealPoints: [
          '국제적인 프로젝트/팀에서 성공적으로 조정했던 경험을 강조하세요.',
          '다양한 문화적 배경을 가진 사람들과 효과적으로 소통한 사례를 준비하세요.'
        ]
      },
      '디지털에 정통하고 트렌드를 선도하는': {
        interpretation: '디지털 기술에 능숙하며 새로운 디지털 트렌드를 빠르게 파악하고 적용하는 능력이 있습니다.',
        appealPoints: [
          '디지털 트랜스포메이션 이니셔티브를 성공적으로 이끈 경험을 강조하세요.',
          '새로운 디지털 도구나 플랫폼을 도입하여 비즈니스 프로세스를 개선한 사례를 설명하세요.'
        ]
      },
      '사교적이고 관계 구축에 능한': {
        interpretation: '다양한 사람들과 쉽게 어울리고 지속적인 관계를 구축하는 능력이 뛰어납니다.',
        appealPoints: [
          '인적 네트워크를 활용하여 비즈니스 기회를 창출한 경험을 강조하세요.',
          '팀 내 긍정적인 관계를 구축하여 협업 효율성을 높인 사례를 설명하세요.'
        ]
      },
      '데이터에 민감하고 통찰력 있는': {
        interpretation: '데이터를 효과적으로 분석하고 의미 있는 통찰력을 도출하는 능력이 있습니다.',
        appealPoints: [
          '데이터 분석을 통해 중요한 비즈니스 결정을 뒷받침한 경험을 강조하세요.',
          '통계적 통찰력을 바탕으로 새로운 비즈니스 기회나 개선점을 발견한 사례를 설명하세요.'
        ]
      },
      '명료하고 설득력 있는': {
        interpretation: '복잡한 개념을 명확하게 전달하고 효과적으로 설득하는 능력이 있습니다.',
        appealPoints: [
          '설득력 있는 프레젠테이션으로 중요한 이해관계자들의 지지를 얻은 경험을 강조하세요.',
          '명료한 커뮤니케이션으로 팀원들에게 비전을 효과적으로 전달한 사례를 설명하세요.'
        ]
      },
      '조직적이고 책임감 있는': {
        interpretation: '업무를 체계적으로 관리하고 맡은 바 책임을 다하는 태도가 있습니다.',
        appealPoints: [
          '복잡한 프로젝트를 체계적으로 관리하여 기한 내에 완료한 경험을 강조하세요.',
          '책임감 있는 접근으로 위기 상황을 성공적으로 극복한 사례를 설명하세요.'
        ]
      },
      '전문적이고 박식한': {
        interpretation: '자신의 분야에 대한 깊은 지식과 다양한 주제에 대한 폭넓은 이해를 갖추고 있습니다.',
        appealPoints: [
          '전문적 지식을 활용하여 복잡한 문제를 해결한 경험을 강조하세요.',
          '다양한 분야의 지식을 통합하여 혁신적인 해결책을 제시한 사례를 설명하세요.'
        ]
      },
      '창의적이고 추진력 있는': {
        interpretation: '독창적인 아이디어를 떠올리고 이를 실행에 옮기는 추진력이 있습니다.',
        appealPoints: [
          '창의적 아이디어를 실제 프로젝트로 발전시킨 경험을 강조하세요.',
          '불가능해 보이는 도전에 창의적으로 접근하여 성공적으로 완수한 사례를 설명하세요.'
        ]
      },
      '예리하고 판단력이 뛰어난': {
        interpretation: '상황을 정확히 파악하고 현명한 판단을 내리는 능력이 뛰어납니다.',
        appealPoints: [
          '복잡한 상황에서 예리한 통찰력으로 핵심 문제를 파악한 경험을 강조하세요.',
          '빠르고 정확한 판단으로 중요한 비즈니스 기회를 포착한 사례를 설명하세요.'
        ]
      },
      '규정에 정통하고 책임감 있는': {
        interpretation: '관련 규정과 법규를 잘 이해하고 책임감 있게 업무를 수행하는 능력이 있습니다.',
        appealPoints: [
          '복잡한 규제 환경에서 컴플라이언스를 성공적으로 관리한 경험을 강조하세요.',
          '높은 책임감으로 중요한 프로젝트나 업무를 성공적으로 이끈 사례를 설명하세요.'
        ]
      },
      '협력적이고 팀워크에 능한': {
        interpretation: '다른 팀원들과 효과적으로 협력하여 공동의 목표를 달성하는 능력이 있습니다.',
        appealPoints: [
          '팀 협업을 통해 복잡한 문제를 해결하거나 프로젝트를 성공시킨 경험을 강조하세요.',
          '다양한 부서나 팀과의 협력을 통해 조직의 목표 달성에 기여한 사례를 설명하세요.'
        ]
      },
      '혁신적이고 창의적인': {
        interpretation: '기존의 방식에서 벗어나 새롭고 혁신적인 접근법을 개발하는 능력이 있습니다.',
        appealPoints: [
          '혁신적인 아이디어로 비즈니스 프로세스나 제품을 개선한 경험을 강조하세요.',
          '창의적 사고를 통해 기존의 문제에 대한 새로운 해결책을 제시한 사례를 설명하세요.'
        ]
      },
      '환경 의식이 높고 미래 지향적인': {
        interpretation: '환경 보호에 대한 높은 관심을 가지고 미래 지향적인 관점에서 결정을 내리는 능력이 있습니다.',
        appealPoints: [
          '지속가능한 비즈니스 프랙티스를 도입하거나 개선한 경험을 강조하세요.',
          '환경 친화적인 솔루션을 개발하거나 도입하여 조직의 환경 영향을 줄인 사례를 설명하세요.'
        ]
      },
      '기술적으로 능숙하고 정확한': {
        interpretation: '기술적인 업무를 정확하고 효율적으로 수행하는 능력이 있습니다.',
        appealPoints: [
          '기술적 문제를 정확하게 진단하고 해결한 경험을 강조하세요.',
          '정확한 기술적 작업을 통해 프로젝트의 품질과 효율성을 향상시킨 사례를 설명하세요.'
        ]
      },
      '분석적이고 환경에 민감한': {
        interpretation: '주변 환경과 상황을 분석적으로 파악하고 적절하게 대응하는 능력이 있습니다.',
        appealPoints: [
          '환경 변화를 분석하고 이에 맞게 전략을 조정한 경험을 강조하세요.',
          '분석적 접근을 통해 환경 관련 문제를 해결하거나 개선한 사례를 설명하세요.'
        ]
      },
      '세심하고 정확한': {
        interpretation: '작은 세부사항까지 놓치지 않고 정확하게 업무를 처리하는 능력이 뛰어납니다.',
        appealPoints: [
          '세심한 주의력으로 중요한 오류를 발견하고 해결한 경험을 강조하세요.',
          '정확성이 요구되는 복잡한 업무를 성공적으로 완수한 사례를 설명하세요.'
        ]
      },
      '체계적이고 전략적인': {
        interpretation: '전체적인 관점에서 체계적으로 계획하고 전략적으로 실행하는 능력이 있습니다.',
        appealPoints: [
          '복잡한 프로젝트를 체계적으로 계획하고 전략적으로 실행한 경험을 강조하세요.',
          '장기적 목표 달성을 위한 전략적 접근법을 성공적으로 적용한 사례를 설명하세요.'
        ]
      },
      '전략적이고 계획적인': {
        interpretation: '장기적인 목표를 위한 전략을 수립하고 체계적으로 계획하는 능력이 뛰어납니다.',
        appealPoints: [
          '전략적 계획 수립을 통해 조직의 목표를 달성한 경험을 강조하세요.',
          '복잡한 상황에서 장기적 관점의 계획을 성공적으로 실행한 사례를 설명하세요.'
        ]
      },
      '전략적이고 분석적인': {
        interpretation: '데이터와 정보를 분석하여 효과적인 전략을 수립하는 능력이 있습니다.',
        appealPoints: [
          '데이터 분석을 통해 효과적인 전략을 수립하고 실행한 경험을 강조하세요.',
          '분석적 사고를 바탕으로 비즈니스 문제에 대한 전략적 해결책을 제시한 사례를 설명하세요.'
        ]
      },
      '기술에 능통하고 혁신적': {
        interpretation: '새로운 기술을 빠르게 습득하고 혁신적인 방식으로 활용하는 능력이 있습니다.',
        appealPoints: [
          '새로운 기술을 활용하여 업무 프로세스를 혁신한 경험을 강조하세요.',
          '기술적 전문성과 혁신적 사고로 문제를 창의적으로 해결한 사례를 설명하세요.'
        ]
      },
      '창의적이고 예술적인': {
        interpretation: '예술적 감각과 창의성을 바탕으로 새로운 가치를 창출하는 능력이 있습니다.',
        appealPoints: [
          '창의적 발상으로 기존 접근법을 개선하거나 새로운 솔루션을 제시한 경험을 강조하세요.',
          '예술적 감각을 비즈니스나 제품/서비스 개발에 적용한 사례를 설명하세요.'
        ]
      },
      '경계심이 강하고 보안 의식이 높은': {
        interpretation: '잠재적 위험을 예측하고 보안을 중요시하는 경계심과 신중함을 갖추고 있습니다.',
        appealPoints: [
          '보안 위험을 사전에 발견하고 예방한 경험을 강조하세요.',
          '중요한 정보나 자산을 안전하게 보호하기 위한 체계를 구축한 사례를 설명하세요.'
        ]
      },
      '창의적이고 혁신을 추구하는': {
        interpretation: '기존의 틀에서 벗어나 새로운 아이디어와 혁신적인 접근법을 추구하는 성향이 있습니다.',
        appealPoints: [
          '창의적인 발상으로 혁신적인 솔루션을 개발한 경험을 강조하세요.',
          '전통적인 방식을 개선하여 효율성이나 효과성을 크게 향상시킨 사례를 설명하세요.'
        ]
      },
      '다재다능하고 유연한': {
        interpretation: '다양한 업무와 상황에 유연하게 적응하고 여러 분야에서 역량을 발휘하는 능력이 있습니다.',
        appealPoints: [
          '다양한 역할이나 프로젝트를 성공적으로 수행한 경험을 강조하세요.',
          '예상치 못한 상황에 유연하게 대처하여 문제를 해결한 사례를 설명하세요.'
        ]
      },
      '도전적이고 성취 지향적인': {
        interpretation: '새로운 도전을 두려워하지 않고 높은 목표를 설정하여 성취하는 성향이 있습니다.',
        appealPoints: [
          '도전적인 목표를 설정하고 이를 달성한 경험을 강조하세요.',
          '어려운 상황에서도 포기하지 않고 성공적인 결과를 이끌어낸 사례를 설명하세요.'
        ]
      },
      '고객 지향적이고 공감 능력이 높은': {
        interpretation: '고객의 니즈를 깊이 이해하고 공감하며 이에 적절히 대응하는 능력이 있습니다.',
        appealPoints: [
          '고객의 요구사항을 정확히 파악하고 만족스러운 해결책을 제공한 경험을 강조하세요.',
          '고객의 피드백을 바탕으로 서비스나 제품을 개선한 사례를 설명하세요.'
        ]
      },
      '시장 감각이 뛰어나고 창의적인': {
        interpretation: '시장 트렌드와 소비자 행동을 예민하게 파악하고 창의적인 마케팅 전략을 수립하는 능력이 있습니다.',
        appealPoints: [
          '시장 트렌드를 선제적으로 파악하고 이를 비즈니스에 적용한 경험을 강조하세요.',
          '창의적인 마케팅 아이디어로 브랜드 인지도나 매출을 향상시킨 사례를 설명하세요.'
        ]
      },
      '효율적이고 물류에 정통한': {
        interpretation: '자원을 효율적으로 관리하고 물류 시스템을 최적화하는 능력이 있습니다.',
        appealPoints: [
          '물류 프로세스를 개선하여 비용을 절감하거나 효율성을 높인 경험을 강조하세요.',
          '복잡한 공급망을 효과적으로 관리하여 운영 효율성을 향상시킨 사례를 설명하세요.'
        ]
      },
      '운영에 능숙하고 실용적인': {
        interpretation: '실질적인 비즈니스 운영에 능숙하며 실용적인 해결책을 제시하는 능력이 있습니다.',
        appealPoints: [
          '운영 프로세스를 최적화하여 효율성과 생산성을 향상시킨 경험을 강조하세요.',
          '실용적인 접근법으로 비즈니스 운영상의 문제를 해결한 사례를 설명하세요.'
        ]
      },
      '디지털에 능통하고 혁신적인': {
        interpretation: '디지털 기술에 능숙하며 혁신적인 디지털 솔루션을 개발하고 적용하는 능력이 있습니다.',
        appealPoints: [
          '디지털 기술을 활용하여 비즈니스 프로세스를 혁신한 경험을 강조하세요.',
          '혁신적인 디지털 솔루션을 통해 조직의 경쟁력을 강화한 사례를 설명하세요.'
        ]
      },
      '다국어에 능통하고 국제적인': {
        interpretation: '여러 언어를 구사하며 국제적인 환경에서 효과적으로 일할 수 있는 역량을 갖추고 있습니다.',
        appealPoints: [
          '다국어 능력을 활용하여 국제적인 프로젝트나 협업을 성공적으로 이끈 경험을 강조하세요.',
          '다양한 문화권의 사람들과 효과적으로 소통하고 협력한 사례를 설명하세요.'
        ]
      },
      '국제적 감각이 있고 협상에 능한_1': {
        interpretation: '다양한 배경을 가진 사람들과 국제적인 환경에서 원활히 소통하고 협상하는 능력이 있습니다. 이는 글로벌 프로젝트 및 국제 비즈니스에 중요한 자질입니다.',
        appealPoints: [
          '국제적인 프로젝트/팀에서 성공적으로 조정했던 경험을 강조하세요.',
          '다양한 문화적 배경을 가진 사람들과 효과적으로 소통한 사례를 준비하세요.'
        ]
      },
      '체계적이고 효율적인_1': {
        interpretation: '시스템적으로 업무를 접근하고 효율성을 극대화하는 능력이 있습니다. 이는 업무 프로세스 개선과 논리적인 업무 처리에 이상적입니다.',
        appealPoints: [
          '업무 프로세스를 최적화하거나 효율성을 개선한 사례를 구체적으로, 결과 중심적으로 설명하세요.',
          '체계적인 분석을 통해 문제를 해결했던 경험을 강조하세요.'
        ]
      }
    };
    
    // 최적 직업 찾기
    const topIndustry = sortedIndustryData[0]?.name;
    const topIndustryInfo = topIndustry ? INDUSTRY_TRAITS[topIndustry] : null;
    
    return (
      <div className="results-page">
        <h2>당신의 직업 적성 결과</h2>
        
        <div className="top-traits-section">
          <h3>가장 높게 나온 특성 Top 3</h3>
          <div className="top-traits-container">
            {sortedTraits.map((trait, index) => {
              const interpretation = traitInterpretations[trait.name] || {
                interpretation: '이 특성은 다양한 업무 환경에서 가치 있게 활용될 수 있습니다.',
                appealPoints: [
                  '이 특성을 활용하여 업무 성과를 향상시킨 구체적인 경험을 강조하세요.',
                  '이 특성이 특정 직무나 프로젝트에서 어떻게 도움이 되었는지 설명하세요.'
                ]
              };
              
              return (
                <div key={index} className="trait-card">
                  <h4>{index + 1}. {trait.name}</h4>
                  <p className="trait-interpretation">{interpretation.interpretation}</p>
                  <div className="appeal-points">
                    <p className="appeal-title">면접/자기소개서 어필 포인트:</p>
                    <ul>
                      {interpretation.appealPoints.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {topIndustryInfo && (
          <div className="top-result">
            <h3>최적 직업 분야: {topIndustry}</h3>
            <p>{topIndustryInfo.description}</p>
            <div className="industry-overview">
              <h4>산업 개요</h4>
              <p>{topIndustryInfo.overview}</p>
            </div>
          </div>
        )}
        
        <h3>산업별 적합도</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sortedIndustryData}> 
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} hide={true} />
              <Tooltip 
                formatter={(value) => ['']} 
                labelFormatter={(name) => name} 
                contentStyle={{ display: 'none' }}
              />
              <Bar dataKey="value" fill="#37a9f0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <h3>당신의 역량 프로필</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart outerRadius={90} data={categoryScores}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Tooltip formatter={(value) => ['']} />
              <Radar dataKey="A" stroke="#37a9f0" fill="#37a9f0" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        <button onClick={() => {
          setAppState(APP_STATES.HOME);
          setCurrentStep(0);
          setAnswers({});
        }}>다시 시작하기</button>
      </div>
    );
  };
  
  return (
    <div className="App">
      {renderHeader()}
      
      {appState === APP_STATES.HOME && renderHomePage()}
      {appState === APP_STATES.START && renderStartPage()}
      {appState === APP_STATES.SURVEY && renderSurveyPage()}
      {appState === APP_STATES.RESULTS && renderResultsPage()}
    </div>
  );
}

export default App;
