import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import './App.css';

// 앱 상태 관리를 위한 상수
const APP_STATES = {
  HOME: 'home',
  START: 'start',
  SURVEY: 'survey',
  PROCESSING: 'processing',
  RESULTS: 'results',
  BRAIN_TEST: 'brain_test'
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
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'mbti_test',
    title: 'MBTI 검사',
    description: '나도 몰랐던 내 성격은?',
    image: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'secret_test',
    title: '일본 사회생활 적합도 검사',
    description: '가깝고도 먼 일본에서 살아남을수 있을까?',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'brain_test',
    title: "뇌구조 테스트",
    description: "곧 오픈 예정",
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    testFunction: () => console.log("뇌구조 테스트 시작")
  },
  {
    id: 'secret_garden',
    title: '나의 비밀 정원 테스트',
    description: '곧 오픈 예정',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'language_test',
    title: '일본어 역량 검사',
    description: '일본어 얼마나 아시나요?',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=400&auto=format&fit=crop'
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
  '제조업': {
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
  '에너지': {
    traits: [
      { name: '전략적이고 계획적인', weight: 5 },
      { name: '규정에 정통하고 책임감 있는', weight: 4 },
      { name: '환경 의식이 높고 미래 지향적인', weight: 3 },
      { name: '기술적으로 능숙하고 정확한', weight: 2 },
      { name: '분석적이고 환경에 민감한', weight: 1 }
    ],
    description: '계획성과 책임감이 돋보이는 당신은 에너지 섹터와 부분적으로 일치합니다.',
    overview: '일본의 에너지 산업은 전통적인 발전 방식에서 재생 에너지로의 전환을 추진하고 있습니다. 후쿠시마 사태 이후 안전성과 지속가능성에 중점을 두며, 특히 재생 에너지 기술과 에너지 효율성 분야에서 혁신을 추구하고 있습니다.'
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
  '엔터테인먼트・레저': {
    traits: [
      { name: '고객 지향적이고 서비스 지향적인', weight: 5 },
      { name: '트렌드에 민감하고 창의적인', weight: 4 },
      { name: '창의적이고 예술적인', weight: 3 },
      { name: '전략적이고 시장 감각이 뛰어난', weight: 2 },
      { name: '국제적 감각이 있고 협상에 능한', weight: 1 }
    ],
    description: '고객 지향적이고 트렌드에 민감하며 창의적인 당신은 엔터테인먼트 및 레저 분야와 높은 적합성을 보입니다.',
    overview: '일본의 엔터테인먼트 및 레저 산업은 애니메이션, 게임, 음악, 영화부터 테마파크까지 다양한 분야를 포함합니다. 국제적으로 인정받는 콘텐츠를 제작하며, 특히 디지털 엔터테인먼트와 글로벌 콘텐츠 유통 분야에서 글로벌 인재를 찾고 있습니다.'
  },
  '광고・미디어': {
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
  'ws1': ['분석적이고 정확한', '논리적이고 분석적인', '데이터 중심적이고 객관적인'],  // 분석적 사고
  'ws2': ['창의적이고 독창적인', '혁신적이고 창의적인', '창의적이고 예술적인'],         // 창의성
  'ws3': ['체계적이고 구조적 사고가 가능한', '실용적이고 기술적으로 정확한', '효율적이고 계획적인'], // 작업 방식
  'ws4': ['세심하고 정확한', '꼼꼼하고 규정을 준수하는', '세심하고 품질 지향적인'], // 세부사항 주의력
  'ws5': ['전략적이고 분석적인', '체계적이고 전략적인', '효율적이고 계획적인'], // 역할 선호도
  // 커뮤니케이션 방식 질문
  'cm1': ['다국어에 능통하고 국제적인', '다국어에 유창하고 친절한', '국제적 감각이 있고 협상에 능한'], // 언어 능력
  'cm2': ['대인관계가 원활하고 신뢰감 있는', '사교적이고 관계 구축에 능한', '고객 중심적이고 서비스 지향적인'], // 커뮤니케이션 스타일
  'cm3': ['명료하고 설득력 있는', '전략적이고 분석적인', '전문적이고 박식한'], // 설명 능력
  'cm4': ['대인관계가 원활하고 신뢰감 있는', '조직적이고 책임감 있는', '대인관계가 원활하고 사람을 잘 이해하는'], // 갈등 해결
  'cm5': ['다국어에 능통하고 국제적인', '국제적 감각이 있고 적응력 있는', '사교적이고 관계 구축에 능한'], // 다문화 소통
  // 문제 해결 접근법 질문
  'ps1': ['분석적이고 정확한', '데이터 중심적이고 객관적인', '논리적이고 분석적인'], // 문제 해결 접근법
  'ps2': ['체계적이고 구조적 사고가 가능한', '신중하고 리스크에 민감한', '분석적이고 환경에 민감한'], // 체계적 분석
  'ps3': ['창의적이고 독창적인', '혁신적이고 창의적인', '실용적이고 솔루션 지향적인'], // 창의적 문제 해결
  'ps4': ['분석적이고 정확한', '신중하고 리스크에 민감한', '데이터 중심적이고 객관적인'], // 의사결정 방식
  'ps5': ['예리하고 판단력이 뛰어난', '전략적이고 분석적인', '창의적이고 독창적인'], // 다양한 관점
  // 환경 선호도 질문
  'en1': ['안정적이고 신뢰할 수 있는', '꼼꼼하고 규정을 준수하는', '효율적이고 조직력 있는'], // 업무 환경 선호
  'en2': ['체계적이고 구조적 사고가 가능한', '꼼꼼하고 규정을 준수하는', '세심하고 정확한'], // 규칙과 구조
  'en3': ['적응력 있는', '국제적 감각이 있고 적응력 있는', '트렌드에 민감하고 창의적인'], // 적응력
  'en4': ['효율적이고 조직력 있는', '협력적이고 팀워크에 능한', '대인관계가 원활하고 신뢰감 있는'], // 작업 방식
  'en5': ['효율적이고 조직력 있는', '적응력 있는', '다재다능하고 유연한'], // 멀티태스킹
  // 가치 및 동기 질문
  'va1': ['고객 중심적이고 서비스 지향적인', '서비스 정신이 투철하고 세심한', '대인관계가 원활하고 사람을 잘 이해하는'], // 서비스 지향
  'va2': ['개선 지향적이고 끊임없이 발전하는', '전문적이고 박식한', '기술에 능통하고 트렌드에 민감한'], // 성장 지향
  'va3': ['안정적이고 신뢰할 수 있는', '도전적이고 성취 지향적인', '창의적이고 독창적인'], // 핵심 가치
  'va4': ['혁신적이고 창의적인', '창의적이고 독창적인', '창의적이고 추진력 있는'], // 혁신 주도
  'va5': ['고객 중심적이고 서비스 지향적인', '도전적이고 성취 지향적인', '전략적이고 시장 감각이 뛰어난'] // 직업 동기
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

function App() {
  const [appState, setAppState] = useState(APP_STATES.HOME);
  const [currentCategory, setCurrentCategory] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentTest, setCurrentTest] = useState(null);
  
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
        <button className="header-button">❤️ 이용중인</button>
        <button className="header-button">🔄 랜덤선택</button>
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
              if (card.id === 'brain_test') {
                setAppState(APP_STATES.BRAIN_TEST);
                if (card.testFunction) card.testFunction();
              } else {
                setAppState(APP_STATES.START);
              }
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
          <h2>IQ 검사</h2>
          <p>대한민국의 평균 IQ는 106입니다. IQ 검사를 받으시고 자신의 IQ가 평균보다 높은지 확인하세요.</p>
        </div>
        <button className="iq-test-button">›</button>
      </div>
    </div>
  );
  
  // 시작 페이지
  const renderStartPage = () => (
    <div className="start-page">
      <h1>entry.ai 직업 적성 검사</h1>
      <p>당신의 성향과 특성을 분석하여 최적의 직업군을 알려드립니다. 설문 응답은 귀하의 적성을 분석하는 데 사용됩니다.</p>
      <button onClick={startSurvey}>시작하기</button>
    </div>
  );
  
  // 설문조사 페이지
  const renderSurveyPage = () => {
    // 현재 카테고리의 질문들을 필터링
    const currentCategoryQuestions = QUESTIONS.filter(q => q.category === CATEGORIES[currentCategory].id);
    
    // 현재 질문이 없는 경우 처리
    if (currentCategoryQuestions.length === 0 || currentQuestionIndex >= currentCategoryQuestions.length) {
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
    
    const currentQuestion = currentCategoryQuestions[currentQuestionIndex];
    
    return (
      <div className="survey-page">
        <h2>{CATEGORIES[currentCategory].icon} {CATEGORIES[currentCategory].name}</h2>
        <div className="questions">
          <div className="question">
            <p>{currentQuestion.text}</p>
            
            {currentQuestion.type === 'likert' ? (
              <div className="likert-scale">
                {[1, 2, 3, 4, 5].map(value => (
                  <button 
                    key={value} 
                    onClick={() => handleAnswer(currentQuestion.id, value)}
                    className={answers[currentQuestion.id] === value ? 'selected' : ''}
                  >
                    {value}
                  </button>
                ))}
              </div>
            ) : (
              <div className="choice-options">
                {currentQuestion.options.map((option, index) => (
                  <button 
                    key={option.value}
                    onClick={() => handleAnswer(currentQuestion.id, option.value)}
                    className={answers[currentQuestion.id] === option.value ? 'selected' : ''}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="navigation">
          <button 
            disabled={currentCategory === 0 && currentQuestionIndex === 0} 
            onClick={() => {
              if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
              } else if (currentCategory > 0) {
                const prevCategoryQuestions = QUESTIONS.filter(
                  q => q.category === CATEGORIES[currentCategory - 1].id
                );
                setCurrentCategory(currentCategory - 1);
                setCurrentQuestionIndex(prevCategoryQuestions.length - 1);
              }
            }}
          >
            이전
          </button>
          <button 
            onClick={() => {
              if (currentQuestionIndex < currentCategoryQuestions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
              } else if (currentCategory < CATEGORIES.length - 1) {
                setCurrentCategory(currentCategory + 1);
                setCurrentQuestionIndex(0);
              } else {
                setAppState(APP_STATES.RESULTS);
              }
            }}
          >
            {currentQuestionIndex < currentCategoryQuestions.length - 1 ? '다음' : 
             currentCategory < CATEGORIES.length - 1 ? '다음 섹션' : '결과 보기'}
          </button>
        </div>
      </div>
    );
  };
  
  // 결과 페이지
  const renderResultsPage = () => {
    const industryScores = calculateIndustryFit();
    
    // 점수를 기반으로 정렬된 산업 데이터 생성
    const sortedIndustryData = Object.keys(industryScores)
      .map(industry => ({
        name: industry,
        score: industryScores[industry]
      }))
      .sort((a, b) => b.score - a.score)
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
    
    // 평균 특성 점수 계산 및 정렬
    const sortedTraits = Object.keys(traitScores)
      .map(trait => ({
        name: trait,
        score: traitScores[trait].count > 0 
          ? Math.round((traitScores[trait].score / traitScores[trait].count) * 20) 
          : 0
      }))
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
                  <h4>{index + 1}. {trait.name} <span className="trait-score">({trait.score}점)</span></h4>
                  <p className="trait-interpretation">{interpretation.interpretation}</p>
                  <div className="appeal-points">
                    <h5>어필 포인트 (엔트리시트 작성, 면접 시)</h5>
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
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#37a9f0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <h3>당신의 역량 프로필</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart outerRadius={90} data={categoryScores}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="역량" dataKey="A" stroke="#37a9f0" fill="#37a9f0" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        <button onClick={() => {
          setAppState(APP_STATES.HOME);
          setCurrentCategory(0);
          setCurrentQuestionIndex(0);
          setAnswers({});
        }}>다시 시작하기</button>
      </div>
    );
  };
  
  // 뇌구조 테스트 페이지
  const renderBrainTestPage = () => {
    const brainTypes = [
      {
        id: 1,
        title: "분석적 뇌",
        description: "논리적 사고와 분석력이 뛰어나며, 복잡한 문제를 해결하는데 능숙합니다.",
        image: "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
      },
      {
        id: 2,
        title: "창의적 뇌",
        description: "상상력이 풍부하고 독창적인 아이디어를 생각해내는 능력이 뛰어납니다.",
        image: "https://images.unsplash.com/photo-1562564055-71e051d33c19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
      },
      {
        id: 3,
        title: "사회적 뇌",
        description: "타인의 감정을 이해하고 공감하는 능력이 뛰어나며, 대인관계에 능숙합니다.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
      },
      {
        id: 4,
        title: "실행적 뇌",
        description: "목표 지향적이고 실행력이 뛰어나며, 계획을 세우고 실천하는데 능숙합니다.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
      }
    ];

    const startBrainTest = (brainType) => {
      console.log(`${brainType.title} 테스트 시작`);
      setCurrentTest({
        name: brainType.title,
        description: brainType.description,
        questions: generateQuestions(brainType.id),
      });
      setAppState(APP_STATES.START);
    };

    const generateQuestions = (typeId) => {
      // 실제 구현에서는 각 뇌 유형에 맞는 질문들을 반환하면 됩니다
      const baseQuestions = [
        {
          question: "문제 해결 시 당신의 접근 방식은?",
          options: [
            "논리적인 분석을 통해 해결한다",
            "직관과 창의성을 활용한다",
            "다른 사람들과 협력하여 해결한다",
            "체계적인 계획을 세워 단계별로 접근한다"
          ]
        },
        {
          question: "스트레스 상황에서 당신은?",
          options: [
            "문제의 원인을 분석하고 해결책을 찾는다",
            "새로운 관점에서 상황을 바라본다",
            "주변 사람들과 대화하며 위안을 찾는다", 
            "할 일 목록을 만들고 우선순위를 정한다"
          ]
        },
        {
          question: "당신이 선호하는 학습 방식은?",
          options: [
            "개념과 이론을 분석하고 이해하기",
            "시각적 자료와 창의적 접근법 활용하기",
            "그룹 활동과 토론을 통한 학습",
            "실제 적용과 반복 연습을 통한 학습"
          ]
        }
      ];
      
      return baseQuestions;
    };

    return (
      <div className="brain-test-page">
        <h1 className="brain-test-title">뇌구조 테스트</h1>
        <p className="brain-test-description">
          자신의 뇌 구조 유형을 파악하면 자신의 강점과 약점을 이해하고, 더 나은 결정을 내리는 데 도움이 됩니다. 
          아래에서 자신과 가장 일치한다고 생각되는 뇌 유형을 선택하여 간단한 테스트를 진행해 보세요.
        </p>
        
        <div className="brain-types-grid">
          {brainTypes.map((brainType) => (
            <div key={brainType.id} className="brain-type-card">
              <div 
                className="brain-type-image" 
                style={{ backgroundImage: `url(${brainType.image})` }}
              ></div>
              <div className="brain-type-content">
                <h3>{brainType.title}</h3>
                <p>{brainType.description}</p>
                <button 
                  className="brain-test-button"
                  onClick={() => startBrainTest(brainType)}
                >
                  테스트 시작하기
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          className="back-button"
          onClick={() => setAppState(APP_STATES.HOME)}
        >
          홈으로 돌아가기
        </button>
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
      {appState === APP_STATES.BRAIN_TEST && renderBrainTestPage()}
    </div>
  );
}

export default App;
